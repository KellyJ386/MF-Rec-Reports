import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BodyDiagram } from '@/components/BodyDiagram'
import { WitnessManager, Witness } from '@/components/WitnessManager'
import { PhotoUpload } from '@/components/PhotoUpload'
import { SignaturePad } from '@/components/SignaturePad'
import { FacilityMap, MapMarker } from '@/components/FacilityMap'
import {
  Send, Save, AlertTriangle, Shield, Users,
  Camera, MapPin, PenTool, Phone, Clock,
} from 'lucide-react'

export function NewIncidentPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')

  // Classification
  const [incidentType, setIncidentType] = useState('')
  const [severity, setSeverity] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [specificLocation, setSpecificLocation] = useState('')

  // Description
  const [whatHappened, setWhatHappened] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')
  const [contributingFactors, setContributingFactors] = useState('')

  // Involved persons
  const [injuredName, setInjuredName] = useState('')
  const [injuredPhone, setInjuredPhone] = useState('')
  const [injuredEmail, setInjuredEmail] = useState('')
  const [injuredAge, setInjuredAge] = useState('')
  const [injuredMember, setInjuredMember] = useState(false)
  const [injuredMemberId, setInjuredMemberId] = useState('')

  // Emergency response
  const [emsCalled, setEmsCalled] = useState(false)
  const [emsCallTime, setEmsCallTime] = useState('')
  const [emsArrivalTime, setEmsArrivalTime] = useState('')
  const [policeCalled, setPoliceCalled] = useState(false)
  const [policeReportNumber, setPoliceReportNumber] = useState('')
  const [firstAid, setFirstAid] = useState('')
  const [hospitalTransport, setHospitalTransport] = useState(false)
  const [hospitalName, setHospitalName] = useState('')

  // Witnesses
  const [witnesses, setWitnesses] = useState<Witness[]>([])

  // Photos & maps
  const [photos, setPhotos] = useState<string[]>([])
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([])

  // Follow-up
  const [followUpRequired, setFollowUpRequired] = useState(false)
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [parentNotified, setParentNotified] = useState(false)
  const [insuranceFiled, setInsuranceFiled] = useState(false)
  const [preventiveMeasures, setPreventiveMeasures] = useState('')

  // Signature
  const [signature, setSignature] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/incidents')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Incident"
        subtitle="Document incident details and follow-up actions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Submit Report
            </Button>
          </div>
        }
      />

      {severity === 'critical' && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-400">Critical Incident</p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This will trigger immediate notifications to management and safety personnel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="details">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              Details
            </TabsTrigger>
            <TabsTrigger value="persons">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Persons
            </TabsTrigger>
            <TabsTrigger value="response">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Response
            </TabsTrigger>
            <TabsTrigger value="evidence">
              <Camera className="h-3.5 w-3.5 mr-1.5" />
              Evidence
            </TabsTrigger>
            <TabsTrigger value="followup">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Follow-up
            </TabsTrigger>
            <TabsTrigger value="signature">
              <PenTool className="h-3.5 w-3.5 mr-1.5" />
              Sign
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Incident Type *</Label>
                    <Select value={incidentType} onValueChange={setIncidentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="injury_patron">Injury - Patron</SelectItem>
                        <SelectItem value="injury_staff">Injury - Staff</SelectItem>
                        <SelectItem value="illness">Illness / Medical Emergency</SelectItem>
                        <SelectItem value="rescue">Water Rescue</SelectItem>
                        <SelectItem value="near_miss">Near Miss</SelectItem>
                        <SelectItem value="property_damage">Property Damage</SelectItem>
                        <SelectItem value="theft">Theft / Lost Property</SelectItem>
                        <SelectItem value="behavioral">Behavioral / Confrontation</SelectItem>
                        <SelectItem value="chemical">Chemical Exposure</SelectItem>
                        <SelectItem value="fire">Fire / Smoke</SelectItem>
                        <SelectItem value="weather">Weather Related</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity Level *</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor - No medical attention needed</SelectItem>
                        <SelectItem value="moderate">Moderate - First aid administered</SelectItem>
                        <SelectItem value="severe">Severe - Medical attention required</SelectItem>
                        <SelectItem value="critical">Critical - Life threatening / EMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main_pool">Main Pool</SelectItem>
                        <SelectItem value="lap_pool">Lap Pool</SelectItem>
                        <SelectItem value="kiddie_pool">Kiddie Pool</SelectItem>
                        <SelectItem value="hot_tub">Hot Tub / Spa</SelectItem>
                        <SelectItem value="pool_deck">Pool Deck</SelectItem>
                        <SelectItem value="fitness_floor">Fitness Floor</SelectItem>
                        <SelectItem value="free_weights">Free Weight Area</SelectItem>
                        <SelectItem value="group_exercise">Group Exercise Studio</SelectItem>
                        <SelectItem value="basketball_court">Basketball Court</SelectItem>
                        <SelectItem value="racquetball">Racquetball Court</SelectItem>
                        <SelectItem value="gymnasium">Gymnasium</SelectItem>
                        <SelectItem value="locker_room_m">Locker Room - Men</SelectItem>
                        <SelectItem value="locker_room_f">Locker Room - Women</SelectItem>
                        <SelectItem value="lobby">Lobby / Front Desk</SelectItem>
                        <SelectItem value="parking">Parking Lot</SelectItem>
                        <SelectItem value="playground">Playground</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={dateTime}
                      onChange={e => setDateTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Specific Location Details</Label>
                  <Input
                    value={specificLocation}
                    onChange={e => setSpecificLocation(e.target.value)}
                    placeholder="e.g., Near lane 3 in deep end, by bench press station #2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>What happened? *</Label>
                  <Textarea
                    value={whatHappened}
                    onChange={e => setWhatHappened(e.target.value)}
                    placeholder="Provide a detailed, factual description of the incident. Include the sequence of events leading up to, during, and after the incident."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Immediate Actions Taken</Label>
                  <Textarea
                    value={actionsTaken}
                    onChange={e => setActionsTaken(e.target.value)}
                    placeholder="What actions were taken immediately after the incident?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contributing Factors</Label>
                  <Textarea
                    value={contributingFactors}
                    onChange={e => setContributingFactors(e.target.value)}
                    placeholder="Any conditions or factors that may have contributed (wet floor, broken equipment, lighting, etc.)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Persons Tab */}
          <TabsContent value="persons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Injured / Affected Person</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={injuredName}
                      onChange={e => setInjuredName(e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={injuredAge}
                      onChange={e => setInjuredAge(e.target.value)}
                      placeholder="Age"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={injuredPhone}
                      onChange={e => setInjuredPhone(e.target.value)}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={injuredEmail}
                      onChange={e => setInjuredEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isMember"
                    checked={injuredMember}
                    onCheckedChange={(checked) => setInjuredMember(!!checked)}
                  />
                  <label htmlFor="isMember" className="text-sm">Facility member</label>
                </div>
                {injuredMember && (
                  <div className="space-y-2">
                    <Label>Member ID</Label>
                    <Input
                      value={injuredMemberId}
                      onChange={e => setInjuredMemberId(e.target.value)}
                      placeholder="Member ID number"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {(incidentType === 'injury_patron' || incidentType === 'injury_staff') && (
              <BodyDiagram />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Witnesses</CardTitle>
              </CardHeader>
              <CardContent>
                <WitnessManager value={witnesses} onChange={setWitnesses} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Response Tab */}
          <TabsContent value="response" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emsCalled"
                    checked={emsCalled}
                    onCheckedChange={(checked) => setEmsCalled(!!checked)}
                  />
                  <label htmlFor="emsCalled" className="text-sm font-medium">EMS / Ambulance Called</label>
                </div>
                {emsCalled && (
                  <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
                    <div className="space-y-2">
                      <Label>Call Time</Label>
                      <Input type="time" value={emsCallTime} onChange={e => setEmsCallTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Arrival Time</Label>
                      <Input type="time" value={emsArrivalTime} onChange={e => setEmsArrivalTime(e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="policeCalled"
                    checked={policeCalled}
                    onCheckedChange={(checked) => setPoliceCalled(!!checked)}
                  />
                  <label htmlFor="policeCalled" className="text-sm font-medium">Police Called</label>
                </div>
                {policeCalled && (
                  <div className="pl-6 border-l-2 border-primary/20 space-y-2">
                    <Label>Police Report Number</Label>
                    <Input
                      value={policeReportNumber}
                      onChange={e => setPoliceReportNumber(e.target.value)}
                      placeholder="Report #"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hospital"
                    checked={hospitalTransport}
                    onCheckedChange={(checked) => setHospitalTransport(!!checked)}
                  />
                  <label htmlFor="hospital" className="text-sm font-medium">Transported to Hospital</label>
                </div>
                {hospitalTransport && (
                  <div className="pl-6 border-l-2 border-primary/20 space-y-2">
                    <Label>Hospital Name</Label>
                    <Input
                      value={hospitalName}
                      onChange={e => setHospitalName(e.target.value)}
                      placeholder="Hospital name"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First Aid / Medical Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Treatment Provided</Label>
                  <Textarea
                    value={firstAid}
                    onChange={e => setFirstAid(e.target.value)}
                    placeholder="Describe any first aid, treatment, or medical response provided..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Photo Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoUpload
                  value={photos}
                  onChange={setPhotos}
                  maxFiles={10}
                  label="Upload photos of the incident scene, injuries, or relevant conditions"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Facility Map - Incident Location
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FacilityMap
                  value={mapMarkers}
                  onChange={setMapMarkers}
                  markType="incident"
                  label="Click on the map to mark the incident location"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Follow-up Tab */}
          <TabsContent value="followup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followup"
                    checked={followUpRequired}
                    onCheckedChange={(checked) => setFollowUpRequired(!!checked)}
                  />
                  <label htmlFor="followup" className="text-sm font-medium">Follow-up Required</label>
                </div>
                {followUpRequired && (
                  <>
                    <div className="space-y-2">
                      <Label>Follow-up Date</Label>
                      <Input
                        type="date"
                        value={followUpDate}
                        onChange={e => setFollowUpDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up Notes</Label>
                      <Textarea
                        value={followUpNotes}
                        onChange={e => setFollowUpNotes(e.target.value)}
                        placeholder="What follow-up actions are needed?"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parentNotified"
                      checked={parentNotified}
                      onCheckedChange={(checked) => setParentNotified(!!checked)}
                    />
                    <label htmlFor="parentNotified" className="text-sm">Parent/Guardian Notified (if minor)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance"
                      checked={insuranceFiled}
                      onCheckedChange={(checked) => setInsuranceFiled(!!checked)}
                    />
                    <label htmlFor="insurance" className="text-sm">Insurance claim filed</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preventive Measures</Label>
                  <Textarea
                    value={preventiveMeasures}
                    onChange={e => setPreventiveMeasures(e.target.value)}
                    placeholder="What can be done to prevent similar incidents in the future?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reporting Staff Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  By signing below, I certify that this report is accurate and complete to the best of my knowledge.
                </p>
                <SignaturePad
                  value={signature}
                  onChange={setSignature}
                  label="Sign here"
                  required
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
