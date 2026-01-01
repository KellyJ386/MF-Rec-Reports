import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  CheckSquare,
  BarChart3,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Checklists', href: '/checklists', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export function MobileNavigation() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
