import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'danger'
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  trend,
}: StatsCardProps) {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={cn(
                    'font-medium',
                    trend.value > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>{' '}
                {trend.label}
              </p>
            )}
          </div>
          <div className={cn('rounded-full p-3 bg-muted', variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
