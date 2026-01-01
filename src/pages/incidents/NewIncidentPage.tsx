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
import { BodyDiagram } from '@/components/BodyDiagram'
import { AlertTriangle, Camera, Send } from 'lucide-react'

export function NewIncidentPage() {
  const navigate = useNavigate()
  const [emsCall ed, setEmsCalled] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to Supabase
    navigate('/incidents')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Incident"
        subtitle="Document incident details and follow-up actions"
        actions={
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Incident Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="illness">Illness</SelectItem>
                    <SelectItem value="property">Property Damage</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="near_miss">Near Miss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity Level *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pool">Main Pool</SelectItem>
                    <SelectItem value="fitness">Fitness Floor</SelectItem>
                    <SelectItem value="courts">Basketball Courts</SelectItem>
                    <SelectItem value="locker">Locker Rooms</SelectItem>
                    <SelectItem value="lobby">Lobby/Entrance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time *</Label>
                <Input type="datetime-local" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Description */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>What Happened? *</Label>
              <Textarea
                placeholder="Provide a detailed description of the incident..."
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Person(s) Involved</Label>
                <Input placeholder="Name(s)" />
              </div>
              <div className="space-y-2">
                <Label>Contact Information</Label>
                <Input placeholder="Phone or email" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Diagram (for injuries) */}
        <BodyDiagram />

        {/* Emergency Response */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ems"
                checked={emsCalled}
                onCheckedChange={(checked) => setEmsCalled(checked as boolean)}
              />
              <label
                htmlFor="ems"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                EMS Called
              </label>
            </div>
            {emsCalled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>EMS Call Time</Label>
                  <Input type="time" />
                </div>
                <div className="space-y-2">
                  <Label>EMS Arrival Time</Label>
                  <Input type="time" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>First Aid Provided</Label>
              <Textarea
                placeholder="Describe any first aid or medical response..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Witnesses */}
        <Card>
          <CardHeader>
            <CardTitle>Witnesses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Witness Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Input placeholder="Phone or email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Witness Statement</Label>
              <Textarea
                placeholder="What did the witness observe?"
                rows={3}
              />
            </div>
            <Button type="button" variant="outline" size="sm">
              + Add Another Witness
            </Button>
          </CardContent>
        </Card>

        {/* Photo Evidence */}
        <Card>
          <CardHeader>
            <CardTitle>Photo Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload photos of the incident scene or injuries
              </p>
              <Button type="button" variant="outline">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="followup" />
              <label
                htmlFor="followup"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Follow-up Required
              </label>
            </div>
            <div className="space-y-2">
              <Label>Follow-up Notes</Label>
              <Textarea
                placeholder="What actions need to be taken?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
