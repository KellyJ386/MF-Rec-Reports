import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, FileText, Search, Download } from 'lucide-react'
import { format } from 'date-fns'

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Reports"
        subtitle="Daily operations and shift documentation"
        actions={
          <Button asChild>
            <Link to="/reports/new">
              <Plus className="mr-2 h-4 w-4" />
              New Report
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
                placeholder="Search reports..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid gap-4">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{report.title}</h3>
                    <Badge variant={report.status === 'Approved' ? 'success' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{report.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shift:</span>
                      <p className="font-medium">{report.shift}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Staff:</span>
                      <p className="font-medium">{report.submittedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tasks:</span>
                      <p className="font-medium">{report.tasksCompleted}/{report.totalTasks}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const mockReports = [
  {
    id: '1',
    title: 'Morning Shift Report',
    date: format(new Date(), 'MMM d, yyyy'),
    shift: 'Opening (6:00 AM - 2:00 PM)',
    submittedBy: 'John Smith',
    status: 'Approved',
    tasksCompleted: 24,
    totalTasks: 24,
  },
  {
    id: '2',
    title: 'Evening Shift Report',
    date: format(new Date(Date.now() - 86400000), 'MMM d, yyyy'),
    shift: 'Evening (2:00 PM - 10:00 PM)',
    submittedBy: 'Sarah Johnson',
    status: 'Pending',
    tasksCompleted: 18,
    totalTasks: 20,
  },
]
