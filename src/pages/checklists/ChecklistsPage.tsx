import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, Clock, Camera } from 'lucide-react'
import { useState } from 'react'

export function ChecklistsPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const toggleTask = (taskId: string) => {
    setCompleted((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const completedCount = Object.values(completed).filter(Boolean).length
  const totalTasks = mockTasks.length
  const progress = (completedCount / totalTasks) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opening Checklist"
        subtitle="Complete all tasks before opening the facility"
      />

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">
                {completedCount} / {totalTasks} Tasks
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <div className="space-y-4">
        {mockTasks.map((task) => (
          <Card
            key={task.id}
            className={completed[task.id] ? 'bg-green-50 border-green-200' : ''}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={completed[task.id]}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${completed[task.id] ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    {task.requiresPhoto && (
                      <Badge variant="outline">
                        <Camera className="h-3 w-3 mr-1" />
                        Photo Required
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.estimatedMinutes} min
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  {task.requiresPhoto && !completed[task.id] && (
                    <Button variant="outline" size="sm" className="mt-3">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit */}
      <Card>
        <CardContent className="pt-6">
          <Button
            className="w-full"
            size="lg"
            disabled={completedCount !== totalTasks}
          >
            <CheckSquare className="mr-2 h-5 w-5" />
            Submit Checklist
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const mockTasks = [
  {
    id: '1',
    title: 'Unlock main entrance',
    description: 'Unlock front doors and turn on entrance lighting',
    estimatedMinutes: 2,
    requiresPhoto: false,
  },
  {
    id: '2',
    title: 'Test pool chemistry',
    description: 'Test chlorine, pH, and temperature levels',
    estimatedMinutes: 5,
    requiresPhoto: true,
  },
  {
    id: '3',
    title: 'Inspect fitness equipment',
    description: 'Walk through and visually inspect all cardio and strength equipment',
    estimatedMinutes: 10,
    requiresPhoto: false,
  },
  {
    id: '4',
    title: 'Check locker rooms',
    description: 'Verify cleanliness and stock supplies',
    estimatedMinutes: 8,
    requiresPhoto: true,
  },
  {
    id: '5',
    title: 'Turn on HVAC systems',
    description: 'Verify temperature settings and air flow',
    estimatedMinutes: 3,
    requiresPhoto: false,
  },
]
