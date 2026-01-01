import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Requests"
        subtitle="Track and manage work orders"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        }
      />

      {/* Work Orders */}
      <div className="grid gap-4">
        {mockWorkOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className={`h-5 w-5 ${getPriorityColor(order.priority)}`} />
                    <h3 className="font-semibold">{order.title}</h3>
                    <Badge variant={getPriorityVariant(order.priority)}>
                      {order.priority}
                    </Badge>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">WO #:</span>
                      <p className="font-medium font-mono">{order.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{order.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assigned To:</span>
                      <p className="font-medium">{order.assignedTo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{order.created}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    Urgent: 'text-red-600',
    High: 'text-orange-600',
    Medium: 'text-yellow-600',
    Low: 'text-blue-600',
  }
  return colors[priority] || 'text-gray-600'
}

function getPriorityVariant(priority: string): 'destructive' | 'warning' | 'secondary' {
  if (priority === 'Urgent') return 'destructive'
  if (priority === 'High' || priority === 'Medium') return 'warning'
  return 'secondary'
}

const mockWorkOrders = [
  {
    id: 'WO-2026-001',
    title: 'Fix Treadmill Belt - Unit #15',
    description: 'Treadmill belt is slipping and needs adjustment or replacement',
    location: 'Fitness Floor',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Mike Williams',
    created: 'Jan 1, 2026',
  },
  {
    id: 'WO-2026-002',
    title: 'Replace Pool Deck Tiles',
    description: '3 cracked tiles near lap pool ladder need replacement',
    location: 'Main Pool',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Unassigned',
    created: 'Dec 31, 2025',
  },
]
