import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertTriangle, Phone, Shield, FileText, Plus,
  Clock, MapPin, Send, CheckCircle2, Siren,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmergencyProtocol {
  id: string
  title: string
  type: string
  steps: string[]
  contacts: { name: string; phone: string; role: string }[]
}

export function EmergencyPage() {
  const [activeTab, setActiveTab] = useState<'protocols' | 'log' | 'contacts'>('protocols')
  const [showLogForm, setShowLogForm] = useState(false)
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Response"
        subtitle="Protocols, contacts, and emergency documentation"
        actions={
          <Button variant="destructive" onClick={() => setShowLogForm(true)}>
            <Siren className="mr-2 h-4 w-4" />
            Log Emergency
          </Button>
        }
      />

      {/* Quick Dial */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickDial.map(contact => (
          <Card key={contact.name} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="rounded-full bg-red-500/10 p-3 w-fit mx-auto mb-2">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <p className="font-semibold text-sm">{contact.name}</p>
              <p className="text-primary font-mono text-sm">{contact.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 border-b pb-2">
        {(['protocols', 'log', 'contacts'] as const).map(tab => (
          <Button key={tab} variant={activeTab === tab ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab(tab)} className="capitalize">{tab}</Button>
        ))}
      </div>

      {/* Protocols */}
      {activeTab === 'protocols' && (
        <div className="space-y-3">
          {mockProtocols.map(protocol => (
            <Card key={protocol.id}>
              <CardContent className="p-0">
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <Shield className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{protocol.title}</p>
                      <p className="text-xs text-muted-foreground">{protocol.type}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{protocol.steps.length} steps</Badge>
                </button>
                {expandedProtocol === protocol.id && (
                  <div className="px-4 pb-4 border-t pt-3">
                    <ol className="space-y-2">
                      {protocol.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {protocol.contacts.length > 0 && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">KEY CONTACTS</p>
                        <div className="space-y-1">
                          {protocol.contacts.map(c => (
                            <div key={c.name} className="flex items-center justify-between text-sm">
                              <span>{c.name} <span className="text-muted-foreground">({c.role})</span></span>
                              <span className="font-mono text-primary">{c.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Emergency Log */}
      {activeTab === 'log' && (
        <div className="space-y-3">
          {showLogForm && (
            <Card className="border-red-300">
              <CardHeader><CardTitle className="text-base text-red-600">Log Emergency Event</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Emergency Type</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="fire">Fire / Smoke</SelectItem>
                        <SelectItem value="weather">Severe Weather</SelectItem>
                        <SelectItem value="active_threat">Active Threat</SelectItem>
                        <SelectItem value="chemical">Chemical Spill</SelectItem>
                        <SelectItem value="structural">Structural Failure</SelectItem>
                        <SelectItem value="evacuation">Evacuation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">Time</Label><Input type="datetime-local" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Location</Label><Input placeholder="Where did this occur?" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea placeholder="Describe the emergency..." rows={3} /></div>
                <div className="space-y-2">
                  {['911 Called', 'EMS Dispatched', 'Fire Dept Dispatched', 'Building Evacuated', 'All Clear Given'].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Checkbox id={item} /><label htmlFor={item} className="text-xs">{item}</label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowLogForm(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={() => setShowLogForm(false)}><Send className="mr-1.5 h-3.5 w-3.5" />Submit</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {mockEmergencyLog.map(event => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={cn('h-4 w-4 mt-0.5', event.resolved ? 'text-green-600' : 'text-red-600')} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{event.title}</p>
                      <Badge variant={event.resolved ? 'success' : 'destructive'} className="text-[10px]">
                        {event.resolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contacts */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((group, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><CardTitle className="text-base">{group.category}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.contacts.map(c => (
                    <div key={c.name} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role}</p>
                      </div>
                      <p className="font-mono text-sm text-primary">{c.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const quickDial = [
  { name: '911', phone: '911' },
  { name: 'Poison Control', phone: '1-800-222-1222' },
  { name: 'Facility Manager', phone: '(555) 123-4567' },
  { name: 'Maintenance', phone: '(555) 123-4568' },
]

const mockProtocols: EmergencyProtocol[] = [
  { id: '1', title: 'Medical Emergency / Injury', type: 'Medical', steps: ['Assess the scene for safety', 'Call 911 if life-threatening', 'Provide first aid / CPR as trained', 'Retrieve AED if cardiac emergency', 'Designate someone to meet EMS at entrance', 'Clear area of bystanders', 'Document all actions taken', 'Complete incident report'], contacts: [{ name: 'EMS', phone: '911', role: 'Emergency' }, { name: 'Dr. Smith', phone: '(555) 999-0001', role: 'On-call physician' }] },
  { id: '2', title: 'Fire / Smoke Detected', type: 'Fire', steps: ['Activate fire alarm pull station', 'Call 911', 'Begin evacuation using nearest exits', 'Ensure all areas checked for patrons', 'Assemble at designated meeting point', 'Take headcount of staff', 'Do NOT re-enter building', 'Wait for fire department all clear'], contacts: [{ name: 'Fire Dept', phone: '911', role: 'Emergency' }] },
  { id: '3', title: 'Severe Weather / Tornado', type: 'Weather', steps: ['Monitor weather alerts', 'Activate public address system', 'Direct patrons to interior safe rooms', 'Stay away from windows and glass', 'Account for all staff and patrons', 'Monitor radio for all-clear', 'Inspect facility for damage before reopening'], contacts: [] },
  { id: '4', title: 'Active Threat / Lockdown', type: 'Security', steps: ['Call 911 immediately', 'Activate lockdown procedures', 'Lock/barricade doors', 'Move to interior rooms away from threat', 'Silence phones', 'Do not open doors until all-clear from law enforcement', 'Account for all individuals in your area'], contacts: [{ name: 'Police', phone: '911', role: 'Emergency' }, { name: 'Security', phone: '(555) 123-4570', role: 'Facility Security' }] },
  { id: '5', title: 'Pool Emergency / Drowning', type: 'Aquatic', steps: ['Lifeguard activates emergency action plan', 'Remove victim from water', 'Clear the pool', 'Begin rescue breathing / CPR', 'Call 911', 'Retrieve AED', 'Notify facility manager', 'Complete aquatic incident report'], contacts: [{ name: 'Aquatics Director', phone: '(555) 123-4571', role: 'Aquatics' }] },
]

const mockEmergencyLog = [
  { id: '1', title: 'Medical Emergency - Cardiac Event', description: 'Patron experienced chest pains on fitness floor. AED deployed, 911 called. Patient transported to General Hospital.', time: 'Feb 15, 2026 3:45 PM', location: 'Fitness Floor', resolved: true },
  { id: '2', title: 'Severe Weather Alert', description: 'Tornado warning issued. All patrons moved to interior safe rooms. All clear given at 4:30 PM.', time: 'Jan 28, 2026 4:00 PM', location: 'Entire Facility', resolved: true },
]

const emergencyContacts = [
  { category: 'Emergency Services', contacts: [
    { name: 'Emergency Services', phone: '911', role: 'Police / Fire / EMS' },
    { name: 'Poison Control', phone: '1-800-222-1222', role: 'Poison exposure' },
    { name: 'Non-Emergency Police', phone: '(555) 555-0100', role: 'Non-emergency' },
  ]},
  { category: 'Facility Leadership', contacts: [
    { name: 'Facility Director', phone: '(555) 123-4560', role: 'Overall authority' },
    { name: 'Operations Manager', phone: '(555) 123-4561', role: 'Day-to-day operations' },
    { name: 'Aquatics Director', phone: '(555) 123-4562', role: 'Pool emergencies' },
  ]},
  { category: 'Utilities & Services', contacts: [
    { name: 'Electric Company', phone: '(555) 555-0200', role: 'Power outage' },
    { name: 'Gas Company', phone: '(555) 555-0201', role: 'Gas leak' },
    { name: 'Water Department', phone: '(555) 555-0202', role: 'Water main' },
  ]},
  { category: 'Insurance & Legal', contacts: [
    { name: 'Insurance Provider', phone: '(555) 555-0300', role: 'Claims' },
    { name: 'City Risk Management', phone: '(555) 555-0301', role: 'Liability' },
    { name: 'Legal Counsel', phone: '(555) 555-0302', role: 'Legal advice' },
  ]},
]
