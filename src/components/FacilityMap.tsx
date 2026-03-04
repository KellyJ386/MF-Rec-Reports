import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { X, ZoomIn, ZoomOut, RotateCcw, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MapMark {
  id: string
  x: number
  y: number
  label: string
  type: 'incident' | 'hazard' | 'equipment' | 'note'
  color: string
}

interface FacilityMapProps {
  value?: MapMark[]
  onChange?: (marks: MapMark[]) => void
  markType?: MapMark['type']
  label?: string
  facilityName?: string
}

const MARK_COLORS: Record<string, string> = {
  incident: '#ef4444',
  hazard: '#f59e0b',
  equipment: '#3b82f6',
  note: '#8b5cf6',
}

const MARK_LABELS: Record<string, string> = {
  incident: 'Incident',
  hazard: 'Hazard',
  equipment: 'Equipment',
  note: 'Note',
}

// Default facility floor plan (simplified rec center)
const DefaultFloorPlan = () => (
  <g className="fill-none stroke-foreground/20 stroke-1">
    {/* Building outline */}
    <rect x="10" y="10" width="380" height="280" rx="4" className="stroke-foreground/40" />

    {/* Main Pool */}
    <rect x="20" y="20" width="150" height="100" rx="4" className="fill-blue-100/50 stroke-blue-400" />
    <text x="95" y="75" textAnchor="middle" className="fill-blue-600 text-[10px] font-medium">Main Pool</text>

    {/* Fitness Floor */}
    <rect x="180" y="20" width="100" height="100" rx="4" className="fill-green-100/50 stroke-green-400" />
    <text x="230" y="75" textAnchor="middle" className="fill-green-600 text-[10px] font-medium">Fitness Floor</text>

    {/* Courts */}
    <rect x="290" y="20" width="90" height="100" rx="4" className="fill-orange-100/50 stroke-orange-400" />
    <text x="335" y="75" textAnchor="middle" className="fill-orange-600 text-[10px] font-medium">Courts</text>

    {/* Lobby */}
    <rect x="20" y="130" width="100" height="60" rx="4" className="fill-gray-100/50 stroke-gray-400" />
    <text x="70" y="165" textAnchor="middle" className="fill-gray-600 text-[10px] font-medium">Lobby</text>

    {/* Locker Room A */}
    <rect x="130" y="130" width="80" height="60" rx="4" className="fill-purple-100/50 stroke-purple-400" />
    <text x="170" y="165" textAnchor="middle" className="fill-purple-600 text-[10px] font-medium">Locker A</text>

    {/* Locker Room B */}
    <rect x="220" y="130" width="80" height="60" rx="4" className="fill-purple-100/50 stroke-purple-400" />
    <text x="260" y="165" textAnchor="middle" className="fill-purple-600 text-[10px] font-medium">Locker B</text>

    {/* Studio */}
    <rect x="310" y="130" width="70" height="60" rx="4" className="fill-pink-100/50 stroke-pink-400" />
    <text x="345" y="165" textAnchor="middle" className="fill-pink-600 text-[10px] font-medium">Studio</text>

    {/* Offices */}
    <rect x="20" y="200" width="120" height="80" rx="4" className="fill-slate-100/50 stroke-slate-400" />
    <text x="80" y="245" textAnchor="middle" className="fill-slate-600 text-[10px] font-medium">Offices</text>

    {/* Equipment Room */}
    <rect x="150" y="200" width="80" height="80" rx="4" className="fill-amber-100/50 stroke-amber-400" />
    <text x="190" y="245" textAnchor="middle" className="fill-amber-600 text-[10px] font-medium">Equipment</text>

    {/* Spa / Hot Tub */}
    <rect x="240" y="200" width="60" height="80" rx="4" className="fill-cyan-100/50 stroke-cyan-400" />
    <text x="270" y="245" textAnchor="middle" className="fill-cyan-600 text-[10px] font-medium">Spa</text>

    {/* Storage */}
    <rect x="310" y="200" width="70" height="80" rx="4" className="fill-neutral-100/50 stroke-neutral-400" />
    <text x="345" y="245" textAnchor="middle" className="fill-neutral-600 text-[10px] font-medium">Storage</text>
  </g>
)

export function FacilityMap({
  value = [],
  onChange,
  markType = 'incident',
  label = 'Facility Location Map',
  facilityName = 'Recreation Center',
}: FacilityMapProps) {
  const [marks, setMarks] = useState<MapMark[]>(value)
  const [nextMarkNumber, setNextMarkNumber] = useState(value.length + 1)

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 400
    const y = ((e.clientY - rect.top) / rect.height) * 300

    const newMark: MapMark = {
      id: `mark-${Date.now()}`,
      x,
      y,
      label: `${MARK_LABELS[markType]} ${nextMarkNumber}`,
      type: markType,
      color: MARK_COLORS[markType],
    }

    const updated = [...marks, newMark]
    setMarks(updated)
    setNextMarkNumber(nextMarkNumber + 1)
    onChange?.(updated)
  }

  const removeMark = (id: string) => {
    const updated = marks.filter((m) => m.id !== id)
    setMarks(updated)
    onChange?.(updated)
  }

  const clearMarks = () => {
    setMarks([])
    setNextMarkNumber(1)
    onChange?.([])
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{label}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              style={{ borderColor: MARK_COLORS[markType], color: MARK_COLORS[markType] }}
            >
              {MARK_LABELS[markType]}
            </Badge>
            {marks.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearMarks}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Click on the map to mark the location. {facilityName}
        </p>

        <div className="border-2 rounded-lg overflow-hidden bg-white">
          <svg
            viewBox="0 0 400 300"
            className="w-full cursor-crosshair"
            onClick={handleClick}
          >
            <DefaultFloorPlan />

            {/* Marks */}
            {marks.map((mark, index) => (
              <g key={mark.id}>
                {/* Marker circle */}
                <circle
                  cx={mark.x}
                  cy={mark.y}
                  r="10"
                  fill={mark.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer drop-shadow"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMark(mark.id)
                  }}
                />
                {/* Marker number */}
                <text
                  x={mark.x}
                  y={mark.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white text-[9px] font-bold pointer-events-none"
                >
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Mark list */}
        {marks.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Marked Locations:</p>
            {marks.map((mark, index) => (
              <div
                key={mark.id}
                className="flex items-center justify-between text-sm p-2 bg-muted rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mark.color }}
                  >
                    {index + 1}
                  </div>
                  <span>{mark.label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMark(mark.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
