import { FormSchema, FormSection, FormField, FORM_TEMPLATES } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  FileText, AlertTriangle, CheckSquare, Wrench, Thermometer,
  ClipboardList, Dumbbell, Search,
} from 'lucide-react'
import { useState } from 'react'

interface TemplateLibraryProps {
  onSelect: (template: Partial<FormSchema>) => void
}

const moduleIcons: Record<string, React.ElementType> = {
  daily_report: FileText,
  incident: AlertTriangle,
  checklist: CheckSquare,
  equipment: Wrench,
  chemistry: Thermometer,
  inspection: ClipboardList,
  maintenance: Wrench,
  custom: FileText,
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Pre-built template definitions with actual sections and fields
function getTemplateWithFields(template: Partial<FormSchema>): Partial<FormSchema> {
  const makeField = (type: string, label: string, required = false, extra: Partial<FormField> = {}): FormField => ({
    id: generateId(),
    type: type as FormField['type'],
    label,
    required,
    ...extra,
  })

  const makeSection = (title: string, fields: FormField[], order: number): FormSection => ({
    id: generateId(),
    title,
    fields,
    order,
  })

  switch (template.moduleType) {
    case 'daily_report':
      return {
        ...template,
        sections: [
          makeSection('Shift Information', [
            makeField('date', 'Date', true),
            makeField('select', 'Shift', true, {
              options: [
                { label: 'Morning (6am-2pm)', value: 'morning' },
                { label: 'Afternoon (2pm-10pm)', value: 'afternoon' },
                { label: 'Evening (10pm-6am)', value: 'evening' },
              ],
            }),
            makeField('text', 'Supervisor on Duty', true),
            makeField('number', 'Staff Count', true),
          ], 0),
          makeSection('Facility Status', [
            makeField('select', 'Overall Status', true, {
              options: [
                { label: 'Normal Operations', value: 'normal' },
                { label: 'Limited Operations', value: 'limited' },
                { label: 'Closed', value: 'closed' },
              ],
            }),
            makeField('number', 'Patron Count', false),
            makeField('select', 'Weather Conditions', false, {
              options: [
                { label: 'Clear', value: 'clear' },
                { label: 'Cloudy', value: 'cloudy' },
                { label: 'Rain', value: 'rain' },
                { label: 'Snow', value: 'snow' },
                { label: 'Extreme Heat', value: 'heat' },
              ],
            }),
          ], 1),
          makeSection('Notes & Incidents', [
            makeField('textarea', 'Shift Notes', false, { settings: { rows: 4 } }),
            makeField('toggle', 'Any incidents to report?', false),
            makeField('textarea', 'Incident Summary', false, { settings: { rows: 3 } }),
          ], 2),
        ],
      }

    case 'incident':
      return {
        ...template,
        sections: [
          makeSection('Incident Details', [
            makeField('datetime', 'Date & Time of Incident', true),
            makeField('text', 'Location', true),
            makeField('select', 'Severity', true, {
              options: [
                { label: 'Minor', value: 'minor' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Major', value: 'major' },
                { label: 'Critical', value: 'critical' },
              ],
            }),
            makeField('select', 'Incident Type', true, {
              options: [
                { label: 'Injury - Patron', value: 'injury_patron' },
                { label: 'Injury - Staff', value: 'injury_staff' },
                { label: 'Property Damage', value: 'property' },
                { label: 'Chemical Exposure', value: 'chemical' },
                { label: 'Behavioral', value: 'behavioral' },
                { label: 'Other', value: 'other' },
              ],
            }),
          ], 0),
          makeSection('Description', [
            makeField('textarea', 'What happened?', true, { settings: { rows: 5 } }),
            makeField('textarea', 'Actions Taken', true, { settings: { rows: 4 } }),
            makeField('toggle', 'EMS Called?', false),
            makeField('toggle', 'Police Called?', false),
          ], 1),
          makeSection('Involved Parties', [
            makeField('text', 'Injured Person Name', false),
            makeField('phone', 'Contact Phone', false),
            makeField('text', 'Witness Names', false),
          ], 2),
          makeSection('Documentation', [
            makeField('photo', 'Photos', false),
            makeField('body-diagram', 'Injury Location', false),
            makeField('signature', 'Reporting Staff Signature', true),
          ], 3),
        ],
      }

    case 'checklist':
      return {
        ...template,
        sections: [
          makeSection('Pre-Opening Checks', [
            makeField('checkbox', 'Facility walkthrough completed', true),
            makeField('checkbox', 'All emergency exits clear', true),
            makeField('checkbox', 'First aid supplies stocked', true),
            makeField('checkbox', 'AED tested and operational', true),
            makeField('checkbox', 'Fire extinguishers inspected', true),
          ], 0),
          makeSection('Pool Area (if applicable)', [
            makeField('checkbox', 'Pool deck clean and clear', false),
            makeField('checkbox', 'Lifeguard stations set up', false),
            makeField('checkbox', 'Rescue equipment in place', false),
            makeField('temperature', 'Water Temperature', false, { settings: { unit: '°F', min: 76, max: 84 } }),
            makeField('chemistry', 'Free Chlorine', false, { settings: { unit: 'ppm', min: 1, max: 5 } }),
            makeField('chemistry', 'pH Level', false, { settings: { unit: 'pH', min: 7.2, max: 7.8 } }),
          ], 1),
          makeSection('Sign Off', [
            makeField('textarea', 'Notes', false),
            makeField('signature', 'Completed By', true),
            makeField('datetime', 'Time Completed', true),
          ], 2),
        ],
      }

    case 'chemistry':
      return {
        ...template,
        sections: [
          makeSection('Test Information', [
            makeField('datetime', 'Test Date & Time', true),
            makeField('select', 'Pool/Body of Water', true, {
              options: [
                { label: 'Main Pool', value: 'main' },
                { label: 'Lap Pool', value: 'lap' },
                { label: 'Kiddie Pool', value: 'kiddie' },
                { label: 'Hot Tub/Spa', value: 'spa' },
                { label: 'Splash Pad', value: 'splash' },
              ],
            }),
            makeField('text', 'Tested By', true),
          ], 0),
          makeSection('Chemical Readings', [
            makeField('chemistry', 'Free Chlorine', true, { settings: { unit: 'ppm', min: 1, max: 10, rangeMin: 1, rangeMax: 5 } }),
            makeField('chemistry', 'Combined Chlorine', true, { settings: { unit: 'ppm', min: 0, max: 2, rangeMax: 0.4 } }),
            makeField('chemistry', 'pH Level', true, { settings: { unit: 'pH', min: 0, max: 14, rangeMin: 7.2, rangeMax: 7.8 } }),
            makeField('chemistry', 'Total Alkalinity', false, { settings: { unit: 'ppm', min: 60, max: 180 } }),
            makeField('chemistry', 'Cyanuric Acid', false, { settings: { unit: 'ppm', min: 0, max: 100 } }),
            makeField('temperature', 'Water Temperature', true, { settings: { unit: '°F', min: 50, max: 110, rangeMin: 78, rangeMax: 84 } }),
          ], 1),
          makeSection('Actions', [
            makeField('textarea', 'Chemicals Added', false, { settings: { rows: 3 } }),
            makeField('textarea', 'Notes', false, { settings: { rows: 3 } }),
            makeField('toggle', 'All readings within range?', false),
          ], 2),
        ],
      }

    case 'equipment':
      return {
        ...template,
        sections: [
          makeSection('Equipment Information', [
            makeField('text', 'Equipment Name/ID', true),
            makeField('text', 'Location', true),
            makeField('select', 'Equipment Type', true, {
              options: [
                { label: 'Cardio Machine', value: 'cardio' },
                { label: 'Strength Machine', value: 'strength' },
                { label: 'Free Weight', value: 'free_weight' },
                { label: 'Pool Equipment', value: 'pool' },
                { label: 'Court Equipment', value: 'court' },
                { label: 'Other', value: 'other' },
              ],
            }),
          ], 0),
          makeSection('Inspection', [
            makeField('select', 'Overall Condition', true, {
              options: [
                { label: 'Good', value: 'good' },
                { label: 'Fair - Minor Issues', value: 'fair' },
                { label: 'Poor - Needs Repair', value: 'poor' },
                { label: 'Out of Service', value: 'out_of_service' },
              ],
            }),
            makeField('checkbox', 'Bolts and fasteners secure', true),
            makeField('checkbox', 'No visible damage or wear', true),
            makeField('checkbox', 'Moving parts function properly', true),
            makeField('checkbox', 'Safety labels visible', true),
            makeField('checkbox', 'Clean and sanitized', true),
          ], 1),
          makeSection('Documentation', [
            makeField('textarea', 'Issues Found', false, { settings: { rows: 3 } }),
            makeField('photo', 'Photos of Issues', false),
            makeField('signature', 'Inspector Signature', true),
          ], 2),
        ],
      }

    case 'maintenance':
      return {
        ...template,
        sections: [
          makeSection('Request Details', [
            makeField('text', 'Title', true),
            makeField('select', 'Priority', true, {
              options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Emergency', value: 'emergency' },
              ],
            }),
            makeField('select', 'Category', true, {
              options: [
                { label: 'Plumbing', value: 'plumbing' },
                { label: 'Electrical', value: 'electrical' },
                { label: 'HVAC', value: 'hvac' },
                { label: 'Equipment Repair', value: 'equipment' },
                { label: 'Structural', value: 'structural' },
                { label: 'Cleaning', value: 'cleaning' },
                { label: 'Other', value: 'other' },
              ],
            }),
            makeField('text', 'Location', true),
          ], 0),
          makeSection('Description', [
            makeField('textarea', 'Describe the issue', true, { settings: { rows: 4 } }),
            makeField('photo', 'Photos', false),
            makeField('facility-map', 'Mark Location on Map', false),
          ], 1),
          makeSection('Submitted By', [
            makeField('text', 'Your Name', true),
            makeField('date', 'Date', true),
          ], 2),
        ],
      }

    case 'inspection':
      return {
        ...template,
        sections: [
          makeSection('Inspection Info', [
            makeField('date', 'Inspection Date', true),
            makeField('text', 'Inspector Name', true),
            makeField('text', 'Area/Zone', true),
          ], 0),
          makeSection('Condition Checks', [
            makeField('select', 'Floors', true, {
              options: [
                { label: 'Clean', value: 'clean' },
                { label: 'Needs Attention', value: 'attention' },
                { label: 'Dirty', value: 'dirty' },
              ],
            }),
            makeField('select', 'Equipment', true, {
              options: [
                { label: 'All Operational', value: 'operational' },
                { label: 'Minor Issues', value: 'minor' },
                { label: 'Out of Service Items', value: 'out_of_service' },
              ],
            }),
            makeField('select', 'Safety', true, {
              options: [
                { label: 'No Hazards', value: 'safe' },
                { label: 'Minor Hazard', value: 'minor' },
                { label: 'Serious Hazard', value: 'serious' },
              ],
            }),
          ], 1),
          makeSection('Documentation', [
            makeField('textarea', 'Notes', false, { settings: { rows: 3 } }),
            makeField('photo', 'Photos', false),
            makeField('signature', 'Inspector Signature', true),
          ], 2),
        ],
      }

    default:
      return template
  }
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
  const [search, setSearch] = useState('')

  const filtered = FORM_TEMPLATES.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template, index) => {
          const Icon = moduleIcons[template.moduleType || 'custom'] || FileText
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {(template.moduleType || 'custom').replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onSelect(getTemplateWithFields(template))}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No templates match your search</p>
        </div>
      )}
    </div>
  )
}
