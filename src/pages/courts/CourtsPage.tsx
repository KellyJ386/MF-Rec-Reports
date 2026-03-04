import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar, CheckCircle2, AlertTriangle, Clock,
  Users, Send, Plus, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Court {
  id: string
  name: string
  type: string
  status: 'available' | 'in_use' | 'reserved' | 'maintenance' | 'closed'
  currentActivity?: string
  nextReservation?: string
  condition: 'good' | 'fair' | 'needs_attention'
}

const statusColors = {
  available: 'bg-green-500',
  in_use: 'bg-blue-500',
  reserved: 'bg-yellow-500',
  maintenance: 'bg-orange-500',
  closed: 'bg-red-500',
}

export function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>(initialCourts)
  const [showSchedule, setShowSchedule] = useState(false)

  const available = courts.filter(c => c.status === 'available').length
  const inUse = courts.filter(c => c.status === 'in_use' || c.status === 'reserved').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courts & Gymnasium"
        subtitle="Court schedules, conditions, and reservations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-green-500/10 p-2"><CheckCircle2 className="h-4 w-4 text-green-600" /></div><div><p className="text-2xl font-bold">{available}</p><p className="text-xs text-muted-foreground">Available</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><Users className="h-4 w-4 text-blue-600" /></div><div><p className="text-2xl font-bold">{inUse}</p><p className="text-xs text-muted-foreground">In Use / Reserved</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Calendar className="h-4 w-4 text-primary" /></div><div><p className="text-2xl font-bold">12</p><p className="text-xs text-muted-foreground">Bookings Today</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-yellow-500/10 p-2"><AlertTriangle className="h-4 w-4 text-yellow-600" /></div><div><p className="text-2xl font-bold">{courts.filter(c => c.condition === 'needs_attention').length}</p><p className="text-xs text-muted-foreground">Need Attention</p></div></div></CardContent></Card>
      </div>

      {/* Court Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courts.map(court => (
          <Card key={court.id} className={cn(court.condition === 'needs_attention' && 'border-yellow-300')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('h-3 w-3 rounded-full', statusColors[court.status])} />
                  <h3 className="font-semibold">{court.name}</h3>
                </div>
                <Badge variant="secondary" className="text-[10px]">{court.type}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{court.status.replace('_', ' ')}</span>
                </div>
                {court.currentActivity && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity</span>
                    <span className="font-medium">{court.currentActivity}</span>
                  </div>
                )}
                {court.nextReservation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next</span>
                    <span className="font-medium">{court.nextReservation}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition</span>
                  <Badge variant={court.condition === 'good' ? 'success' : court.condition === 'fair' ? 'warning' : 'destructive'} className="text-[10px]">
                    {court.condition === 'needs_attention' ? 'Needs Attention' : court.condition}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Inspect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader><CardTitle>Today&apos;s Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSchedule.map((slot, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="min-w-[100px]">
                  <p className="text-sm font-bold">{slot.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{slot.activity}</p>
                  <p className="text-xs text-muted-foreground">{slot.court}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">{slot.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const initialCourts: Court[] = [
  { id: '1', name: 'Court A', type: 'Basketball', status: 'in_use', currentActivity: 'Open Play', nextReservation: '2:00 PM - League', condition: 'good' },
  { id: '2', name: 'Court B', type: 'Basketball', status: 'reserved', currentActivity: 'Youth Practice', nextReservation: '1:00 PM - 3:00 PM', condition: 'good' },
  { id: '3', name: 'Court C', type: 'Volleyball', status: 'available', nextReservation: '4:00 PM - Open Play', condition: 'fair' },
  { id: '4', name: 'Court D', type: 'Badminton', status: 'available', condition: 'good' },
  { id: '5', name: 'Racquetball 1', type: 'Racquetball', status: 'in_use', currentActivity: 'Reserved Play', condition: 'good' },
  { id: '6', name: 'Racquetball 2', type: 'Racquetball', status: 'maintenance', condition: 'needs_attention' },
  { id: '7', name: 'Gymnasium', type: 'Multi-Purpose', status: 'in_use', currentActivity: 'Group Fitness Class', nextReservation: '12:00 PM - Pickleball', condition: 'good' },
]

const mockSchedule = [
  { time: '6:00 - 8:00 AM', activity: 'Morning Open Play', court: 'Court A & B', type: 'Open' },
  { time: '8:00 - 9:30 AM', activity: 'Senior Pickleball', court: 'Gymnasium', type: 'Program' },
  { time: '10:00 - 11:30 AM', activity: 'Youth Basketball Camp', court: 'Court A', type: 'Program' },
  { time: '12:00 - 1:00 PM', activity: 'Noon Pickup Basketball', court: 'Court B', type: 'Open' },
  { time: '2:00 - 4:00 PM', activity: 'Adult Basketball League', court: 'Court A & B', type: 'League' },
  { time: '4:00 - 6:00 PM', activity: 'Open Volleyball', court: 'Court C', type: 'Open' },
  { time: '6:00 - 8:00 PM', activity: 'Evening Badminton', court: 'Court D', type: 'Open' },
]
