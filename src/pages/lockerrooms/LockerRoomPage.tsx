import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  CheckCircle2, AlertTriangle, Clock, Send,
  Camera, Droplets, ThermometerSun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface LockerRoom {
  id: string
  name: string
  lastInspected: string
  inspector: string
  status: 'clean' | 'needs_attention' | 'in_progress'
  issues: string[]
}

interface CleaningTask {
  id: string
  task: string
  frequency: 'hourly' | 'daily' | 'weekly'
  completed: boolean
  time?: string
}

export function LockerRoomPage() {
  const [rooms, setRooms] = useState<LockerRoom[]>(initialRooms)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState('')

  const toggleTask = (taskId: string) => {
    setTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const completedTasks = Object.values(tasks).filter(Boolean).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locker Room Management"
        subtitle="Cleaning logs, inspections, and supply tracking"
      />

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card
            key={room.id}
            className={cn(
              'cursor-pointer transition-all',
              selectedRoom === room.id && 'ring-2 ring-primary',
              room.status === 'needs_attention' && 'border-yellow-300'
            )}
            onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{room.name}</h3>
                <Badge variant={
                  room.status === 'clean' ? 'success' :
                  room.status === 'needs_attention' ? 'warning' : 'secondary'
                }>
                  {room.status === 'clean' ? 'Clean' :
                   room.status === 'needs_attention' ? 'Needs Attention' : 'In Progress'}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Inspected</span>
                  <span className="font-medium">{room.lastInspected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inspector</span>
                  <span className="font-medium">{room.inspector}</span>
                </div>
              </div>
              {room.issues.length > 0 && (
                <div className="mt-3 pt-2 border-t">
                  {room.issues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-yellow-700">
                      <AlertTriangle className="h-3 w-3" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cleaning Checklist */}
      {selectedRoom && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Cleaning Checklist - {rooms.find(r => r.id === selectedRoom)?.name}
              </CardTitle>
              <Badge variant="secondary">
                {completedTasks}/{cleaningTasks.length} completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hourly Tasks */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Hourly Checks</p>
              <div className="space-y-2">
                {cleaningTasks.filter(t => t.frequency === 'hourly').map(task => (
                  <div key={task.id} className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg border',
                    tasks[task.id] && 'bg-green-50 dark:bg-green-950/20 border-green-200'
                  )}>
                    <Checkbox checked={tasks[task.id] || false} onCheckedChange={() => toggleTask(task.id)} />
                    <span className={cn('text-sm flex-1', tasks[task.id] && 'line-through text-muted-foreground')}>{task.task}</span>
                    <Badge variant="secondary" className="text-[10px]">Hourly</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Tasks */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Daily Tasks</p>
              <div className="space-y-2">
                {cleaningTasks.filter(t => t.frequency === 'daily').map(task => (
                  <div key={task.id} className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg border',
                    tasks[task.id] && 'bg-green-50 dark:bg-green-950/20 border-green-200'
                  )}>
                    <Checkbox checked={tasks[task.id] || false} onCheckedChange={() => toggleTask(task.id)} />
                    <span className={cn('text-sm flex-1', tasks[task.id] && 'line-through text-muted-foreground')}>{task.task}</span>
                    <Badge variant="secondary" className="text-[10px]">Daily</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Check */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Supply Check</p>
              <div className="grid grid-cols-2 gap-2">
                {supplyItems.map(item => (
                  <div key={item} className="flex items-center gap-2 p-2 border rounded">
                    <Checkbox id={`supply-${item}`} />
                    <label htmlFor={`supply-${item}`} className="text-xs">{item}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes or issues..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                Take Photo
              </Button>
              <Button size="sm" className="ml-auto">
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Submit Inspection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Inspections */}
      <Card>
        <CardHeader><CardTitle>Recent Inspections</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentInspections.map((insp, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{insp.room}</p>
                  <p className="text-xs text-muted-foreground">{insp.inspector} · {insp.time}</p>
                </div>
                <Badge variant={insp.status === 'pass' ? 'success' : 'warning'}>
                  {insp.status === 'pass' ? 'Pass' : 'Issues Found'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const initialRooms: LockerRoom[] = [
  { id: '1', name: "Men's Locker Room", lastInspected: '9:00 AM', inspector: 'Mike Williams', status: 'clean', issues: [] },
  { id: '2', name: "Women's Locker Room", lastInspected: '9:15 AM', inspector: 'Sarah Johnson', status: 'clean', issues: [] },
  { id: '3', name: 'Family Changing Room', lastInspected: '8:45 AM', inspector: 'David Park', status: 'needs_attention', issues: ['Paper towel dispenser empty', 'Mirror needs cleaning'] },
  { id: '4', name: 'Pool Changing Area', lastInspected: '8:30 AM', inspector: 'Lisa Chen', status: 'clean', issues: [] },
  { id: '5', name: 'Staff Locker Room', lastInspected: '7:00 AM', inspector: 'John Smith', status: 'clean', issues: [] },
]

const cleaningTasks: CleaningTask[] = [
  { id: 'h1', task: 'Check and clean toilets/urinals', frequency: 'hourly', completed: false },
  { id: 'h2', task: 'Wipe down counters and sinks', frequency: 'hourly', completed: false },
  { id: 'h3', task: 'Sweep/mop wet areas', frequency: 'hourly', completed: false },
  { id: 'h4', task: 'Empty trash if 3/4 full', frequency: 'hourly', completed: false },
  { id: 'h5', task: 'Check supplies and restock', frequency: 'hourly', completed: false },
  { id: 'd1', task: 'Deep clean all shower stalls', frequency: 'daily', completed: false },
  { id: 'd2', task: 'Sanitize all lockers', frequency: 'daily', completed: false },
  { id: 'd3', task: 'Clean mirrors and glass', frequency: 'daily', completed: false },
  { id: 'd4', task: 'Mop all floors with disinfectant', frequency: 'daily', completed: false },
  { id: 'd5', task: 'Clean and disinfect benches', frequency: 'daily', completed: false },
  { id: 'd6', task: 'Check drain covers and grates', frequency: 'daily', completed: false },
]

const supplyItems = [
  'Toilet Paper', 'Paper Towels', 'Hand Soap', 'Shampoo/Body Wash',
  'Trash Bags', 'Disinfectant Spray', 'Air Freshener', 'Wet Floor Signs',
]

const recentInspections = [
  { room: "Men's Locker Room", inspector: 'Mike Williams', time: '9:00 AM Today', status: 'pass' },
  { room: "Women's Locker Room", inspector: 'Sarah Johnson', time: '9:15 AM Today', status: 'pass' },
  { room: 'Family Changing Room', inspector: 'David Park', time: '8:45 AM Today', status: 'issues' },
  { room: "Men's Locker Room", inspector: 'John Smith', time: '5:00 PM Yesterday', status: 'pass' },
  { room: "Women's Locker Room", inspector: 'Lisa Chen', time: '5:00 PM Yesterday', status: 'pass' },
]
