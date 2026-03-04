import { FormField, SelectOption, ValidationRule, ConditionalRule } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface FieldPropertiesProps {
  field: FormField | null
  onChange: (field: FormField) => void
  allFields: FormField[]
}

export function FieldProperties({ field, onChange, allFields }: FieldPropertiesProps) {
  if (!field) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Select a field to edit its properties</p>
      </div>
    )
  }

  const update = (key: keyof FormField, value: unknown) => {
    onChange({ ...field, [key]: value })
  }

  const updateSettings = (key: string, value: unknown) => {
    onChange({
      ...field,
      settings: { ...field.settings, [key]: value },
    })
  }

  const addOption = () => {
    const options = field.options || []
    const newOption: SelectOption = {
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
    }
    update('options', [...options, newOption])
  }

  const updateOption = (index: number, key: keyof SelectOption, value: string) => {
    const options = [...(field.options || [])]
    options[index] = { ...options[index], [key]: value }
    update('options', options)
  }

  const removeOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index)
    update('options', options)
  }

  const hasOptions = ['select', 'radio', 'multi-select', 'checkbox'].includes(field.type)
  const hasMinMax = ['number', 'temperature', 'chemistry'].includes(field.type)
  const hasRows = field.type === 'textarea'

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Field Properties
      </h3>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          {/* Label */}
          <div className="space-y-1.5">
            <Label className="text-xs">Label</Label>
            <Input
              value={field.label}
              onChange={(e) => update('label', e.target.value)}
              placeholder="Field label"
            />
          </div>

          {/* Placeholder */}
          {!['checkbox', 'radio', 'toggle', 'divider', 'header', 'paragraph'].includes(field.type) && (
            <div className="space-y-1.5">
              <Label className="text-xs">Placeholder</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => update('placeholder', e.target.value)}
                placeholder="Placeholder text..."
              />
            </div>
          )}

          {/* Help Text */}
          <div className="space-y-1.5">
            <Label className="text-xs">Help Text</Label>
            <Input
              value={field.helpText || ''}
              onChange={(e) => update('helpText', e.target.value)}
              placeholder="Helper text shown below field"
            />
          </div>

          {/* Default Value */}
          <div className="space-y-1.5">
            <Label className="text-xs">Default Value</Label>
            <Input
              value={field.defaultValue || ''}
              onChange={(e) => update('defaultValue', e.target.value)}
              placeholder="Default value"
            />
          </div>

          {/* Required */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={field.required}
              onCheckedChange={(checked) => update('required', checked)}
            />
            <label htmlFor="required" className="text-sm">Required field</label>
          </div>

          {/* Width */}
          <div className="space-y-1.5">
            <Label className="text-xs">Width</Label>
            <Select
              value={field.width || 'full'}
              onValueChange={(v) => update('width', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="half">Half Width</SelectItem>
                <SelectItem value="third">One Third</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options for select/radio/checkbox */}
          {hasOptions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Options</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addOption}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Min/Max for number types */}
          {hasMinMax && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Min Value</Label>
                <Input
                  type="number"
                  value={field.settings?.min ?? ''}
                  onChange={(e) => updateSettings('min', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Value</Label>
                <Input
                  type="number"
                  value={field.settings?.max ?? ''}
                  onChange={(e) => updateSettings('max', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Unit for temperature/chemistry */}
          {['temperature', 'chemistry'].includes(field.type) && (
            <div className="space-y-1.5">
              <Label className="text-xs">Unit</Label>
              <Input
                value={field.settings?.unit || ''}
                onChange={(e) => updateSettings('unit', e.target.value)}
                placeholder="e.g., °F, ppm, pH"
              />
            </div>
          )}

          {/* Rows for textarea */}
          {hasRows && (
            <div className="space-y-1.5">
              <Label className="text-xs">Rows</Label>
              <Input
                type="number"
                value={field.settings?.rows ?? 4}
                onChange={(e) => updateSettings('rows', Number(e.target.value))}
                min={2}
                max={20}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4 mt-4">
          <p className="text-xs text-muted-foreground">
            Add validation rules to ensure correct data entry.
          </p>

          {hasMinMax && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Alert Threshold (out of range)</Label>
                <Input
                  type="number"
                  value={field.settings?.alertThreshold ?? ''}
                  onChange={(e) => updateSettings('alertThreshold', Number(e.target.value))}
                  placeholder="Value that triggers alert"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Acceptable Min</Label>
                  <Input
                    type="number"
                    value={field.settings?.rangeMin ?? ''}
                    onChange={(e) => updateSettings('rangeMin', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Acceptable Max</Label>
                  <Input
                    type="number"
                    value={field.settings?.rangeMax ?? ''}
                    onChange={(e) => updateSettings('rangeMax', Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          {['text', 'textarea', 'email'].includes(field.type) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Min Length</Label>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={(e) => updateSettings('min', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Length</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  onChange={(e) => updateSettings('max', Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="logic" className="space-y-4 mt-4">
          <p className="text-xs text-muted-foreground">
            Show or hide this field based on other field values.
          </p>

          {(field.conditionalRules || []).map((rule, index) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Rule {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    const rules = (field.conditionalRules || []).filter((_, i) => i !== index)
                    update('conditionalRules', rules)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Select defaultValue={rule.action}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="show">Show this field when</SelectItem>
                  <SelectItem value="hide">Hide this field when</SelectItem>
                  <SelectItem value="require">Require this field when</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={rule.fieldId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                  {allFields
                    .filter((f) => f.id !== field.id)
                    .map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const rules = field.conditionalRules || []
              update('conditionalRules', [
                ...rules,
                { fieldId: '', operator: 'equals', value: '', action: 'show' } as ConditionalRule,
              ])
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add Conditional Rule
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
