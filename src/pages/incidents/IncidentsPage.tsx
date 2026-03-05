import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, AlertTriangle, Search, Eye, Clock,
  CheckCircle2, AlertCircle, Shield, FileText, Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useIncidents, useIncidentsSubscription } from '@/hooks/useIncidents'

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
  const { data: incidents = [], isLoading, error } = useIncidents()
  useIncidentsSubscription() // Enable real-time updates

  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return incidents.filter(i => {
      const matchSearch = !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.incident_number.toLowerCase().includes(search.toLowerCase())
      const matchSeverity = severityFilter === 'all' || i.severity === severityFilter
      const matchStatus = statusFilter === 'all' || i.status === statusFilter
      return matchSearch && matchSeverity && matchStatus
    })
  }, [incidents, search, severityFilter, statusFilter])

  const stats = useMemo(() => ({
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    thisWeek: incidents.filter(i => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(i.occurred_at) >= weekAgo
    }).length,
  }), [incidents])

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
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading incidents...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              <AlertCircle className="h-10 w-10 mx-auto mb-3" />
              <p>Error loading incidents</p>
              <p className="text-sm mt-2">{error.message}</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
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
            const reporterName = incident.reported_by_profile
              ? `${incident.reported_by_profile.first_name} ${incident.reported_by_profile.last_name}`
              : 'Unknown'

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
                        {incident.ems_called && (
                          <Badge variant="destructive" className="text-[10px]">EMS</Badge>
                        )}
                        {incident.follow_up_required && (
                          <Badge variant="warning" className="text-[10px]">Follow-up</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {incident.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Incident #</p>
                          <p className="font-medium font-mono text-xs">{incident.incident_number}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Location</p>
                          <p className="font-medium">{incident.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Reported By</p>
                          <p className="font-medium">{reporterName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Date/Time</p>
                          <p className="font-medium">{format(new Date(incident.occurred_at), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>

                      {incident.injured_person_name && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Injured: <span className="font-medium text-foreground">{incident.injured_person_name}</span>
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
