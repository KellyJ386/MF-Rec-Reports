import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, FileText, Search, Download, Clock, Users,
  CheckCircle2, AlertCircle, Eye, Copy, Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useShiftReports, useShiftReportsSubscription } from '@/hooks/useShiftReports'

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: FileText },
  submitted: { label: 'Submitted', variant: 'warning' as const, icon: Clock },
  approved: { label: 'Approved', variant: 'success' as const, icon: CheckCircle2 },
  revision_requested: { label: 'Needs Revision', variant: 'destructive' as const, icon: AlertCircle },
}

export function ReportsPage() {
  const { data: reports = [], isLoading, error } = useShiftReports()
  useShiftReportsSubscription() // Enable real-time updates

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')

  const filtered = useMemo(() => {
    return reports.filter(r => {
      const matchSearch = !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.submitted_by_profile?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.submitted_by_profile?.last_name?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      const matchShift = shiftFilter === 'all' || r.shift_type === shiftFilter
      return matchSearch && matchStatus && matchShift
    })
  }, [reports, search, statusFilter, shiftFilter])

  const stats = useMemo(() => ({
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => r.status === 'submitted').length,
    avgPatrons: reports.length > 0
      ? Math.round(reports.reduce((sum, r) => sum + (r.patron_count_total || 0), 0) / reports.length)
      : 0,
  }), [reports])

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
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading reports...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              <AlertCircle className="h-10 w-10 mx-auto mb-3" />
              <p>Error loading reports</p>
              <p className="text-sm mt-2">{error.message}</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
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
            const submitterName = report.submitted_by_profile
              ? `${report.submitted_by_profile.first_name} ${report.submitted_by_profile.last_name}`
              : 'Unknown'
            const shiftLabel = {
              opening: 'Opening',
              afternoon: 'Afternoon',
              closing: 'Closing',
              weekend_am: 'Weekend AM',
              weekend_pm: 'Weekend PM',
            }[report.shift_type] || report.shift_type
            const staffMembers = Array.isArray(report.staff_members) ? report.staff_members : []
            const highlights = Array.isArray(report.highlights) ? report.highlights : []

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
                        {submitterName} · {shiftLabel}
                        {report.shift_start && ` (${report.shift_start}${report.shift_end ? ` - ${report.shift_end}` : ''})`}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Date</p>
                          <p className="font-medium">{format(new Date(report.report_date), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Patrons</p>
                          <p className="font-medium">{report.patron_count_total || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Staff</p>
                          <p className="font-medium">{staffMembers.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Incidents</p>
                          <p className="font-medium">{report.has_incidents ? (
                            <span className="text-destructive">Yes</span>
                          ) : '0'}</p>
                        </div>
                      </div>

                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {highlights.map((h, i) => (
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
