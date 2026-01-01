import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatsCard } from '@/components/StatsCard'
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckSquare } from 'lucide-react'

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Insights"
        subtitle="Data-driven facility performance metrics"
        actions={
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Avg Daily Patrons"
          value="342"
          icon={Users}
          variant="success"
          trend={{ value: 12, label: 'vs last week' }}
        />
        <StatsCard
          title="Task Completion"
          value="94%"
          icon={CheckSquare}
          variant="success"
          trend={{ value: 3, label: 'vs last week' }}
        />
        <StatsCard
          title="Incident Rate"
          value="0.8%"
          icon={AlertTriangle}
          variant="warning"
          trend={{ value: -2, label: 'vs last week' }}
        />
        <StatsCard
          title="Satisfaction Score"
          value="4.7/5"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patron Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Line chart: Patron count by hour</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Bar chart: Incidents by type</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Area Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Heat map: Usage by area</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Pie chart: Equipment conditions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
