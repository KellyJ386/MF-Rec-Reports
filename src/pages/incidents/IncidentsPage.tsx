import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, AlertTriangle, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

export function IncidentsPage() {
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="grid gap-4">
        {mockIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`h-5 w-5 ${getSeverityColor(incident.severity)}`} />
                    <h3 className="font-semibold">{incident.title}</h3>
                    <Badge variant={getSeverityVariant(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline">{incident.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Incident #:</span>
                      <p className="font-medium font-mono">{incident.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{incident.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reported By:</span>
                      <p className="font-medium">{incident.reportedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date/Time:</span>
                      <p className="font-medium">{incident.timestamp}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getSeverityColor(severity: string) {
  const colors: Record<string, string> = {
    Critical: 'text-red-600',
    Severe: 'text-orange-600',
    Moderate: 'text-yellow-600',
    Minor: 'text-blue-600',
  }
  return colors[severity] || 'text-gray-600'
}

function getSeverityVariant(severity: string): 'destructive' | 'warning' | 'secondary' {
  if (severity === 'Critical' || severity === 'Severe') return 'destructive'
  if (severity === 'Moderate') return 'warning'
  return 'secondary'
}

const mockIncidents = [
  {
    id: 'INC-20260101-0001',
    title: 'Equipment Malfunction - Treadmill #12',
    description: 'Treadmill belt stopped suddenly during use. Member stepped off safely, no injury.',
    location: 'Fitness Floor',
    severity: 'Moderate',
    status: 'Investigating',
    reportedBy: 'John Smith',
    timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
  },
  {
    id: 'INC-20260101-0002',
    title: 'Slip and Fall - Wet Floor',
    description: 'Patron slipped on wet floor near locker room entrance. Minor bruising, first aid administered.',
    location: 'Locker Room B',
    severity: 'Minor',
    status: 'Resolved',
    reportedBy: 'Sarah Johnson',
    timestamp: format(new Date(Date.now() - 3600000), 'MMM d, yyyy h:mm a'),
  },
  {
    id: 'INC-20260101-0003',
    title: 'Pool Chemistry Out of Range',
    description: 'pH level measured at 8.2, above acceptable range. Pool closed for chemical adjustment.',
    location: 'Main Pool',
    severity: 'Critical',
    status: 'Open',
    reportedBy: 'Mike Williams',
    timestamp: format(new Date(Date.now() - 7200000), 'MMM d, yyyy h:mm a'),
  },
]
