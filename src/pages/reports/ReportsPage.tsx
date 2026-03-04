import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, FileText, Search, Download, Clock, Users,
  CheckCircle2, AlertCircle, Eye, Copy,
} from 'lucide-react'
import { format, subDays } from 'date-fns'

interface ShiftReport {
  id: string
  title: string
  date: string
  shift: string
  shiftType: 'opening' | 'afternoon' | 'closing'
  submittedBy: string
  submittedAt: string
  status: 'draft' | 'submitted' | 'approved' | 'revision_requested'
  reviewedBy?: string
  patronCount: number
  staffCount: number
  incidentCount: number
  tasksCompleted: number
  totalTasks: number
  facility: string
  highlights: string[]
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: FileText },
  submitted: { label: 'Submitted', variant: 'warning' as const, icon: Clock },
  approved: { label: 'Approved', variant: 'success' as const, icon: CheckCircle2 },
  revision_requested: { label: 'Needs Revision', variant: 'destructive' as const, icon: AlertCircle },
}

export function ReportsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')

  const filtered = mockReports.filter(r => {
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.submittedBy.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchShift = shiftFilter === 'all' || r.shiftType === shiftFilter
    return matchSearch && matchStatus && matchShift
  })

  const stats = {
    total: mockReports.length,
    approved: mockReports.filter(r => r.status === 'approved').length,
    pending: mockReports.filter(r => r.status === 'submitted').length,
    avgPatrons: Math.round(mockReports.reduce((sum, r) => sum + r.patronCount, 0) / mockReports.length),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Reports"
        subtitle="Daily operations and shift documentation"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button asChild>
              <Link to="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgPatrons}</p>
                <p className="text-xs text-muted-foreground">Avg Patrons/Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="revision_requested">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="opening">Opening</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No reports match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((report) => {
            const config = statusConfig[report.status]
            const StatusIcon = config.icon
            const completionPct = report.totalTasks > 0
              ? Math.round((report.tasksCompleted / report.totalTasks) * 100)
              : 0

            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold truncate">{report.title}</h3>
                        <Badge variant={config.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.submittedBy} · {report.shift} · {report.facility}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Date</p>
                          <p className="font-medium">{report.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Patrons</p>
                          <p className="font-medium">{report.patronCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Staff</p>
                          <p className="font-medium">{report.staffCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Incidents</p>
                          <p className="font-medium">{report.incidentCount > 0 ? (
                            <span className="text-destructive">{report.incidentCount}</span>
                          ) : '0'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Tasks</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-1.5">
                              <div
                                className="bg-primary rounded-full h-1.5"
                                style={{ width: `${completionPct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{completionPct}%</span>
                          </div>
                        </div>
                      </div>

                      {report.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {report.highlights.map((h, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

const mockReports: ShiftReport[] = [
  {
    id: '1',
    title: 'Morning Shift Report',
    date: format(new Date(), 'MMM d, yyyy'),
    shift: 'Opening (6:00 AM - 2:00 PM)',
    shiftType: 'opening',
    submittedBy: 'John Smith',
    submittedAt: format(new Date(), 'h:mm a'),
    status: 'approved',
    reviewedBy: 'Mike Director',
    patronCount: 245,
    staffCount: 8,
    incidentCount: 0,
    tasksCompleted: 24,
    totalTasks: 24,
    facility: 'Main Recreation Center',
    highlights: ['Pool chemistry normal', 'All equipment operational'],
  },
  {
    id: '2',
    title: 'Afternoon Shift Report',
    date: format(new Date(), 'MMM d, yyyy'),
    shift: 'Afternoon (2:00 PM - 10:00 PM)',
    shiftType: 'afternoon',
    submittedBy: 'Sarah Johnson',
    submittedAt: format(new Date(), 'h:mm a'),
    status: 'submitted',
    patronCount: 312,
    staffCount: 10,
    incidentCount: 1,
    tasksCompleted: 18,
    totalTasks: 20,
    facility: 'Main Recreation Center',
    highlights: ['Minor slip incident', 'High attendance', 'Treadmill #4 out of service'],
  },
  {
    id: '3',
    title: 'Evening Shift Report',
    date: format(subDays(new Date(), 1), 'MMM d, yyyy'),
    shift: 'Closing (10:00 PM - 12:00 AM)',
    shiftType: 'closing',
    submittedBy: 'Mike Williams',
    submittedAt: '11:45 PM',
    status: 'approved',
    reviewedBy: 'Mike Director',
    patronCount: 78,
    staffCount: 4,
    incidentCount: 0,
    tasksCompleted: 15,
    totalTasks: 15,
    facility: 'Main Recreation Center',
    highlights: ['All areas secured', 'Facility clean'],
  },
  {
    id: '4',
    title: 'Morning Shift Report',
    date: format(subDays(new Date(), 1), 'MMM d, yyyy'),
    shift: 'Opening (6:00 AM - 2:00 PM)',
    shiftType: 'opening',
    submittedBy: 'Lisa Chen',
    submittedAt: '2:15 PM',
    status: 'revision_requested',
    reviewedBy: 'Mike Director',
    patronCount: 198,
    staffCount: 7,
    incidentCount: 2,
    tasksCompleted: 20,
    totalTasks: 24,
    facility: 'Main Recreation Center',
    highlights: ['Pool pH high', '2 incidents', 'Missing chemistry readings'],
  },
  {
    id: '5',
    title: 'Afternoon Shift Report',
    date: format(subDays(new Date(), 2), 'MMM d, yyyy'),
    shift: 'Afternoon (2:00 PM - 10:00 PM)',
    shiftType: 'afternoon',
    submittedBy: 'David Park',
    submittedAt: '10:30 PM',
    status: 'draft',
    patronCount: 0,
    staffCount: 9,
    incidentCount: 0,
    tasksCompleted: 5,
    totalTasks: 20,
    facility: 'Main Recreation Center',
    highlights: [],
  },
]
