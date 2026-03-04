import { FIELD_TYPE_CONFIG, FieldType } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Type, Hash, Mail, Phone, Calendar, Clock, CalendarClock, AlignLeft,
  CheckSquare, ChevronDown, Circle, ListChecks, ToggleLeft, Star,
  Camera, Video, Paperclip, PenTool,
  User, Map, Thermometer, FlaskConical, Calculator,
  Minus, Heading, FileText,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Type, Hash, Mail, Phone, Calendar, Clock, CalendarClock, AlignLeft,
  CheckSquare, ChevronDown, Circle, ListChecks, ToggleLeft, Star,
  Camera, Video, Paperclip, PenTool,
  User, Map, Thermometer, FlaskConical, Calculator,
  Minus, Heading, FileText,
}

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  const categories = ['Basic', 'Choice', 'Media', 'Specialized', 'Layout']

  const fieldsByCategory = categories.reduce((acc, category) => {
    acc[category] = Object.entries(FIELD_TYPE_CONFIG)
      .filter(([_, config]) => config.category === category)
      .map(([type, config]) => ({ type: type as FieldType, ...config }))
    return acc
  }, {} as Record<string, Array<{ type: FieldType; label: string; icon: string; category: string }>>)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Add Fields
      </h3>

      {categories.map((category) => (
        <div key={category}>
          <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {fieldsByCategory[category]?.map((field) => {
              const Icon = iconMap[field.icon] || Type
              return (
                <button
                  key={field.type}
                  type="button"
                  onClick={() => onAddField(field.type)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs',
                    'border border-transparent hover:border-primary/30 hover:bg-primary/5',
                    'transition-colors cursor-grab active:cursor-grabbing'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{field.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
