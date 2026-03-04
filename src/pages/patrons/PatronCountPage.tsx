import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Users, Plus, Minus, TrendingUp, TrendingDown,
  Clock, MapPin, RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'

interface AreaCount {
  area: string
  current: number
  capacity: number
  trend: 'up' | 'down' | 'stable'
}

export function PatronCountPage() {
  const [areas, setAreas] = useState<AreaCount[]>(initialAreas)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const totalCurrent = areas.reduce((sum, a) => sum + a.current, 0)
  const totalCapacity = areas.reduce((sum, a) => sum + a.capacity, 0)
  const utilizationPct = Math.round((totalCurrent / totalCapacity) * 100)

  const adjustCount = (areaIndex: number, delta: number) => {
    setAreas(prev => prev.map((a, i) =>
      i === areaIndex
        ? { ...a, current: Math.max(0, Math.min(a.capacity, a.current + delta)) }
        : a
    ))
    setLastUpdated(new Date())
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patron Count"
        subtitle="Real-time facility occupancy tracking"
        actions={
          <Button variant="outline" onClick={() => setLastUpdated(new Date())}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCurrent}</p>
                <p className="text-xs text-muted-foreground">Current Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">Max Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${utilizationPct > 80 ? 'bg-red-500/10' : utilizationPct > 60 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                <TrendingUp className={`h-4 w-4 ${utilizationPct > 80 ? 'text-red-600' : utilizationPct > 60 ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{utilizationPct}%</p>
                <p className="text-xs text-muted-foreground">Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-500/10 p-2">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold">{format(lastUpdated, 'h:mm a')}</p>
                <p className="text-xs text-muted-foreground">Last Updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall capacity bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Facility Utilization</p>
            <p className="text-sm font-bold">{totalCurrent} / {totalCapacity}</p>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                utilizationPct > 90 ? 'bg-red-500' :
                utilizationPct > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${utilizationPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Area Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area, index) => {
          const pct = Math.round((area.current / area.capacity) * 100)
          const isHigh = pct > 80
          return (
            <Card key={area.area} className={isHigh ? 'border-yellow-300' : ''}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{area.area}</h3>
                    <p className="text-xs text-muted-foreground">
                      Capacity: {area.capacity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {area.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-green-600" />}
                    {area.trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
                    <Badge variant={isHigh ? 'warning' : 'secondary'}>{pct}%</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={() => adjustCount(index, -1)}
                    disabled={area.current <= 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-4xl font-bold">{area.current}</p>
                    <p className="text-xs text-muted-foreground">current</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={() => adjustCount(index, 1)}
                    disabled={area.current >= area.capacity}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const initialAreas: AreaCount[] = [
  { area: 'Main Pool', current: 32, capacity: 50, trend: 'up' },
  { area: 'Lap Pool', current: 8, capacity: 20, trend: 'stable' },
  { area: 'Fitness Floor', current: 45, capacity: 75, trend: 'up' },
  { area: 'Free Weight Area', current: 18, capacity: 25, trend: 'down' },
  { area: 'Courts / Gymnasium', current: 22, capacity: 60, trend: 'stable' },
  { area: 'Group Exercise Studio', current: 20, capacity: 30, trend: 'up' },
  { area: 'Hot Tub / Spa', current: 6, capacity: 8, trend: 'stable' },
  { area: 'Track / Walking Area', current: 12, capacity: 30, trend: 'down' },
]
