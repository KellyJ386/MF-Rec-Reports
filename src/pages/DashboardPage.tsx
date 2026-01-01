import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  AlertTriangle,
  CheckSquare,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { format } from 'date-fns'

export function DashboardPage() {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={currentDate}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Reports Today"
          value="12"
          icon={FileText}
          variant="default"
          trend={{ value: 8, label: 'vs yesterday' }}
        />
        <StatsCard
          title="Open Incidents"
          value="3"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Pending Tasks"
          value="8"
          icon={CheckSquare}
          variant="default"
        />
        <StatsCard
          title="Staff On Duty"
          value="15"
          icon={Users}
          variant="success"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button size="lg" className="h-auto py-4" asChild>
              <Link to="/reports/new">
                <FileText className="mr-2 h-5 w-5" />
                New Shift Report
              </Link>
            </Button>
            <Button size="lg" variant="destructive" className="h-auto py-4" asChild>
              <Link to="/incidents/new">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report Incident
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="h-auto py-4" asChild>
              <Link to="/checklists">
                <CheckSquare className="mr-2 h-5 w-5" />
                Complete Checklist
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`rounded-full p-2 ${activity.iconBg}`}>
                    <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center pt-1">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                  {activity.badge && (
                    <Badge variant={activity.badge.variant as any}>
                      {activity.badge.text}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Incidents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Open Incidents</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/incidents">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{incident.title}</p>
                    <p className="text-sm text-muted-foreground">{incident.location}</p>
                    <p className="text-xs text-muted-foreground">{incident.time}</p>
                  </div>
                  <Badge variant={incident.severity === 'Critical' ? 'destructive' : 'warning'}>
                    {incident.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facility Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Facility Performance</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
              <p className="text-2xl font-bold">94%</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '94%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">4.2 min</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Member Satisfaction</p>
              <p className="text-2xl font-bold">4.8/5.0</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '96%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const recentActivity = [
  {
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Morning Shift Report Submitted',
    description: 'John Smith completed the morning shift report',
    time: '10 minutes ago',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'New Incident Reported',
    description: 'Minor injury at Pool Deck - First aid administered',
    time: '1 hour ago',
    badge: { text: 'Minor', variant: 'warning' },
  },
  {
    icon: CheckSquare,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Opening Checklist Completed',
    description: 'All 24 tasks completed on time',
    time: '2 hours ago',
  },
  {
    icon: Users,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Staff Shift Change',
    description: '3 staff members clocked in for PM shift',
    time: '3 hours ago',
  },
]

const openIncidents = [
  {
    id: 'INC-20260101-0001',
    title: 'Equipment malfunction - Treadmill #12',
    location: 'Fitness Floor',
    time: '2 hours ago',
    severity: 'Moderate',
  },
  {
    id: 'INC-20260101-0002',
    title: 'Slip hazard - Wet floor',
    location: 'Locker Room B',
    time: '4 hours ago',
    severity: 'Minor',
  },
  {
    id: 'INC-20260101-0003',
    title: 'Pool chemistry out of range',
    location: 'Main Pool',
    time: '5 hours ago',
    severity: 'Critical',
  },
]
