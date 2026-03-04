import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dumbbell, CheckCircle2, AlertTriangle, Clock,
  Send, Camera, Users, Thermometer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EquipmentZone {
  name: string
  status: 'all_clear' | 'issues' | 'closed'
  equipmentCount: number
  outOfService: number
  lastChecked: string
}

export function FitnessPage() {
  const [zones, setZones] = useState<EquipmentZone[]>(initialZones)
  const [showInspectionForm, setShowInspectionForm] = useState(false)

  const totalEquipment = zones.reduce((sum, z) => sum + z.equipmentCount, 0)
  const totalOutOfService = zones.reduce((sum, z) => sum + z.outOfService, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fitness Floor Management"
        subtitle="Equipment status, inspections, and floor conditions"
        actions={
          <Button onClick={() => setShowInspectionForm(!showInspectionForm)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            New Inspection
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Dumbbell className="h-4 w-4 text-primary" /></div><div><p className="text-2xl font-bold">{totalEquipment}</p><p className="text-xs text-muted-foreground">Total Equipment</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-green-500/10 p-2"><CheckCircle2 className="h-4 w-4 text-green-600" /></div><div><p className="text-2xl font-bold">{totalEquipment - totalOutOfService}</p><p className="text-xs text-muted-foreground">Operational</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-red-500/10 p-2"><AlertTriangle className="h-4 w-4 text-red-600" /></div><div><p className="text-2xl font-bold">{totalOutOfService}</p><p className="text-xs text-muted-foreground">Out of Service</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><Users className="h-4 w-4 text-blue-600" /></div><div><p className="text-2xl font-bold">45</p><p className="text-xs text-muted-foreground">Current Users</p></div></div></CardContent></Card>
      </div>

      {/* Inspection Form */}
      {showInspectionForm && (
        <Card className="border-primary">
          <CardHeader><CardTitle>Floor Inspection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Zone</p>
                <Select><SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                  <SelectContent>
                    {zones.map(z => <SelectItem key={z.name} value={z.name}>{z.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Floor Condition</p>
                <Select><SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="needs_cleaning">Needs Cleaning</SelectItem>
                    <SelectItem value="hazard">Hazard Present</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {['All equipment wiped down', 'Floor swept/mopped', 'Weights racked properly', 'No safety hazards', 'Cleaning supplies stocked', 'Mirrors clean', 'TVs/audio working'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Checkbox id={item} /><label htmlFor={item} className="text-xs">{item}</label>
                </div>
              ))}
            </div>
            <Textarea placeholder="Additional notes or issues found..." rows={2} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowInspectionForm(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setShowInspectionForm(false)}><Send className="mr-1.5 h-3.5 w-3.5" />Submit</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map(zone => (
          <Card key={zone.name} className={cn(zone.status === 'issues' && 'border-yellow-300', zone.status === 'closed' && 'border-red-300')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{zone.name}</h3>
                <Badge variant={zone.status === 'all_clear' ? 'success' : zone.status === 'issues' ? 'warning' : 'destructive'}>
                  {zone.status === 'all_clear' ? 'All Clear' : zone.status === 'issues' ? 'Issues' : 'Closed'}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Equipment</p><p className="font-bold">{zone.equipmentCount}</p></div>
                <div><p className="text-xs text-muted-foreground">Out of Service</p><p className={cn('font-bold', zone.outOfService > 0 && 'text-red-600')}>{zone.outOfService}</p></div>
                <div><p className="text-xs text-muted-foreground">Last Checked</p><p className="font-medium text-xs">{zone.lastChecked}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const initialZones: EquipmentZone[] = [
  { name: 'Cardio - Treadmills', status: 'issues', equipmentCount: 15, outOfService: 1, lastChecked: '8:00 AM' },
  { name: 'Cardio - Ellipticals & Bikes', status: 'all_clear', equipmentCount: 12, outOfService: 0, lastChecked: '8:00 AM' },
  { name: 'Strength - Selectorized', status: 'all_clear', equipmentCount: 20, outOfService: 0, lastChecked: '8:15 AM' },
  { name: 'Strength - Plate Loaded', status: 'all_clear', equipmentCount: 10, outOfService: 0, lastChecked: '8:15 AM' },
  { name: 'Free Weights', status: 'all_clear', equipmentCount: 30, outOfService: 0, lastChecked: '8:30 AM' },
  { name: 'Functional Training', status: 'issues', equipmentCount: 8, outOfService: 1, lastChecked: '8:30 AM' },
  { name: 'Stretching Area', status: 'all_clear', equipmentCount: 5, outOfService: 0, lastChecked: '8:45 AM' },
]
