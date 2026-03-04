import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, Wrench, Search, AlertTriangle, CheckCircle2,
  Clock, Send, Eye, User, MapPin, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkOrder {
  id: string
  title: string
  description: string
  location: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  assignedTo: string
  requestedBy: string
  created: string
  dueDate?: string
  completedDate?: string
  estimatedHours?: number
}

const priorityConfig = {
  low: { label: 'Low', variant: 'secondary' as const, color: 'text-blue-600' },
  medium: { label: 'Medium', variant: 'warning' as const, color: 'text-yellow-600' },
  high: { label: 'High', variant: 'destructive' as const, color: 'text-orange-600' },
  emergency: { label: 'Emergency', variant: 'destructive' as const, color: 'text-red-600' },
}

const statusConfig = {
  open: { label: 'Open', variant: 'destructive' as const },
  assigned: { label: 'Assigned', variant: 'warning' as const },
  in_progress: { label: 'In Progress', variant: 'warning' as const },
  on_hold: { label: 'On Hold', variant: 'secondary' as const },
  completed: { label: 'Completed', variant: 'success' as const },
  cancelled: { label: 'Cancelled', variant: 'secondary' as const },
}

export function MaintenancePage() {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewForm, setShowNewForm] = useState(false)

  const filtered = mockWorkOrders.filter(o => {
    const matchSearch = !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchPriority = priorityFilter === 'all' || o.priority === priorityFilter
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchPriority && matchStatus
  })

  const stats = {
    open: mockWorkOrders.filter(o => ['open', 'assigned', 'in_progress'].includes(o.status)).length,
    emergency: mockWorkOrders.filter(o => o.priority === 'emergency' && o.status !== 'completed').length,
    completed: mockWorkOrders.filter(o => o.status === 'completed').length,
    overdue: 1,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Requests"
        subtitle="Track and manage facility work orders"
        actions={
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Wrench className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Active Orders</p>
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
                <p className="text-2xl font-bold">{stats.emergency}</p>
                <p className="text-xs text-muted-foreground">Emergency</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Work Order Form */}
      {showNewForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>New Work Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="equipment">Equipment Repair</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="pool">Pool/Aquatics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input placeholder="Where is the issue?" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea placeholder="Detailed description of what needs to be done..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
              <Button onClick={() => setShowNewForm(false)}>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search work orders..." className="pl-9" />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const pConfig = priorityConfig[order.priority]
          const sConfig = statusConfig[order.status]
          return (
            <Card key={order.id} className={cn(
              order.priority === 'emergency' && order.status !== 'completed' && 'border-red-300'
            )}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Wrench className={`h-4 w-4 flex-shrink-0 ${pConfig.color}`} />
                      <h3 className="font-semibold">{order.title}</h3>
                      <Badge variant={pConfig.variant}>{pConfig.label}</Badge>
                      <Badge variant={sConfig.variant}>{sConfig.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-xs">WO#</span>
                        <span className="font-mono text-xs font-medium">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{order.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{order.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{order.created}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const mockWorkOrders: WorkOrder[] = [
  { id: 'WO-2026-001', title: 'Fix Treadmill Belt - Unit #15', description: 'Treadmill belt is slipping and needs adjustment or replacement. Patron reported vibration during use.', location: 'Fitness Floor - East', category: 'equipment', priority: 'high', status: 'in_progress', assignedTo: 'Mike Williams', requestedBy: 'John Smith', created: 'Mar 1, 2026', dueDate: 'Mar 5, 2026', estimatedHours: 2 },
  { id: 'WO-2026-002', title: 'Replace Pool Deck Tiles', description: '3 cracked tiles near lap pool ladder need replacement. Trip hazard.', location: 'Lap Pool - South', category: 'structural', priority: 'high', status: 'assigned', assignedTo: 'Dave Contractor', requestedBy: 'Sarah Johnson', created: 'Feb 28, 2026', dueDate: 'Mar 7, 2026' },
  { id: 'WO-2026-003', title: 'Cable Crossover Cable Replacement', description: 'Left cable snapped during use. Machine locked out. Replacement cable ordered.', location: 'Free Weight Area', category: 'equipment', priority: 'emergency', status: 'open', assignedTo: 'Unassigned', requestedBy: 'Lisa Chen', created: 'Mar 3, 2026' },
  { id: 'WO-2026-004', title: 'Locker Room B Drain Clogged', description: 'Standing water in shower area #3. Drain appears clogged.', location: 'Locker Room B', category: 'plumbing', priority: 'medium', status: 'assigned', assignedTo: 'Mike Williams', requestedBy: 'David Park', created: 'Mar 2, 2026' },
  { id: 'WO-2026-005', title: 'Replace HVAC Filter - Fitness Floor', description: 'Quarterly filter replacement due. Air quality test recommended.', location: 'Fitness Floor', category: 'hvac', priority: 'low', status: 'open', assignedTo: 'Unassigned', requestedBy: 'System', created: 'Mar 1, 2026', dueDate: 'Mar 15, 2026' },
  { id: 'WO-2026-006', title: 'Repair Basketball Backboard #2', description: 'Glass has small crack in corner. Needs assessment for replacement vs repair.', location: 'Court B', category: 'equipment', priority: 'medium', status: 'completed', assignedTo: 'Mike Williams', requestedBy: 'John Smith', created: 'Feb 25, 2026', completedDate: 'Feb 28, 2026' },
]
