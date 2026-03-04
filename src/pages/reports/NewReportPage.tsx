import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Save, Send, Plus, Trash2, AlertTriangle,
  ThermometerSun, Droplets, Users, Clock,
  CheckCircle2, Camera,
} from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  role: string
  timeIn: string
  timeOut: string
}

interface AreaCheck {
  area: string
  status: 'good' | 'issue' | 'closed'
  notes: string
}

export function NewReportPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')

  // Shift info state
  const [shiftType, setShiftType] = useState('')
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0])
  const [weather, setWeather] = useState('')
  const [temperature, setTemperature] = useState('')

  // Patron counts
  const [patronCounts, setPatronCounts] = useState({
    total: '',
    peak: '',
    peakTime: '',
    pool: '',
    fitness: '',
    courts: '',
    other: '',
  })

  // Staff tracking
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: '1', name: '', role: '', timeIn: '', timeOut: '' },
  ])

  // Pool operations
  const [poolReadings, setPoolReadings] = useState({
    mainPoolTemp: '',
    mainChlorine: '',
    mainPH: '',
    mainAlkalinity: '',
    hotTubTemp: '',
    hotTubChlorine: '',
    hotTubPH: '',
    swimmerCount: '',
    guardsOnDuty: '',
    rescues: '0',
    saves: '0',
    poolIssues: '',
  })

  // Area checks
  const [areaChecks, setAreaChecks] = useState<AreaCheck[]>([
    { area: 'Main Pool', status: 'good', notes: '' },
    { area: 'Hot Tub/Spa', status: 'good', notes: '' },
    { area: 'Fitness Floor', status: 'good', notes: '' },
    { area: 'Courts/Gymnasium', status: 'good', notes: '' },
    { area: 'Locker Rooms', status: 'good', notes: '' },
    { area: 'Front Desk/Lobby', status: 'good', notes: '' },
    { area: 'Group Exercise Studio', status: 'good', notes: '' },
    { area: 'Parking Lot/Exterior', status: 'good', notes: '' },
  ])

  // Equipment status
  const [equipmentDown, setEquipmentDown] = useState<string[]>([])
  const [newEquipmentIssue, setNewEquipmentIssue] = useState('')

  // Notes
  const [generalNotes, setGeneralNotes] = useState('')
  const [handoffNotes, setHandoffNotes] = useState('')
  const [incidentsSummary, setIncidentsSummary] = useState('')
  const [hasIncidents, setHasIncidents] = useState(false)

  const addStaffMember = () => {
    setStaffMembers(prev => [
      ...prev,
      { id: String(Date.now()), name: '', role: '', timeIn: '', timeOut: '' },
    ])
  }

  const updateStaffMember = (id: string, field: keyof StaffMember, value: string) => {
    setStaffMembers(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    )
  }

  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(s => s.id !== id))
  }

  const updateAreaCheck = (index: number, field: keyof AreaCheck, value: string) => {
    setAreaChecks(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addEquipmentIssue = () => {
    if (newEquipmentIssue.trim()) {
      setEquipmentDown(prev => [...prev, newEquipmentIssue.trim()])
      setNewEquipmentIssue('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/reports')
  }

  const handleSaveDraft = () => {
    navigate('/reports')
  }

  const issueCount = areaChecks.filter(a => a.status === 'issue').length
  const closedCount = areaChecks.filter(a => a.status === 'closed').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Shift Report"
        subtitle="Document daily operations and activities"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Submit Report
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="staff">
              Staff
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
                {staffMembers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pool">Pool</TabsTrigger>
            <TabsTrigger value="areas">
              Areas
              {issueCount > 0 && (
                <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5">
                  {issueCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Shift Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shift Type *</Label>
                    <Select value={shiftType} onValueChange={setShiftType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opening">Opening (6:00 AM - 2:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2:00 PM - 10:00 PM)</SelectItem>
                        <SelectItem value="closing">Closing (10:00 PM - 12:00 AM)</SelectItem>
                        <SelectItem value="weekend_am">Weekend AM (7:00 AM - 3:00 PM)</SelectItem>
                        <SelectItem value="weekend_pm">Weekend PM (3:00 PM - 11:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weather Conditions</Label>
                    <Select value={weather} onValueChange={setWeather}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear">Clear / Sunny</SelectItem>
                        <SelectItem value="partly_cloudy">Partly Cloudy</SelectItem>
                        <SelectItem value="cloudy">Cloudy / Overcast</SelectItem>
                        <SelectItem value="rain">Rain</SelectItem>
                        <SelectItem value="thunderstorm">Thunderstorm</SelectItem>
                        <SelectItem value="snow">Snow</SelectItem>
                        <SelectItem value="extreme_heat">Extreme Heat (&gt;95°F)</SelectItem>
                        <SelectItem value="extreme_cold">Extreme Cold (&lt;20°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Outside Temperature (°F)</Label>
                    <Input
                      type="number"
                      value={temperature}
                      onChange={e => setTemperature(e.target.value)}
                      placeholder="72"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patron Counts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Patrons *</Label>
                    <Input
                      type="number"
                      value={patronCounts.total}
                      onChange={e => setPatronCounts(p => ({ ...p, total: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Peak Count</Label>
                    <Input
                      type="number"
                      value={patronCounts.peak}
                      onChange={e => setPatronCounts(p => ({ ...p, peak: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Peak Time</Label>
                    <Input
                      type="time"
                      value={patronCounts.peakTime}
                      onChange={e => setPatronCounts(p => ({ ...p, peakTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Pool Area</Label>
                    <Input
                      type="number"
                      value={patronCounts.pool}
                      onChange={e => setPatronCounts(p => ({ ...p, pool: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fitness Floor</Label>
                    <Input
                      type="number"
                      value={patronCounts.fitness}
                      onChange={e => setPatronCounts(p => ({ ...p, fitness: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Courts/Gym</Label>
                    <Input
                      type="number"
                      value={patronCounts.courts}
                      onChange={e => setPatronCounts(p => ({ ...p, courts: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Areas</Label>
                    <Input
                      type="number"
                      value={patronCounts.other}
                      onChange={e => setPatronCounts(p => ({ ...p, other: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Staff on Duty
                  </CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addStaffMember}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {staffMembers.map((member) => (
                  <div key={member.id} className="grid grid-cols-12 gap-3 items-end border-b pb-3 last:border-0">
                    <div className="col-span-12 sm:col-span-3 space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={member.name}
                        onChange={e => updateStaffMember(member.id, 'name', e.target.value)}
                        placeholder="Staff name"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3 space-y-1">
                      <Label className="text-xs">Role</Label>
                      <Select
                        value={member.role}
                        onValueChange={v => updateStaffMember(member.id, 'role', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="lifeguard">Lifeguard</SelectItem>
                          <SelectItem value="fitness_attendant">Fitness Attendant</SelectItem>
                          <SelectItem value="front_desk">Front Desk</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 sm:col-span-2 space-y-1">
                      <Label className="text-xs">Time In</Label>
                      <Input
                        type="time"
                        value={member.timeIn}
                        onChange={e => updateStaffMember(member.id, 'timeIn', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2 space-y-1">
                      <Label className="text-xs">Time Out</Label>
                      <Input
                        type="time"
                        value={member.timeOut}
                        onChange={e => updateStaffMember(member.id, 'timeOut', e.target.value)}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive"
                        onClick={() => removeStaffMember(member.id)}
                        disabled={staffMembers.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pool Tab */}
          <TabsContent value="pool" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Main Pool Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Water Temp (°F)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.mainPoolTemp}
                      onChange={e => setPoolReadings(p => ({ ...p, mainPoolTemp: e.target.value }))}
                      placeholder="82.0"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 78-84°F</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Free Chlorine (ppm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.mainChlorine}
                      onChange={e => setPoolReadings(p => ({ ...p, mainChlorine: e.target.value }))}
                      placeholder="2.5"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 1.0-5.0 ppm</p>
                  </div>
                  <div className="space-y-2">
                    <Label>pH Level</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.mainPH}
                      onChange={e => setPoolReadings(p => ({ ...p, mainPH: e.target.value }))}
                      placeholder="7.4"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 7.2-7.8</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Alkalinity (ppm)</Label>
                    <Input
                      type="number"
                      value={poolReadings.mainAlkalinity}
                      onChange={e => setPoolReadings(p => ({ ...p, mainAlkalinity: e.target.value }))}
                      placeholder="120"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 80-120 ppm</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5" />
                  Hot Tub / Spa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Water Temp (°F)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.hotTubTemp}
                      onChange={e => setPoolReadings(p => ({ ...p, hotTubTemp: e.target.value }))}
                      placeholder="102.0"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 100-104°F</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Free Chlorine (ppm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.hotTubChlorine}
                      onChange={e => setPoolReadings(p => ({ ...p, hotTubChlorine: e.target.value }))}
                      placeholder="3.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>pH Level</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={poolReadings.hotTubPH}
                      onChange={e => setPoolReadings(p => ({ ...p, hotTubPH: e.target.value }))}
                      placeholder="7.4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aquatic Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Peak Swimmer Count</Label>
                    <Input
                      type="number"
                      value={poolReadings.swimmerCount}
                      onChange={e => setPoolReadings(p => ({ ...p, swimmerCount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Guards on Duty</Label>
                    <Input
                      type="number"
                      value={poolReadings.guardsOnDuty}
                      onChange={e => setPoolReadings(p => ({ ...p, guardsOnDuty: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rescues</Label>
                    <Input
                      type="number"
                      value={poolReadings.rescues}
                      onChange={e => setPoolReadings(p => ({ ...p, rescues: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assists / Saves</Label>
                    <Input
                      type="number"
                      value={poolReadings.saves}
                      onChange={e => setPoolReadings(p => ({ ...p, saves: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pool Issues / Observations</Label>
                  <Textarea
                    value={poolReadings.poolIssues}
                    onChange={e => setPoolReadings(p => ({ ...p, poolIssues: e.target.value }))}
                    placeholder="Note any issues with pool operations, water clarity, equipment..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Areas Tab */}
          <TabsContent value="areas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Facility Area Status
                  </CardTitle>
                  <div className="flex gap-2">
                    {issueCount > 0 && (
                      <Badge variant="destructive">{issueCount} issues</Badge>
                    )}
                    {closedCount > 0 && (
                      <Badge variant="secondary">{closedCount} closed</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {areaChecks.map((area, index) => (
                  <div key={area.area} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{area.area}</h4>
                      <Select
                        value={area.status}
                        onValueChange={v => updateAreaCheck(index, 'status', v)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              Good
                            </span>
                          </SelectItem>
                          <SelectItem value="issue">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              Issue
                            </span>
                          </SelectItem>
                          <SelectItem value="closed">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              Closed
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {area.status !== 'good' && (
                      <Input
                        value={area.notes}
                        onChange={e => updateAreaCheck(index, 'notes', e.target.value)}
                        placeholder="Describe the issue..."
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Out of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newEquipmentIssue}
                    onChange={e => setNewEquipmentIssue(e.target.value)}
                    placeholder="Equipment name and issue (e.g., Treadmill #4 - belt slipping)"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addEquipmentIssue()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addEquipmentIssue}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {equipmentDown.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
                    No equipment issues reported
                  </div>
                ) : (
                  <div className="space-y-2">
                    {equipmentDown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between border rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEquipmentDown(prev => prev.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fitness Floor Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cardio Equipment Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_operational">All Operational</SelectItem>
                        <SelectItem value="minor_issues">Minor Issues (1-2 machines)</SelectItem>
                        <SelectItem value="significant">Significant Issues (3+ machines)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Strength Equipment Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_operational">All Operational</SelectItem>
                        <SelectItem value="minor_issues">Minor Issues</SelectItem>
                        <SelectItem value="significant">Significant Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equipment Cleaned This Shift</Label>
                  <Textarea placeholder="List equipment and areas cleaned..." rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Incidents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasIncidents"
                    checked={hasIncidents}
                    onCheckedChange={(checked) => setHasIncidents(!!checked)}
                  />
                  <label htmlFor="hasIncidents" className="text-sm">
                    Incidents occurred during this shift
                  </label>
                </div>
                {hasIncidents && (
                  <div className="space-y-2">
                    <Label>Incident Summary</Label>
                    <Textarea
                      value={incidentsSummary}
                      onChange={e => setIncidentsSummary(e.target.value)}
                      placeholder="Briefly summarize any incidents. Full incident reports should be filed separately."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Detailed incident reports should be filed in the Incidents module.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Shift Notes</Label>
                  <Textarea
                    value={generalNotes}
                    onChange={e => setGeneralNotes(e.target.value)}
                    placeholder="Any additional observations, notable events, or important information..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Handoff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Information for Next Shift</Label>
                  <Textarea
                    value={handoffNotes}
                    onChange={e => setHandoffNotes(e.target.value)}
                    placeholder="Important information the next shift needs to know..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
