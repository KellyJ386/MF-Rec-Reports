import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  AlertTriangle,
  CheckSquare,
  FileText,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppNotification {
  id: string
  type: 'incident' | 'task' | 'report' | 'maintenance' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  actionUrl?: string
}

interface NotificationCenterProps {
  notifications?: AppNotification[]
  onDismiss?: (id: string) => void
  onMarkRead?: (id: string) => void
}

const typeIcons = {
  incident: AlertTriangle,
  task: CheckSquare,
  report: FileText,
  maintenance: Wrench,
  system: Bell,
}

const priorityColors = {
  low: 'border-l-blue-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-400',
  critical: 'border-l-red-500',
}

export function NotificationCenter({
  notifications = mockNotifications,
  onDismiss,
  onMarkRead,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-lg">
            <div className="sticky top-0 bg-background border-b p-3 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Badge variant="secondary">{unreadCount} new</Badge>
            </div>

            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-3 hover:bg-muted/50 cursor-pointer border-l-4',
                      priorityColors[notification.priority],
                      !notification.read && 'bg-primary/5'
                    )}
                    onClick={() => onMarkRead?.(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm', !notification.read && 'font-medium')}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDismiss?.(notification.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const mockNotifications: AppNotification[] = [
  {
    id: '1',
    type: 'incident',
    title: 'Critical Incident Reported',
    message: 'Pool chemistry out of range at Main Pool. Immediate attention required.',
    time: '5 minutes ago',
    read: false,
    priority: 'critical',
  },
  {
    id: '2',
    type: 'task',
    title: 'Overdue Checklist',
    message: 'Opening checklist has not been completed. 15 minutes overdue.',
    time: '20 minutes ago',
    read: false,
    priority: 'high',
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Work Order Updated',
    message: 'Treadmill #15 repair has been completed by Mike Williams.',
    time: '1 hour ago',
    read: true,
    priority: 'medium',
  },
  {
    id: '4',
    type: 'report',
    title: 'Report Approved',
    message: 'Your morning shift report has been approved by the manager.',
    time: '2 hours ago',
    read: true,
    priority: 'low',
  },
]
