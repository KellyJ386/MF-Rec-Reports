import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Mark {
  x: number
  y: number
  view: 'front' | 'back'
  id: string
}

interface BodyDiagramProps {
  value?: Mark[]
  onChange?: (marks: Mark[]) => void
}

export function BodyDiagram({ value = [], onChange }: BodyDiagramProps) {
  const [marks, setMarks] = useState<Mark[]>(value)
  const [view, setView] = useState<'front' | 'back'>('front')

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newMark: Mark = {
      x,
      y,
      view,
      id: `mark-${Date.now()}`,
    }

    const updated = [...marks, newMark]
    setMarks(updated)
    onChange?.(updated)
  }

  const removeMark = (id: string) => {
    const updated = marks.filter((m) => m.id !== id)
    setMarks(updated)
    onChange?.(updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Diagram - Mark Injury Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as 'front' | 'back')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="front">Front View</TabsTrigger>
            <TabsTrigger value="back">Back View</TabsTrigger>
          </TabsList>

          <TabsContent value={view} className="mt-4">
            <div className="relative">
              <svg
                viewBox="0 0 200 500"
                className="w-full max-w-md mx-auto border-2 border-dashed cursor-crosshair rounded-lg bg-muted/20"
                onClick={handleClick}
              >
                {/* Simple body outline */}
                <g className="fill-none stroke-foreground/30 stroke-2">
                  {/* Head */}
                  <circle cx="100" cy="40" r="25" />
                  {/* Body */}
                  <rect x="70" y="65" width="60" height="100" rx="10" />
                  {/* Arms */}
                  <line x1="70" y1="80" x2="30" y2="140" />
                  <line x1="130" y1="80" x2="170" y2="140" />
                  {/* Legs */}
                  <line x1="85" y1="165" x2="75" y2="280" />
                  <line x1="115" y1="165" x2="125" y2="280" />
                </g>

                {/* Injury marks */}
                {marks
                  .filter((m) => m.view === view)
                  .map((mark) => (
                    <g key={mark.id}>
                      <circle
                        cx={`${mark.x}%`}
                        cy={`${mark.y}%`}
                        r="8"
                        className="fill-red-500 stroke-red-700 stroke-2 cursor-pointer hover:fill-red-600"
                      />
                      <text
                        x={`${mark.x}%`}
                        y={`${mark.y}%`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-xs font-bold pointer-events-none"
                      >
                        ×
                      </text>
                    </g>
                  ))}
              </svg>

              {/* Marked locations list */}
              {marks.filter((m) => m.view === view).length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Marked Locations ({view}):</p>
                  <div className="space-y-1">
                    {marks
                      .filter((m) => m.view === view)
                      .map((mark, index) => (
                        <div
                          key={mark.id}
                          className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                        >
                          <span>
                            Mark {index + 1} ({mark.view})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMark(mark.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
