import { FormField, FormSection } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  GripVertical, Trash2, Copy, ChevronUp, ChevronDown,
  Type, Hash, Calendar, Camera, CheckSquare, AlignLeft,
  Star, Thermometer, FlaskConical, PenTool, Map,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormCanvasProps {
  sections: FormSection[]
  selectedFieldId: string | null
  onSelectField: (fieldId: string | null) => void
  onUpdateField: (field: FormField) => void
  onRemoveField: (sectionId: string, fieldId: string) => void
  onDuplicateField: (sectionId: string, fieldId: string) => void
  onMoveField: (sectionId: string, fieldId: string, direction: 'up' | 'down') => void
  onUpdateSection: (section: FormSection) => void
  onRemoveSection: (sectionId: string) => void
}

const fieldIcons: Record<string, React.ElementType> = {
  text: Type,
  number: Hash,
  email: Type,
  phone: Type,
  date: Calendar,
  time: Calendar,
  datetime: Calendar,
  textarea: AlignLeft,
  checkbox: CheckSquare,
  select: ChevronDown,
  radio: CheckSquare,
  'multi-select': CheckSquare,
  toggle: CheckSquare,
  rating: Star,
  photo: Camera,
  video: Camera,
  file: Camera,
  signature: PenTool,
  'body-diagram': Type,
  'facility-map': Map,
  temperature: Thermometer,
  chemistry: FlaskConical,
  calculated: Hash,
  divider: Type,
  header: Type,
  paragraph: AlignLeft,
}

export function FormCanvas({
  sections,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onDuplicateField,
  onMoveField,
  onUpdateSection,
  onRemoveSection,
}: FormCanvasProps) {
  if (sections.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 text-center">
        <Type className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Start Building Your Form</h3>
        <p className="text-sm text-muted-foreground">
          Click on field types from the palette on the left to add them to your form.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Input
                value={section.title}
                onChange={(e) =>
                  onUpdateSection({ ...section, title: e.target.value })
                }
                className="text-lg font-semibold border-none px-0 h-auto focus-visible:ring-0"
                placeholder="Section Title"
              />
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {section.fields.length} fields
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRemoveSection(section.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {section.description !== undefined && (
              <Input
                value={section.description || ''}
                onChange={(e) =>
                  onUpdateSection({ ...section, description: e.target.value })
                }
                className="text-sm text-muted-foreground border-none px-0 h-auto focus-visible:ring-0"
                placeholder="Section description (optional)"
              />
            )}
          </CardHeader>
          <CardContent>
            {section.fields.length === 0 ? (
              <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
                Click field types from the palette to add fields to this section
              </div>
            ) : (
              <div className="space-y-2">
                {section.fields.map((field, fieldIndex) => {
                  const Icon = fieldIcons[field.type] || Type
                  const isSelected = selectedFieldId === field.id

                  return (
                    <div
                      key={field.id}
                      onClick={() => onSelectField(field.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50'
                      )}
                    >
                      {/* Drag handle */}
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />

                      {/* Field icon */}
                      <div className="rounded bg-muted p-1.5 flex-shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>

                      {/* Field info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {field.label || 'Untitled Field'}
                          </p>
                          {field.required && (
                            <span className="text-destructive text-xs">*</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {field.type.replace('-', ' ')}
                          {field.width && field.width !== 'full'
                            ? ` · ${field.width} width`
                            : ''}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveField(section.id, field.id, 'up')
                          }}
                          disabled={fieldIndex === 0}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveField(section.id, field.id, 'down')
                          }}
                          disabled={fieldIndex === section.fields.length - 1}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicateField(section.id, field.id)
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveField(section.id, field.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
