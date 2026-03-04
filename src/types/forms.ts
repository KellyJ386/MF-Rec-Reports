export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'checkbox'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'file'
  | 'photo'
  | 'video'
  | 'signature'
  | 'body-diagram'
  | 'facility-map'
  | 'temperature'
  | 'chemistry'
  | 'multi-select'
  | 'rating'
  | 'toggle'
  | 'divider'
  | 'header'
  | 'paragraph'
  | 'calculated'

export interface SelectOption {
  label: string
  value: string
}

export interface ConditionalRule {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty'
  value: string
  action: 'show' | 'hide' | 'require' | 'disable'
}

export interface ValidationRule {
  type: 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value: string | number
  message: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required: boolean
  options?: SelectOption[]
  defaultValue?: string
  validation?: ValidationRule[]
  conditionalRules?: ConditionalRule[]
  width?: 'full' | 'half' | 'third'
  // Type-specific settings
  settings?: {
    min?: number
    max?: number
    step?: number
    rows?: number
    maxFiles?: number
    maxSizeKB?: number
    acceptedTypes?: string
    unit?: string
    rangeMin?: number
    rangeMax?: number
    alertThreshold?: number
    formula?: string
  }
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FormField[]
  order: number
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface FormSchema {
  id: string
  name: string
  description: string
  moduleType: 'daily_report' | 'incident' | 'checklist' | 'equipment' | 'chemistry' | 'inspection' | 'maintenance' | 'custom'
  sections: FormSection[]
  settings: FormSettings
  version: number
  createdAt: string
  updatedAt: string
}

export interface FormSettings {
  allowDraft: boolean
  requireSignature: boolean
  requireApproval: boolean
  autoSaveInterval: number
  notifyOnSubmit: string[]
  pdfExport: boolean
  emailOnComplete: boolean
}

export const FIELD_TYPE_CONFIG: Record<FieldType, { label: string; icon: string; category: string }> = {
  text: { label: 'Text Input', icon: 'Type', category: 'Basic' },
  number: { label: 'Number', icon: 'Hash', category: 'Basic' },
  email: { label: 'Email', icon: 'Mail', category: 'Basic' },
  phone: { label: 'Phone', icon: 'Phone', category: 'Basic' },
  date: { label: 'Date', icon: 'Calendar', category: 'Basic' },
  time: { label: 'Time', icon: 'Clock', category: 'Basic' },
  datetime: { label: 'Date & Time', icon: 'CalendarClock', category: 'Basic' },
  textarea: { label: 'Text Area', icon: 'AlignLeft', category: 'Basic' },
  checkbox: { label: 'Checkbox', icon: 'CheckSquare', category: 'Choice' },
  select: { label: 'Dropdown', icon: 'ChevronDown', category: 'Choice' },
  radio: { label: 'Radio Group', icon: 'Circle', category: 'Choice' },
  'multi-select': { label: 'Multi Select', icon: 'ListChecks', category: 'Choice' },
  toggle: { label: 'Toggle', icon: 'ToggleLeft', category: 'Choice' },
  rating: { label: 'Rating', icon: 'Star', category: 'Choice' },
  photo: { label: 'Photo Upload', icon: 'Camera', category: 'Media' },
  video: { label: 'Video Upload', icon: 'Video', category: 'Media' },
  file: { label: 'File Upload', icon: 'Paperclip', category: 'Media' },
  signature: { label: 'Signature', icon: 'PenTool', category: 'Media' },
  'body-diagram': { label: 'Body Diagram', icon: 'User', category: 'Specialized' },
  'facility-map': { label: 'Facility Map', icon: 'Map', category: 'Specialized' },
  temperature: { label: 'Temperature', icon: 'Thermometer', category: 'Specialized' },
  chemistry: { label: 'Chemistry Reading', icon: 'FlaskConical', category: 'Specialized' },
  calculated: { label: 'Calculated Field', icon: 'Calculator', category: 'Specialized' },
  divider: { label: 'Divider', icon: 'Minus', category: 'Layout' },
  header: { label: 'Section Header', icon: 'Heading', category: 'Layout' },
  paragraph: { label: 'Info Text', icon: 'FileText', category: 'Layout' },
}

export const FORM_TEMPLATES: Partial<FormSchema>[] = [
  {
    name: 'Daily Shift Report',
    description: 'Standard shift report for recreation facilities',
    moduleType: 'daily_report',
  },
  {
    name: 'Incident Report',
    description: 'Comprehensive incident/accident documentation',
    moduleType: 'incident',
  },
  {
    name: 'Opening Checklist',
    description: 'Facility opening procedures',
    moduleType: 'checklist',
  },
  {
    name: 'Pool Chemistry Log',
    description: 'Water chemistry testing and documentation',
    moduleType: 'chemistry',
  },
  {
    name: 'Equipment Inspection',
    description: 'Equipment safety inspection form',
    moduleType: 'equipment',
  },
  {
    name: 'Maintenance Request',
    description: 'Work order submission form',
    moduleType: 'maintenance',
  },
  {
    name: 'Fitness Floor Inspection',
    description: 'Fitness equipment and floor condition check',
    moduleType: 'inspection',
  },
  {
    name: 'Locker Room Cleaning Log',
    description: 'Hourly locker room inspection and cleaning',
    moduleType: 'inspection',
  },
]
