import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Search, QrCode, Wrench } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export function EquipmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Inventory"
        subtitle="Track and manage facility equipment"
        actions={
          <Button>
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </Button>
        }
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment by name, ID, or location..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockEquipment.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.id}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Serviced:</span>
                  <span className="font-medium">{item.lastServiced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Service:</span>
                  <span className="font-medium">{item.nextService}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View History
                </Button>
                <Button variant="outline" size="sm">
                  <Wrench className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  if (status === 'Operational') return 'success'
  if (status === 'Needs Service') return 'warning'
  if (status === 'Out of Service') return 'destructive'
  return 'secondary'
}

const mockEquipment = [
  {
    id: 'EQ-TR-012',
    name: 'Treadmill #12',
    location: 'Fitness Floor - East',
    status: 'Operational',
    lastServiced: 'Dec 15, 2025',
    nextService: 'Jan 15, 2026',
  },
  {
    id: 'EQ-TR-015',
    name: 'Treadmill #15',
    location: 'Fitness Floor - East',
    status: 'Needs Service',
    lastServiced: 'Nov 20, 2025',
    nextService: 'Overdue',
  },
  {
    id: 'EQ-BB-001',
    name: 'Basketball Hoop #1',
    location: 'Court A',
    status: 'Operational',
    lastServiced: 'Dec 1, 2025',
    nextService: 'Feb 1, 2026',
  },
  {
    id: 'EQ-PF-001',
    name: 'Pool Filter System',
    location: 'Main Pool',
    status: 'Operational',
    lastServiced: 'Dec 28, 2025',
    nextService: 'Jan 28, 2026',
  },
]
