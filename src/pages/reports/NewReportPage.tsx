import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Send } from 'lucide-react'

export function NewReportPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to Supabase
    navigate('/reports')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Shift Report"
        subtitle="Document daily operations and activities"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pool">Pool Area</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shift Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shift Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opening">Opening (6AM - 2PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                        <SelectItem value="closing">Closing (10PM - 12AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weather Conditions</Label>
                  <Input placeholder="Sunny, 72°F" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Patrons</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Peak Time</Label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label>Staff Count</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pool" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pool Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pool Temperature (°F)</Label>
                    <Input type="number" step="0.1" placeholder="82.0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chlorine Level (ppm)</Label>
                    <Input type="number" step="0.1" placeholder="2.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>pH Level</Label>
                    <Input type="number" step="0.1" placeholder="7.4" />
                  </div>
                  <div className="space-y-2">
                    <Label>Swimmer Count</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Issues/Observations</Label>
                  <Textarea placeholder="Note any issues or observations..." rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Floor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cardio Equipment Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">All Operational</SelectItem>
                        <SelectItem value="issues">Some Issues</SelectItem>
                        <SelectItem value="down">Equipment Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Peak Occupancy</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equipment Cleaned</Label>
                  <Textarea placeholder="List equipment cleaned..." rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Courts & Gymnasium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Court Reservations</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Court Condition Notes</Label>
                  <Textarea placeholder="Note any maintenance needs..." rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>General Notes</Label>
                  <Textarea
                    placeholder="Any additional observations, incidents, or important information..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Handoff to Next Shift</Label>
                  <Textarea
                    placeholder="Important information for the next shift..."
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
