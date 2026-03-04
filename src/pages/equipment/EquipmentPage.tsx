import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Package, Search, QrCode, Wrench, Plus, Eye, AlertTriangle,
  CheckCircle2, XCircle, Clock, Camera, Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Equipment {
  id: string
  name: string
  category: 'cardio' | 'strength' | 'pool' | 'court' | 'facility' | 'safety'
  location: string
  status: 'operational' | 'needs_service' | 'out_of_service' | 'retired'
  lastServiced: string
  nextService: string
  purchaseDate: string
  serialNumber: string
  manufacturer: string
  model: string
  notes?: string
}

const statusConfig = {
  operational: { label: 'Operational', variant: 'success' as const, icon: CheckCircle2, color: 'text-green-600' },
  needs_service: { label: 'Needs Service', variant: 'warning' as const, icon: AlertTriangle, color: 'text-yellow-600' },
  out_of_service: { label: 'Out of Service', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
  retired: { label: 'Retired', variant: 'secondary' as const, icon: Clock, color: 'text-gray-600' },
}

const categoryLabels: Record<string, string> = {
  cardio: 'Cardio', strength: 'Strength', pool: 'Pool/Aquatics',
  court: 'Court/Gym', facility: 'Facility', safety: 'Safety',
}

export function EquipmentPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showInspection, setShowInspection] = useState<string | null>(null)

  const filtered = mockEquipment.filter(e => {
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    const matchCategory = categoryFilter === 'all' || e.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const stats = {
    total: mockEquipment.length,
    operational: mockEquipment.filter(e => e.status === 'operational').length,
    needsService: mockEquipment.filter(e => e.status === 'needs_service').length,
    outOfService: mockEquipment.filter(e => e.status === 'out_of_service').length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment Management"
        subtitle="Track, inspect, and maintain facility equipment"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Equipment</p>
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
                <p className="text-2xl font-bold">{stats.operational}</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.needsService}</p>
                <p className="text-xs text-muted-foreground">Needs Service</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.outOfService}</p>
                <p className="text-xs text-muted-foreground">Out of Service</p>
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
                placeholder="Search by name, ID, or location..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="needs_service">Needs Service</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="pool">Pool/Aquatics</SelectItem>
                <SelectItem value="court">Court/Gym</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const config = statusConfig[item.status]
          const StatusIcon = config.icon
          return (
            <Card key={item.id} className={cn(
              item.status === 'out_of_service' && 'border-red-200',
              item.status === 'needs_service' && 'border-yellow-200'
            )}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                    </div>
                  </div>
                  <Badge variant={config.variant}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{categoryLabels[item.category]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Serviced</p>
                    <p className="font-medium">{item.lastServiced}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Service</p>
                    <p className={cn(
                      'font-medium',
                      item.nextService === 'Overdue' && 'text-destructive'
                    )}>{item.nextService}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowInspection(showInspection === item.id ? null : item.id)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Inspect
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Wrench className="h-3.5 w-3.5 mr-1.5" />
                    Service
                  </Button>
                </div>

                {showInspection === item.id && (
                  <div className="mt-3 pt-3 border-t space-y-3">
                    <h4 className="text-sm font-medium">Quick Inspection</h4>
                    <div className="space-y-2">
                      {['Bolts/fasteners secure', 'No visible damage', 'Moving parts function', 'Safety labels visible', 'Clean/sanitized'].map(check => (
                        <div key={check} className="flex items-center gap-2">
                          <Checkbox id={`${item.id}-${check}`} />
                          <label htmlFor={`${item.id}-${check}`} className="text-xs">{check}</label>
                        </div>
                      ))}
                    </div>
                    <Textarea placeholder="Notes..." rows={2} className="text-xs" />
                    <Button size="sm" className="w-full">Submit Inspection</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const mockEquipment: Equipment[] = [
  { id: 'EQ-TR-001', name: 'Treadmill #1 - Life Fitness', category: 'cardio', location: 'Fitness Floor - East', status: 'operational', lastServiced: 'Feb 15, 2026', nextService: 'Mar 15, 2026', purchaseDate: 'Jan 2024', serialNumber: 'LF-2024-001', manufacturer: 'Life Fitness', model: 'Integrity Series' },
  { id: 'EQ-TR-012', name: 'Treadmill #12 - Life Fitness', category: 'cardio', location: 'Fitness Floor - East', status: 'operational', lastServiced: 'Feb 10, 2026', nextService: 'Mar 10, 2026', purchaseDate: 'Jan 2024', serialNumber: 'LF-2024-012', manufacturer: 'Life Fitness', model: 'Integrity Series' },
  { id: 'EQ-TR-015', name: 'Treadmill #15 - Life Fitness', category: 'cardio', location: 'Fitness Floor - East', status: 'needs_service', lastServiced: 'Nov 20, 2025', nextService: 'Overdue', purchaseDate: 'Jan 2024', serialNumber: 'LF-2024-015', manufacturer: 'Life Fitness', model: 'Integrity Series', notes: 'Belt slipping intermittently' },
  { id: 'EQ-EL-003', name: 'Elliptical #3 - Precor', category: 'cardio', location: 'Fitness Floor - West', status: 'operational', lastServiced: 'Feb 1, 2026', nextService: 'Mar 1, 2026', purchaseDate: 'Mar 2024', serialNumber: 'PC-2024-003', manufacturer: 'Precor', model: 'EFX 885' },
  { id: 'EQ-SM-001', name: 'Smith Machine', category: 'strength', location: 'Free Weight Area', status: 'operational', lastServiced: 'Jan 28, 2026', nextService: 'Apr 28, 2026', purchaseDate: 'Jun 2023', serialNumber: 'HM-2023-SM1', manufacturer: 'Hammer Strength', model: 'HD Elite' },
  { id: 'EQ-CP-001', name: 'Cable Crossover', category: 'strength', location: 'Free Weight Area', status: 'out_of_service', lastServiced: 'Feb 20, 2026', nextService: 'N/A', purchaseDate: 'Jun 2023', serialNumber: 'HM-2023-CC1', manufacturer: 'Hammer Strength', model: 'HD Elite', notes: 'Cable snapped - replacement ordered' },
  { id: 'EQ-PF-001', name: 'Pool Filter System', category: 'pool', location: 'Main Pool - Mechanical', status: 'operational', lastServiced: 'Feb 28, 2026', nextService: 'Mar 28, 2026', purchaseDate: 'Jan 2022', serialNumber: 'PEN-2022-PF1', manufacturer: 'Pentair', model: 'Clean & Clear Plus' },
  { id: 'EQ-BB-001', name: 'Basketball Hoop #1', category: 'court', location: 'Court A - North', status: 'operational', lastServiced: 'Feb 1, 2026', nextService: 'May 1, 2026', purchaseDate: 'Sep 2023', serialNumber: 'SP-2023-BB1', manufacturer: 'Spalding', model: 'Arena Renegade' },
  { id: 'EQ-AED-001', name: 'AED - Main Lobby', category: 'safety', location: 'Main Lobby', status: 'operational', lastServiced: 'Mar 1, 2026', nextService: 'Apr 1, 2026', purchaseDate: 'Jan 2025', serialNumber: 'PH-2025-AED1', manufacturer: 'Philips', model: 'HeartStart FRx' },
  { id: 'EQ-AED-002', name: 'AED - Pool Deck', category: 'safety', location: 'Pool Deck - East Wall', status: 'needs_service', lastServiced: 'Jan 1, 2026', nextService: 'Overdue', purchaseDate: 'Jan 2025', serialNumber: 'PH-2025-AED2', manufacturer: 'Philips', model: 'HeartStart FRx', notes: 'Battery replacement due' },
]
