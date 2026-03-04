import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users, Plus, Search, MessageSquare, CheckSquare, Clock,
  Send, AlertCircle, User, Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Task {
  id: string
  title: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  dueTime?: string
  area: string
}

interface Announcement {
  id: string
  title: string
  message: string
  author: string
  time: string
  priority: 'normal' | 'important' | 'urgent'
}

const priorityColors = {
  low: 'text-blue-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
}

export function StaffPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'announcements' | 'schedule'>('tasks')
  const [search, setSearch] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Communication"
        subtitle="Tasks, announcements, and team coordination"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowNewAnnouncement(true)}>
              <Bell className="mr-2 h-4 w-4" />
              Announce
            </Button>
            <Button onClick={() => setShowNewTask(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Task
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
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">On Duty</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <CheckSquare className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTasks.filter(t => t.status === 'pending').length}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckSquare className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTasks.filter(t => t.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAnnouncements.length}</p>
                <p className="text-xs text-muted-foreground">Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 border-b pb-2">
        {(['tasks', 'announcements', 'schedule'] as const).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {showNewTask && (
            <Card className="border-primary">
              <CardHeader><CardTitle className="text-base">New Task</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Task title" />
                <div className="grid grid-cols-2 gap-3">
                  <Select><SelectTrigger><SelectValue placeholder="Assign to" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mike">Mike Williams</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select><SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Area/Location" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewTask(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => setShowNewTask(false)}><Send className="mr-1.5 h-3.5 w-3.5" />Assign</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {mockTasks.map(task => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <CheckSquare className={cn('h-4 w-4', task.status === 'completed' ? 'text-green-600' : priorityColors[task.priority])} />
                    <div>
                      <p className={cn('text-sm font-medium', task.status === 'completed' && 'line-through text-muted-foreground')}>{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        <User className="h-3 w-3 inline mr-1" />{task.assignedTo} · {task.area}
                        {task.dueTime && ` · Due: ${task.dueTime}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    task.status === 'completed' ? 'success' :
                    task.status === 'in_progress' ? 'warning' : 'secondary'
                  } className="text-[10px]">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {showNewAnnouncement && (
            <Card className="border-primary">
              <CardHeader><CardTitle className="text-base">New Announcement</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Announcement title" />
                <Textarea placeholder="Message..." rows={3} />
                <Select><SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewAnnouncement(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => setShowNewAnnouncement(false)}><Send className="mr-1.5 h-3.5 w-3.5" />Post</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {mockAnnouncements.map(ann => (
            <Card key={ann.id} className={cn(ann.priority === 'urgent' && 'border-red-300')}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {ann.priority === 'urgent' ? (
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{ann.title}</p>
                      {ann.priority !== 'normal' && (
                        <Badge variant={ann.priority === 'urgent' ? 'destructive' : 'warning'} className="text-[10px]">
                          {ann.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{ann.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{ann.author} · {ann.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader><CardTitle>Today&apos;s Schedule - {format(new Date(), 'EEEE, MMMM d')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSchedule.map((slot, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-bold">{slot.time}</p>
                    <p className="text-[10px] text-muted-foreground">{slot.shift}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{slot.name}</p>
                    <p className="text-xs text-muted-foreground">{slot.role} · {slot.area}</p>
                  </div>
                  <Badge variant={slot.status === 'On Duty' ? 'success' : 'secondary'} className="text-[10px]">
                    {slot.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const mockTasks: Task[] = [
  { id: '1', title: 'Clean and restock locker room B', assignedTo: 'Sarah Johnson', priority: 'high', status: 'pending', dueTime: '10:00 AM', area: 'Locker Room B' },
  { id: '2', title: 'Replace paper towels in all restrooms', assignedTo: 'David Park', priority: 'medium', status: 'in_progress', area: 'All Restrooms' },
  { id: '3', title: 'Set up for afternoon swim lessons', assignedTo: 'Lisa Chen', priority: 'medium', status: 'pending', dueTime: '1:00 PM', area: 'Lap Pool' },
  { id: '4', title: 'Sanitize fitness floor equipment', assignedTo: 'Mike Williams', priority: 'low', status: 'completed', area: 'Fitness Floor' },
  { id: '5', title: 'Check and replace AED batteries', assignedTo: 'John Smith', priority: 'urgent', status: 'pending', dueTime: 'ASAP', area: 'Pool Deck' },
]

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Pool Closure Notice', message: 'Main pool will be closed for maintenance from 2-4 PM today. Lap pool remains open.', author: 'Manager', time: '8:00 AM', priority: 'urgent' },
  { id: '2', title: 'New COVID Protocol Update', message: 'Updated cleaning protocols effective immediately. See updated checklist in the break room.', author: 'Director', time: 'Yesterday', priority: 'important' },
  { id: '3', title: 'Staff Meeting Reminder', message: 'Monthly staff meeting this Friday at 3 PM in the conference room.', author: 'Manager', time: 'Yesterday', priority: 'normal' },
]

const mockSchedule = [
  { time: '6:00 AM', shift: 'Opening', name: 'John Smith', role: 'Supervisor', area: 'All Areas', status: 'On Duty' },
  { time: '6:00 AM', shift: 'Opening', name: 'Lisa Chen', role: 'Lifeguard', area: 'Main Pool', status: 'On Duty' },
  { time: '6:00 AM', shift: 'Opening', name: 'Mike Williams', role: 'Fitness Attendant', area: 'Fitness Floor', status: 'On Duty' },
  { time: '6:00 AM', shift: 'Opening', name: 'Sarah Johnson', role: 'Front Desk', area: 'Lobby', status: 'On Duty' },
  { time: '2:00 PM', shift: 'Afternoon', name: 'David Park', role: 'Supervisor', area: 'All Areas', status: 'Scheduled' },
  { time: '2:00 PM', shift: 'Afternoon', name: 'Amy Torres', role: 'Lifeguard', area: 'Main Pool', status: 'Scheduled' },
  { time: '2:00 PM', shift: 'Afternoon', name: 'Tom Reed', role: 'Lifeguard', area: 'Lap Pool', status: 'Scheduled' },
  { time: '2:00 PM', shift: 'Afternoon', name: 'Kelly Wright', role: 'Front Desk', area: 'Lobby', status: 'Scheduled' },
]
