import { cn } from '@/lib/utils'
import { Clock, User, ArrowRight, LucideIcon } from 'lucide-react'

export interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  user?: string
  icon?: LucideIcon
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

interface TimelineProps {
  events: TimelineEvent[]
}

const typeColors = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

const dotColors = {
  default: 'bg-muted-foreground',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      {events.map((event, index) => {
        const Icon = event.icon || Clock
        const type = event.type || 'default'

        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  typeColors[type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{event.title}</p>
                <span className="text-xs text-muted-foreground">{event.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              {event.user && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {event.user}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
