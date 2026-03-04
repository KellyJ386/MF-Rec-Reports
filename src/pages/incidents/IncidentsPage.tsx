import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, AlertTriangle, Search, Eye, Clock,
  CheckCircle2, AlertCircle, Shield, FileText,
} from 'lucide-react'
import { format, subDays, subHours } from 'date-fns'

interface Incident {
  id: string
  title: string
  description: string
  location: string
  severity: 'minor' | 'moderate' | 'severe' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  type: string
  reportedBy: string
  timestamp: string
  emsCalled: boolean
  hasPhotos: boolean
  followUpRequired: boolean
  injuredPerson?: string
}

const severityConfig = {
  minor: { label: 'Minor', color: 'text-blue-600', bg: 'bg-blue-500/10', variant: 'secondary' as const },
  moderate: { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-500/10', variant: 'warning' as const },
  severe: { label: 'Severe', color: 'text-orange-600', bg: 'bg-orange-500/10', variant: 'destructive' as const },
  critical: { label: 'Critical', color: 'text-red-600', bg: 'bg-red-500/10', variant: 'destructive' as const },
}

const statusConfig = {
  open: { label: 'Open', icon: AlertCircle, variant: 'destructive' as const },
  investigating: { label: 'Investigating', icon: Search, variant: 'warning' as const },
  resolved: { label: 'Resolved', icon: CheckCircle2, variant: 'success' as const },
  closed: { label: 'Closed', icon: Shield, variant: 'secondary' as const },
}

export function IncidentsPage() {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockIncidents.filter(i => {
    const matchSearch = !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === 'all' || i.severity === severityFilter
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchSeverity && matchStatus
  })

  const stats = {
    total: mockIncidents.length,
    open: mockIncidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
    critical: mockIncidents.filter(i => i.severity === 'critical').length,
    thisWeek: mockIncidents.length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Reports"
        subtitle="Track and manage facility incidents"
        actions={
          <Button variant="destructive" asChild>
            <Link to="/incidents/new">
              <Plus className="mr-2 h-4 w-4" />
              Report Incident
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open / Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
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
                placeholder="Search incidents..."
                className="pl-9"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Shield className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No incidents match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((incident) => {
            const sev = severityConfig[incident.severity]
            const stat = statusConfig[incident.status]
            const StatIcon = stat.icon

            return (
              <Card key={incident.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${sev.color}`} />
                        <h3 className="font-semibold">{incident.title}</h3>
                        <Badge variant={sev.variant}>{sev.label}</Badge>
                        <Badge variant={stat.variant}>
                          <StatIcon className="h-3 w-3 mr-1" />
                          {stat.label}
                        </Badge>
                        {incident.emsCalled && (
                          <Badge variant="destructive" className="text-[10px]">EMS</Badge>
                        )}
                        {incident.followUpRequired && (
                          <Badge variant="warning" className="text-[10px]">Follow-up</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {incident.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Incident #</p>
                          <p className="font-medium font-mono text-xs">{incident.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Location</p>
                          <p className="font-medium">{incident.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Reported By</p>
                          <p className="font-medium">{incident.reportedBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Date/Time</p>
                          <p className="font-medium">{incident.timestamp}</p>
                        </div>
                      </div>

                      {incident.injuredPerson && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Injured: <span className="font-medium text-foreground">{incident.injuredPerson}</span>
                        </p>
                      )}
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
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

const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-0001',
    title: 'Pool Chemistry Out of Range',
    description: 'pH level measured at 8.2, above acceptable range. Pool closed for chemical adjustment. Re-tested after 2 hours and levels returned to normal. Pool reopened at 11:30 AM.',
    location: 'Main Pool',
    severity: 'critical',
    status: 'resolved',
    type: 'chemical',
    reportedBy: 'Mike Williams',
    timestamp: format(subHours(new Date(), 3), 'MMM d, yyyy h:mm a'),
    emsCalled: false,
    hasPhotos: true,
    followUpRequired: true,
  },
  {
    id: 'INC-2026-0002',
    title: 'Slip and Fall - Wet Floor',
    description: 'Patron slipped on wet floor near locker room entrance. Minor bruising to left knee. First aid administered, ice pack applied. Patron declined further medical attention.',
    location: 'Locker Room B',
    severity: 'minor',
    status: 'closed',
    type: 'injury',
    reportedBy: 'Sarah Johnson',
    timestamp: format(subHours(new Date(), 5), 'MMM d, yyyy h:mm a'),
    emsCalled: false,
    hasPhotos: true,
    followUpRequired: false,
    injuredPerson: 'Jane Doe',
  },
  {
    id: 'INC-2026-0003',
    title: 'Equipment Malfunction - Treadmill #12',
    description: 'Treadmill belt stopped suddenly during use. Member stepped off safely, no injury. Equipment taken out of service and maintenance notified.',
    location: 'Fitness Floor',
    severity: 'moderate',
    status: 'investigating',
    type: 'equipment',
    reportedBy: 'John Smith',
    timestamp: format(subHours(new Date(), 1), 'MMM d, yyyy h:mm a'),
    emsCalled: false,
    hasPhotos: false,
    followUpRequired: true,
  },
  {
    id: 'INC-2026-0004',
    title: 'Child Rescue - Deep End',
    description: 'Lifeguard performed active rescue on unaccompanied minor in deep end. Child was struggling and taking in water. Rescue performed successfully, child assessed by staff.',
    location: 'Main Pool',
    severity: 'severe',
    status: 'open',
    type: 'rescue',
    reportedBy: 'David Park',
    timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
    emsCalled: true,
    hasPhotos: false,
    followUpRequired: true,
    injuredPerson: 'Minor (8 years old)',
  },
  {
    id: 'INC-2026-0005',
    title: 'Behavioral Issue - Disruptive Patron',
    description: 'Adult patron became verbally aggressive with front desk staff over guest policy. Security was called. Patron was asked to leave and complied.',
    location: 'Lobby/Front Desk',
    severity: 'minor',
    status: 'closed',
    type: 'behavioral',
    reportedBy: 'Lisa Chen',
    timestamp: format(subDays(new Date(), 1), 'MMM d, yyyy h:mm a'),
    emsCalled: false,
    hasPhotos: false,
    followUpRequired: false,
  },
]
