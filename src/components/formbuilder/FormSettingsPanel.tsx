import { FormSettings } from '@/types/forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface FormSettingsPanelProps {
  settings: FormSettings
  onChange: (settings: FormSettings) => void
}

export function FormSettingsPanel({ settings, onChange }: FormSettingsPanelProps) {
  const update = (key: keyof FormSettings, value: unknown) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Allow Draft Submissions</Label>
              <p className="text-xs text-muted-foreground">
                Users can save partially completed forms as drafts
              </p>
            </div>
            <Checkbox
              checked={settings.allowDraft}
              onCheckedChange={(checked) => update('allowDraft', !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Require Signature</Label>
              <p className="text-xs text-muted-foreground">
                A digital signature is required to submit the form
              </p>
            </div>
            <Checkbox
              checked={settings.requireSignature}
              onCheckedChange={(checked) => update('requireSignature', !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Require Approval</Label>
              <p className="text-xs text-muted-foreground">
                Submissions must be reviewed and approved by a manager
              </p>
            </div>
            <Checkbox
              checked={settings.requireApproval}
              onCheckedChange={(checked) => update('requireApproval', !!checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto-Save</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Auto-Save Interval (seconds)</Label>
            <Input
              type="number"
              value={settings.autoSaveInterval}
              onChange={(e) => update('autoSaveInterval', Number(e.target.value))}
              min={10}
              max={300}
            />
            <p className="text-xs text-muted-foreground">
              How often form data is automatically saved (10-300 seconds)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">PDF Export</Label>
              <p className="text-xs text-muted-foreground">
                Allow submissions to be exported as PDF documents
              </p>
            </div>
            <Checkbox
              checked={settings.pdfExport}
              onCheckedChange={(checked) => update('pdfExport', !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Email on Complete</Label>
              <p className="text-xs text-muted-foreground">
                Send confirmation email when a form is submitted
              </p>
            </div>
            <Checkbox
              checked={settings.emailOnComplete}
              onCheckedChange={(checked) => update('emailOnComplete', !!checked)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Notify on Submit</Label>
            <Input
              value={settings.notifyOnSubmit.join(', ')}
              onChange={(e) =>
                update('notifyOnSubmit', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
              }
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated email addresses to notify on each submission
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
