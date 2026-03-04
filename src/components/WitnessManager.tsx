import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X, User, Phone, Mail, MessageSquare } from 'lucide-react'

export interface Witness {
  id: string
  name: string
  phone: string
  email: string
  statement: string
}

interface WitnessManagerProps {
  value?: Witness[]
  onChange?: (witnesses: Witness[]) => void
}

export function WitnessManager({ value = [], onChange }: WitnessManagerProps) {
  const [witnesses, setWitnesses] = useState<Witness[]>(value)

  const addWitness = () => {
    const newWitness: Witness = {
      id: `witness-${Date.now()}`,
      name: '',
      phone: '',
      email: '',
      statement: '',
    }
    const updated = [...witnesses, newWitness]
    setWitnesses(updated)
    onChange?.(updated)
  }

  const updateWitness = (id: string, field: keyof Witness, val: string) => {
    const updated = witnesses.map((w) =>
      w.id === id ? { ...w, [field]: val } : w
    )
    setWitnesses(updated)
    onChange?.(updated)
  }

  const removeWitness = (id: string) => {
    const updated = witnesses.filter((w) => w.id !== id)
    setWitnesses(updated)
    onChange?.(updated)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-5 w-5" />
            Witnesses
            {witnesses.length > 0 && (
              <Badge variant="secondary">{witnesses.length}</Badge>
            )}
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addWitness}>
            <Plus className="mr-2 h-4 w-4" />
            Add Witness
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {witnesses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No witnesses added yet</p>
            <p className="text-xs mt-1">Click "Add Witness" to document witness information</p>
          </div>
        ) : (
          <div className="space-y-4">
            {witnesses.map((witness, index) => (
              <div
                key={witness.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Witness {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWitness(witness.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Full Name
                    </label>
                    <Input
                      placeholder="John Smith"
                      value={witness.name}
                      onChange={(e) => updateWitness(witness.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={witness.phone}
                      onChange={(e) => updateWitness(witness.id, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={witness.email}
                      onChange={(e) => updateWitness(witness.id, 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Witness Statement
                  </label>
                  <Textarea
                    placeholder="What did the witness observe? Please provide as much detail as possible..."
                    rows={3}
                    value={witness.statement}
                    onChange={(e) => updateWitness(witness.id, 'statement', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
