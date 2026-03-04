import { FormSchema, FormField, FormSection } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Upload, Minus } from 'lucide-react'
import { useState } from 'react'

interface FormPreviewProps {
  schema: FormSchema
}

function FieldRenderer({ field }: { field: FormField }) {
  const [rating, setRating] = useState(0)

  const labelEl = (
    <Label className="text-sm font-medium">
      {field.label || 'Untitled Field'}
      {field.required && <span className="text-destructive ml-1">*</span>}
    </Label>
  )

  const helpEl = field.helpText ? (
    <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>
  ) : null

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
          />
          {helpEl}
        </div>
      )

    case 'number':
    case 'temperature':
    case 'chemistry':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
              min={field.settings?.min}
              max={field.settings?.max}
              step={field.settings?.step}
            />
            {field.settings?.unit && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {field.settings.unit}
              </span>
            )}
          </div>
          {helpEl}
        </div>
      )

    case 'date':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input type="date" defaultValue={field.defaultValue} />
          {helpEl}
        </div>
      )

    case 'time':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input type="time" defaultValue={field.defaultValue} />
          {helpEl}
        </div>
      )

    case 'datetime':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input type="datetime-local" defaultValue={field.defaultValue} />
          {helpEl}
        </div>
      )

    case 'textarea':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Textarea
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            rows={field.settings?.rows ?? 4}
          />
          {helpEl}
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Select defaultValue={field.defaultValue}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {helpEl}
        </div>
      )

    case 'radio':
      return (
        <div className="space-y-2">
          {labelEl}
          <div className="space-y-2">
            {(field.options || []).map(opt => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name={field.id} value={opt.value} className="accent-primary" />
                {opt.label}
              </label>
            ))}
          </div>
          {helpEl}
        </div>
      )

    case 'checkbox':
      if (field.options && field.options.length > 0) {
        return (
          <div className="space-y-2">
            {labelEl}
            {field.options.map(opt => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox id={`${field.id}_${opt.value}`} />
                <label htmlFor={`${field.id}_${opt.value}`} className="text-sm">{opt.label}</label>
              </div>
            ))}
            {helpEl}
          </div>
        )
      }
      return (
        <div className="flex items-center gap-2">
          <Checkbox id={field.id} />
          <label htmlFor={field.id} className="text-sm">{field.label}</label>
          {helpEl}
        </div>
      )

    case 'multi-select':
      return (
        <div className="space-y-2">
          {labelEl}
          <div className="border rounded-md p-3 space-y-2">
            {(field.options || []).map(opt => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox id={`${field.id}_${opt.value}`} />
                <label htmlFor={`${field.id}_${opt.value}`} className="text-sm">{opt.label}</label>
              </div>
            ))}
          </div>
          {helpEl}
        </div>
      )

    case 'toggle':
      return (
        <div className="flex items-center justify-between">
          <div>
            {labelEl}
            {helpEl}
          </div>
          <button
            type="button"
            className="w-11 h-6 rounded-full bg-muted relative transition-colors"
          >
            <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-background shadow transition-transform" />
          </button>
        </div>
      )

    case 'rating':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                />
              </button>
            ))}
          </div>
          {helpEl}
        </div>
      )

    case 'photo':
    case 'video':
    case 'file':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click or drag to upload {field.type}
            </p>
          </div>
          {helpEl}
        </div>
      )

    case 'signature':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="border rounded-lg p-8 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground">Tap to sign</p>
            <div className="border-b border-muted-foreground/30 w-3/4 mx-auto mt-4" />
          </div>
          {helpEl}
        </div>
      )

    case 'divider':
      return <hr className="my-2" />

    case 'header':
      return <h3 className="text-lg font-semibold">{field.label}</h3>

    case 'paragraph':
      return (
        <p className="text-sm text-muted-foreground">
          {field.defaultValue || field.label || 'Information text'}
        </p>
      )

    case 'calculated':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
            Calculated: {field.settings?.formula || 'No formula set'}
          </div>
          {helpEl}
        </div>
      )

    case 'body-diagram':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="border rounded-lg p-6 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">Body diagram (interactive in live form)</p>
          </div>
          {helpEl}
        </div>
      )

    case 'facility-map':
      return (
        <div className="space-y-1.5">
          {labelEl}
          <div className="border rounded-lg p-6 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">Facility map (interactive in live form)</p>
          </div>
          {helpEl}
        </div>
      )

    default:
      return (
        <div className="space-y-1.5">
          {labelEl}
          <Input placeholder={field.placeholder} />
          {helpEl}
        </div>
      )
  }
}

function SectionRenderer({ section }: { section: FormSection }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{section.title || 'Untitled Section'}</CardTitle>
        {section.description && (
          <p className="text-sm text-muted-foreground">{section.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {section.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No fields in this section</p>
        ) : (
          <div className="grid gap-5">
            {section.fields.map(field => {
              const widthClass =
                field.width === 'half' ? 'col-span-6' :
                field.width === 'third' ? 'col-span-4' :
                'col-span-12'
              return (
                <div key={field.id} className={widthClass}>
                  <FieldRenderer field={field} />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function FormPreview({ schema }: FormPreviewProps) {
  if (schema.sections.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Add sections and fields to see a preview</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{schema.name || 'Untitled Form'}</h2>
        {schema.description && (
          <p className="text-muted-foreground mt-1">{schema.description}</p>
        )}
        <Badge variant="secondary" className="mt-2">
          {schema.moduleType.replace('_', ' ')}
        </Badge>
      </div>

      {schema.sections.map(section => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      <div className="flex justify-end gap-3 pt-4">
        {schema.settings.allowDraft && (
          <Button variant="outline">Save as Draft</Button>
        )}
        <Button>Submit</Button>
      </div>
    </div>
  )
}
