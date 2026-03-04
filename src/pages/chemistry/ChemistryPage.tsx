import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, Droplets, Thermometer, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, FlaskConical, Send, Save,
} from 'lucide-react'
import { format, subHours } from 'date-fns'
import { cn } from '@/lib/utils'

interface ChemistryReading {
  id: string
  pool: string
  timestamp: string
  testedBy: string
  freeChlorine: number
  combinedChlorine: number
  ph: number
  alkalinity: number
  waterTemp: number
  cyanuricAcid?: number
  status: 'in_range' | 'warning' | 'out_of_range'
  chemicalsAdded?: string
  notes?: string
}

function getReadingStatus(value: number, min: number, max: number): 'in_range' | 'warning' | 'out_of_range' {
  if (value >= min && value <= max) return 'in_range'
  const margin = (max - min) * 0.2
  if (value >= min - margin && value <= max + margin) return 'warning'
  return 'out_of_range'
}

function StatusDot({ status }: { status: string }) {
  return (
    <span className={cn(
      'h-2 w-2 rounded-full inline-block',
      status === 'in_range' && 'bg-green-500',
      status === 'warning' && 'bg-yellow-500',
      status === 'out_of_range' && 'bg-red-500'
    )} />
  )
}

export function ChemistryPage() {
  const [showForm, setShowForm] = useState(false)
  const [pool, setPool] = useState('')
  const [freeChlorine, setFreeChlorine] = useState('')
  const [combinedChlorine, setCombinedChlorine] = useState('')
  const [ph, setPh] = useState('')
  const [alkalinity, setAlkalinity] = useState('')
  const [waterTemp, setWaterTemp] = useState('')
  const [cyanuricAcid, setCyanuricAcid] = useState('')
  const [chemicalsAdded, setChemicalsAdded] = useState('')
  const [notes, setNotes] = useState('')

  const latestByPool: Record<string, ChemistryReading> = {}
  mockReadings.forEach(r => {
    if (!latestByPool[r.pool]) latestByPool[r.pool] = r
  })

  const outOfRange = mockReadings.filter(r => r.status === 'out_of_range').length
  const warnings = mockReadings.filter(r => r.status === 'warning').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pool Chemistry Log"
        subtitle="Water chemistry testing and documentation"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Reading
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FlaskConical className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockReadings.length}</p>
                <p className="text-xs text-muted-foreground">Today&apos;s Readings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockReadings.length - outOfRange - warnings}</p>
                <p className="text-xs text-muted-foreground">In Range</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{warnings}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{outOfRange}</p>
                <p className="text-xs text-muted-foreground">Out of Range</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Pool Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(latestByPool).map(([poolName, reading]) => (
          <Card key={poolName} className={cn(
            reading.status === 'out_of_range' && 'border-red-300',
            reading.status === 'warning' && 'border-yellow-300'
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{poolName}</CardTitle>
                <Badge variant={
                  reading.status === 'in_range' ? 'success' :
                  reading.status === 'warning' ? 'warning' : 'destructive'
                }>
                  {reading.status === 'in_range' ? 'Normal' :
                   reading.status === 'warning' ? 'Warning' : 'Out of Range'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{reading.timestamp}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cl₂</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <StatusDot status={getReadingStatus(reading.freeChlorine, 1, 5)} />
                    {reading.freeChlorine} ppm
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">pH</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <StatusDot status={getReadingStatus(reading.ph, 7.2, 7.8)} />
                    {reading.ph}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Temp</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <StatusDot status={getReadingStatus(reading.waterTemp, 78, 84)} />
                    {reading.waterTemp}°F
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Alk</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <StatusDot status={getReadingStatus(reading.alkalinity, 80, 120)} />
                    {reading.alkalinity} ppm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Reading Form */}
      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              New Chemistry Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pool / Body of Water *</Label>
                <Select value={pool} onValueChange={setPool}>
                  <SelectTrigger><SelectValue placeholder="Select pool" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Pool</SelectItem>
                    <SelectItem value="lap">Lap Pool</SelectItem>
                    <SelectItem value="kiddie">Kiddie Pool</SelectItem>
                    <SelectItem value="spa">Hot Tub / Spa</SelectItem>
                    <SelectItem value="splash">Splash Pad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
              </div>
              <div className="space-y-2">
                <Label>Tested By</Label>
                <Input placeholder="Your name" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Free Chlorine (ppm) *</Label>
                <Input type="number" step="0.1" value={freeChlorine} onChange={e => setFreeChlorine(e.target.value)} placeholder="2.5" />
                <p className="text-[10px] text-muted-foreground">Range: 1.0-5.0</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Combined Cl₂ (ppm)</Label>
                <Input type="number" step="0.1" value={combinedChlorine} onChange={e => setCombinedChlorine(e.target.value)} placeholder="0.2" />
                <p className="text-[10px] text-muted-foreground">Max: 0.4</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">pH Level *</Label>
                <Input type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value)} placeholder="7.4" />
                <p className="text-[10px] text-muted-foreground">Range: 7.2-7.8</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Alkalinity (ppm)</Label>
                <Input type="number" value={alkalinity} onChange={e => setAlkalinity(e.target.value)} placeholder="100" />
                <p className="text-[10px] text-muted-foreground">Range: 80-120</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Water Temp (°F) *</Label>
                <Input type="number" step="0.1" value={waterTemp} onChange={e => setWaterTemp(e.target.value)} placeholder="82" />
                <p className="text-[10px] text-muted-foreground">Range: 78-84</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cyanuric Acid (ppm)</Label>
                <Input type="number" value={cyanuricAcid} onChange={e => setCyanuricAcid(e.target.value)} placeholder="40" />
                <p className="text-[10px] text-muted-foreground">Range: 30-50</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chemicals Added</Label>
                <Textarea value={chemicalsAdded} onChange={e => setChemicalsAdded(e.target.value)} placeholder="e.g., Added 2 cups sodium hypochlorite" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any observations or concerns..." rows={2} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={() => setShowForm(false)}>
                <Send className="mr-2 h-4 w-4" />
                Save Reading
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading History */}
      <Card>
        <CardHeader>
          <CardTitle>Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Time</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Pool</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Cl₂</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">pH</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Temp</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Alk</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 font-medium text-muted-foreground">Tested By</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockReadings.map(reading => (
                  <tr key={reading.id} className="hover:bg-muted/50">
                    <td className="py-2.5 pr-4 whitespace-nowrap">{reading.timestamp}</td>
                    <td className="py-2.5 pr-4">{reading.pool}</td>
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-1">
                        <StatusDot status={getReadingStatus(reading.freeChlorine, 1, 5)} />
                        {reading.freeChlorine}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-1">
                        <StatusDot status={getReadingStatus(reading.ph, 7.2, 7.8)} />
                        {reading.ph}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-1">
                        <StatusDot status={getReadingStatus(reading.waterTemp, 78, 84)} />
                        {reading.waterTemp}°F
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">{reading.alkalinity}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={
                        reading.status === 'in_range' ? 'success' :
                        reading.status === 'warning' ? 'warning' : 'destructive'
                      } className="text-[10px]">
                        {reading.status === 'in_range' ? 'OK' :
                         reading.status === 'warning' ? 'Warning' : 'Alert'}
                      </Badge>
                    </td>
                    <td className="py-2.5">{reading.testedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const now = new Date()
const mockReadings: ChemistryReading[] = [
  { id: '1', pool: 'Main Pool', timestamp: format(subHours(now, 0.5), 'h:mm a'), testedBy: 'John Smith', freeChlorine: 2.8, combinedChlorine: 0.2, ph: 7.4, alkalinity: 100, waterTemp: 82, status: 'in_range' },
  { id: '2', pool: 'Lap Pool', timestamp: format(subHours(now, 0.5), 'h:mm a'), testedBy: 'John Smith', freeChlorine: 3.0, combinedChlorine: 0.1, ph: 7.5, alkalinity: 95, waterTemp: 80, status: 'in_range' },
  { id: '3', pool: 'Hot Tub / Spa', timestamp: format(subHours(now, 1), 'h:mm a'), testedBy: 'Sarah Johnson', freeChlorine: 4.2, combinedChlorine: 0.3, ph: 7.3, alkalinity: 110, waterTemp: 102, status: 'in_range' },
  { id: '4', pool: 'Kiddie Pool', timestamp: format(subHours(now, 1), 'h:mm a'), testedBy: 'Sarah Johnson', freeChlorine: 2.0, combinedChlorine: 0.5, ph: 7.9, alkalinity: 130, waterTemp: 84, status: 'warning', notes: 'pH slightly high' },
  { id: '5', pool: 'Main Pool', timestamp: format(subHours(now, 3), 'h:mm a'), testedBy: 'Mike Williams', freeChlorine: 1.5, combinedChlorine: 0.2, ph: 7.4, alkalinity: 98, waterTemp: 81, status: 'in_range' },
  { id: '6', pool: 'Lap Pool', timestamp: format(subHours(now, 3), 'h:mm a'), testedBy: 'Mike Williams', freeChlorine: 0.8, combinedChlorine: 0.6, ph: 8.1, alkalinity: 140, waterTemp: 79, status: 'out_of_range', chemicalsAdded: 'Added 3 cups sodium hypochlorite', notes: 'Chlorine low, pH high - corrective action taken' },
]
