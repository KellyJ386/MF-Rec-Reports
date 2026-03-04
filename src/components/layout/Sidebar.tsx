import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, AlertTriangle, CheckSquare,
  Package, Wrench, BarChart3, Settings, Menu,
  FlaskConical, Users, UserCheck, Shield, Dumbbell,
  MapPin, Lock, MessageSquare, Palette,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

interface NavSection {
  title: string
  items: { name: string; href: string; icon: React.ElementType }[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Shift Reports', href: '/reports', icon: FileText },
      { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
      { name: 'Checklists', href: '/checklists', icon: CheckSquare },
      { name: 'Pool Chemistry', href: '/chemistry', icon: FlaskConical },
      { name: 'Emergency', href: '/emergency', icon: Shield },
    ],
  },
  {
    title: 'Facility',
    items: [
      { name: 'Fitness Floor', href: '/fitness', icon: Dumbbell },
      { name: 'Courts & Gym', href: '/courts', icon: MapPin },
      { name: 'Locker Rooms', href: '/locker-rooms', icon: Lock },
      { name: 'Equipment', href: '/equipment', icon: Package },
      { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    ],
  },
  {
    title: 'People',
    items: [
      { name: 'Staff & Tasks', href: '/staff', icon: Users },
      { name: 'Patron Count', href: '/patrons', icon: UserCheck },
      { name: 'Member Feedback', href: '/members', icon: MessageSquare },
    ],
  },
  {
    title: 'Admin',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Form Builder', href: '/admin/forms', icon: Palette },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RR</span>
          </div>
          <span className="font-semibold">Rec Reports</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-200',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RR</span>
              </div>
              <span className="font-semibold">Rec Reports</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href ||
                      (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">
                  Demo University Rec
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
