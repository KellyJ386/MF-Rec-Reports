import { useState, useCallback } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Save, Eye, Undo2, Redo2, FileDown, Settings2 } from 'lucide-react'
import { FieldPalette } from '@/components/formbuilder/FieldPalette'
import { FormCanvas } from '@/components/formbuilder/FormCanvas'
import { FieldProperties } from '@/components/formbuilder/FieldProperties'
import { FormPreview } from '@/components/formbuilder/FormPreview'
import { TemplateLibrary } from '@/components/formbuilder/TemplateLibrary'
import { FormSettingsPanel } from '@/components/formbuilder/FormSettingsPanel'
import {
  FormField, FormSection, FormSchema, FormSettings,
  FieldType, FIELD_TYPE_CONFIG, FORM_TEMPLATES,
} from '@/types/forms'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

const defaultSettings: FormSettings = {
  allowDraft: true,
  requireSignature: false,
  requireApproval: false,
  autoSaveInterval: 30,
  notifyOnSubmit: [],
  pdfExport: true,
  emailOnComplete: false,
}

const initialSchema: FormSchema = {
  id: generateId(),
  name: '',
  description: '',
  moduleType: 'custom',
  sections: [],
  settings: defaultSettings,
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

type BuilderView = 'build' | 'preview' | 'templates' | 'settings'

export function FormBuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(initialSchema)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<BuilderView>('build')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [history, setHistory] = useState<FormSchema[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // History management
  const pushHistory = useCallback((newSchema: FormSchema) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1)
      return [...trimmed, newSchema].slice(-30)
    })
    setHistoryIndex(prev => Math.min(prev + 1, 29))
  }, [historyIndex])

  const updateSchema = useCallback((updates: Partial<FormSchema>) => {
    setSchema(prev => {
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() }
      pushHistory(updated)
      return updated
    })
  }, [pushHistory])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setSchema(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setSchema(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  // Section management
  const addSection = useCallback(() => {
    const newSection: FormSection = {
      id: generateId(),
      title: `Section ${schema.sections.length + 1}`,
      description: '',
      fields: [],
      order: schema.sections.length,
    }
    updateSchema({ sections: [...schema.sections, newSection] })
    setActiveSectionId(newSection.id)
  }, [schema.sections, updateSchema])

  const updateSection = useCallback((section: FormSection) => {
    updateSchema({
      sections: schema.sections.map(s => s.id === section.id ? section : s),
    })
  }, [schema.sections, updateSchema])

  const removeSection = useCallback((sectionId: string) => {
    updateSchema({
      sections: schema.sections.filter(s => s.id !== sectionId),
    })
    if (activeSectionId === sectionId) {
      setActiveSectionId(schema.sections[0]?.id || null)
    }
  }, [schema.sections, activeSectionId, updateSchema])

  // Field management
  const addField = useCallback((type: FieldType) => {
    let targetSectionId = activeSectionId
    if (!targetSectionId) {
      if (schema.sections.length === 0) {
        const newSection: FormSection = {
          id: generateId(),
          title: 'Section 1',
          description: '',
          fields: [],
          order: 0,
        }
        targetSectionId = newSection.id
        setActiveSectionId(newSection.id)
        const config = FIELD_TYPE_CONFIG[type]
        const newField: FormField = {
          id: generateId(),
          type,
          label: config.label,
          required: false,
        }
        newSection.fields = [newField]
        updateSchema({ sections: [...schema.sections, newSection] })
        setSelectedFieldId(newField.id)
        return
      }
      targetSectionId = schema.sections[schema.sections.length - 1].id
      setActiveSectionId(targetSectionId)
    }

    const config = FIELD_TYPE_CONFIG[type]
    const newField: FormField = {
      id: generateId(),
      type,
      label: config.label,
      required: false,
      options: ['select', 'radio', 'multi-select', 'checkbox'].includes(type)
        ? [{ label: 'Option 1', value: 'option_1' }, { label: 'Option 2', value: 'option_2' }]
        : undefined,
      settings: ['temperature', 'chemistry'].includes(type)
        ? { unit: type === 'temperature' ? '°F' : 'ppm' }
        : undefined,
    }

    updateSchema({
      sections: schema.sections.map(s =>
        s.id === targetSectionId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      ),
    })
    setSelectedFieldId(newField.id)
  }, [activeSectionId, schema.sections, updateSchema])

  const updateField = useCallback((field: FormField) => {
    updateSchema({
      sections: schema.sections.map(s => ({
        ...s,
        fields: s.fields.map(f => f.id === field.id ? field : f),
      })),
    })
  }, [schema.sections, updateSchema])

  const removeField = useCallback((sectionId: string, fieldId: string) => {
    updateSchema({
      sections: schema.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      ),
    })
    if (selectedFieldId === fieldId) setSelectedFieldId(null)
  }, [schema.sections, selectedFieldId, updateSchema])

  const duplicateField = useCallback((sectionId: string, fieldId: string) => {
    const section = schema.sections.find(s => s.id === sectionId)
    const field = section?.fields.find(f => f.id === fieldId)
    if (!field) return

    const duplicate: FormField = {
      ...field,
      id: generateId(),
      label: `${field.label} (Copy)`,
    }
    const fieldIndex = section!.fields.findIndex(f => f.id === fieldId)
    const newFields = [...section!.fields]
    newFields.splice(fieldIndex + 1, 0, duplicate)

    updateSchema({
      sections: schema.sections.map(s =>
        s.id === sectionId ? { ...s, fields: newFields } : s
      ),
    })
    setSelectedFieldId(duplicate.id)
  }, [schema.sections, updateSchema])

  const moveField = useCallback((sectionId: string, fieldId: string, direction: 'up' | 'down') => {
    const section = schema.sections.find(s => s.id === sectionId)
    if (!section) return
    const idx = section.fields.findIndex(f => f.id === fieldId)
    if (idx === -1) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= section.fields.length) return

    const newFields = [...section.fields]
    const temp = newFields[idx]
    newFields[idx] = newFields[newIdx]
    newFields[newIdx] = temp

    updateSchema({
      sections: schema.sections.map(s =>
        s.id === sectionId ? { ...s, fields: newFields } : s
      ),
    })
  }, [schema.sections, updateSchema])

  // Get selected field
  const selectedField = schema.sections
    .flatMap(s => s.fields)
    .find(f => f.id === selectedFieldId) || null

  const allFields = schema.sections.flatMap(s => s.fields)
  const totalFields = allFields.length

  // Template loading
  const loadTemplate = useCallback((template: Partial<FormSchema>) => {
    const newSchema: FormSchema = {
      ...initialSchema,
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSchema(newSchema)
    pushHistory(newSchema)
    setActiveView('build')
    setSelectedFieldId(null)
    setActiveSectionId(newSchema.sections?.[0]?.id || null)
  }, [pushHistory])

  // Export as JSON
  const exportForm = useCallback(() => {
    const data = JSON.stringify(schema, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${schema.name || 'form'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [schema])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Form Builder"
        subtitle="Create and customize digital forms for your facility"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportForm}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </Button>
          </div>
        }
      />

      {/* Form metadata */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={schema.name}
              onChange={(e) => updateSchema({ name: e.target.value })}
              placeholder="Form name..."
              className="font-medium"
            />
            <Input
              value={schema.description}
              onChange={(e) => updateSchema({ description: e.target.value })}
              placeholder="Description..."
            />
            <Select
              value={schema.moduleType}
              onValueChange={(v) => updateSchema({ moduleType: v as FormSchema['moduleType'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Module type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_report">Daily Report</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        <Button
          variant={activeView === 'build' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('build')}
        >
          Build
        </Button>
        <Button
          variant={activeView === 'preview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('preview')}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button
          variant={activeView === 'templates' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('templates')}
        >
          Templates
        </Button>
        <Button
          variant={activeView === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('settings')}
        >
          <Settings2 className="mr-1.5 h-3.5 w-3.5" />
          Settings
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">{schema.sections.length} sections</Badge>
          <Badge variant="secondary">{totalFields} fields</Badge>
        </div>
      </div>

      {/* Build view */}
      {activeView === 'build' && (
        <div className="grid grid-cols-12 gap-4">
          {/* Left: Field Palette */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4">
              <FieldPalette onAddField={addField} />
            </div>
          </div>

          {/* Center: Form Canvas */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7">
            <div className="mb-3">
              <Button variant="outline" size="sm" onClick={addSection}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Section
              </Button>
            </div>
            <FormCanvas
              sections={schema.sections}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onUpdateField={updateField}
              onRemoveField={removeField}
              onDuplicateField={duplicateField}
              onMoveField={moveField}
              onUpdateSection={updateSection}
              onRemoveSection={removeSection}
            />
          </div>

          {/* Right: Field Properties */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-4">
              <FieldProperties
                field={selectedField}
                onChange={updateField}
                allFields={allFields}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview view */}
      {activeView === 'preview' && (
        <FormPreview schema={schema} />
      )}

      {/* Templates view */}
      {activeView === 'templates' && (
        <TemplateLibrary onSelect={loadTemplate} />
      )}

      {/* Settings view */}
      {activeView === 'settings' && (
        <FormSettingsPanel
          settings={schema.settings}
          onChange={(settings) => updateSchema({ settings })}
        />
      )}
    </div>
  )
}
