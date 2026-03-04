import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckSquare, Clock, Camera, Sun, Moon, ChevronDown,
  ChevronUp, AlertTriangle, Send, Sparkles, Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistTask {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  requiresPhoto: boolean
  requiresNote: boolean
  category: string
  priority: 'normal' | 'critical'
}

interface ChecklistSection {
  title: string
  icon: React.ElementType
  tasks: ChecklistTask[]
}

export function ChecklistsPage() {
  const [activeChecklist, setActiveChecklist] = useState<'opening' | 'closing'>('opening')
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Safety & Security': true,
    'Pool/Aquatics': true,
    'Fitness Areas': true,
    'Common Areas': true,
    'Final Checks': true,
  })
  const [submitterName, setSubmitterName] = useState('')

  const checklist = activeChecklist === 'opening' ? openingChecklist : closingChecklist
  const allTasks = checklist.flatMap(s => s.tasks)
  const completedCount = allTasks.filter(t => completed[t.id]).length
  const totalTasks = allTasks.length
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0
  const criticalTasks = allTasks.filter(t => t.priority === 'critical')
  const criticalComplete = criticalTasks.filter(t => completed[t.id]).length

  const toggleTask = (taskId: string) => {
    setCompleted(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facility Checklists"
        subtitle="Opening and closing procedures"
      />

      {/* Checklist selector */}
      <div className="flex gap-3">
        <Button
          variant={activeChecklist === 'opening' ? 'default' : 'outline'}
          onClick={() => { setActiveChecklist('opening'); setCompleted({}); setNotes({}) }}
          className="flex-1 sm:flex-none"
        >
          <Sun className="mr-2 h-4 w-4" />
          Opening Checklist
        </Button>
        <Button
          variant={activeChecklist === 'closing' ? 'default' : 'outline'}
          onClick={() => { setActiveChecklist('closing'); setCompleted({}); setNotes({}) }}
          className="flex-1 sm:flex-none"
        >
          <Moon className="mr-2 h-4 w-4" />
          Closing Checklist
        </Button>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">
                {completedCount} / {totalTasks} Tasks
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
              <p className="text-xs text-muted-foreground">
                {criticalComplete}/{criticalTasks.length} critical
              </p>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
              <Sparkles className="h-4 w-4" />
              All tasks completed!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {checklist.map((section) => {
          const SectionIcon = section.icon
          const sectionCompleted = section.tasks.filter(t => completed[t.id]).length
          const sectionTotal = section.tasks.length
          const isExpanded = expandedSections[section.title] !== false

          return (
            <Card key={section.title}>
              <CardHeader
                className="cursor-pointer pb-3"
                onClick={() => toggleSection(section.title)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SectionIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={sectionCompleted === sectionTotal ? 'success' : 'secondary'}
                    >
                      {sectionCompleted}/{sectionTotal}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0 space-y-2">
                  {section.tasks.map((task) => {
                    const isComplete = completed[task.id]
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'rounded-lg border p-4 transition-colors',
                          isComplete
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                            : task.priority === 'critical'
                              ? 'border-red-200 dark:border-red-800'
                              : ''
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isComplete}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4
                                className={cn(
                                  'text-sm font-medium',
                                  isComplete && 'line-through text-muted-foreground'
                                )}
                              >
                                {task.title}
                              </h4>
                              {task.priority === 'critical' && (
                                <Badge variant="destructive" className="text-[10px]">
                                  <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                  Critical
                                </Badge>
                              )}
                              {task.requiresPhoto && (
                                <Badge variant="outline" className="text-[10px]">
                                  <Camera className="h-2.5 w-2.5 mr-0.5" />
                                  Photo
                                </Badge>
                              )}
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {task.estimatedMinutes}m
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{task.description}</p>

                            {(task.requiresNote || task.requiresPhoto) && !isComplete && (
                              <div className="mt-2 space-y-2">
                                {task.requiresPhoto && (
                                  <Button variant="outline" size="sm" className="text-xs h-7">
                                    <Camera className="h-3 w-3 mr-1" />
                                    Take Photo
                                  </Button>
                                )}
                                {task.requiresNote && (
                                  <Input
                                    value={notes[task.id] || ''}
                                    onChange={e => setNotes(p => ({ ...p, [task.id]: e.target.value }))}
                                    placeholder="Add note..."
                                    className="h-8 text-xs"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Submit */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-2">
            <Input
              value={submitterName}
              onChange={e => setSubmitterName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={completedCount !== totalTasks || !submitterName}
          >
            <Send className="mr-2 h-5 w-5" />
            Submit {activeChecklist === 'opening' ? 'Opening' : 'Closing'} Checklist
          </Button>
          {completedCount !== totalTasks && (
            <p className="text-xs text-center text-muted-foreground">
              Complete all {totalTasks - completedCount} remaining tasks to submit
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const openingChecklist: ChecklistSection[] = [
  {
    title: 'Safety & Security',
    icon: Lock,
    tasks: [
      { id: 'o1', title: 'Unlock main entrance and side doors', description: 'Unlock all designated entry/exit points and verify door alarms reset', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
      { id: 'o2', title: 'Disarm security system', description: 'Enter code and verify all zones are cleared', estimatedMinutes: 2, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
      { id: 'o3', title: 'Emergency exits inspection', description: 'Verify all emergency exits are clear and illuminated', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
      { id: 'o4', title: 'Check AED and first aid stations', description: 'Verify AED is charged, first aid kits are stocked', estimatedMinutes: 5, requiresPhoto: true, requiresNote: true, category: 'safety', priority: 'critical' },
      { id: 'o5', title: 'Test fire alarm panel', description: 'Verify fire panel shows normal status, no faults', estimatedMinutes: 2, requiresPhoto: true, requiresNote: false, category: 'safety', priority: 'critical' },
    ],
  },
  {
    title: 'Pool/Aquatics',
    icon: CheckSquare,
    tasks: [
      { id: 'o6', title: 'Test water chemistry', description: 'Test chlorine (1-5ppm), pH (7.2-7.8), alkalinity, and temperature', estimatedMinutes: 10, requiresPhoto: true, requiresNote: true, category: 'pool', priority: 'critical' },
      { id: 'o7', title: 'Inspect pool deck', description: 'Check for hazards, ensure deck is clean and dry where needed', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'pool', priority: 'normal' },
      { id: 'o8', title: 'Set up lifeguard stations', description: 'Place rescue equipment, whistles, and communication devices', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'pool', priority: 'critical' },
      { id: 'o9', title: 'Check pool equipment', description: 'Verify pumps, filters, and chemical feeders are operational', estimatedMinutes: 5, requiresPhoto: false, requiresNote: true, category: 'pool', priority: 'normal' },
      { id: 'o10', title: 'Test hot tub/spa', description: 'Check temperature (100-104°F) and chemistry levels', estimatedMinutes: 5, requiresPhoto: true, requiresNote: true, category: 'pool', priority: 'normal' },
    ],
  },
  {
    title: 'Fitness Areas',
    icon: CheckSquare,
    tasks: [
      { id: 'o11', title: 'Inspect cardio equipment', description: 'Power on all machines, check for wear or damage', estimatedMinutes: 10, requiresPhoto: false, requiresNote: true, category: 'fitness', priority: 'normal' },
      { id: 'o12', title: 'Inspect strength equipment', description: 'Check cables, pins, and pads on all machines', estimatedMinutes: 10, requiresPhoto: false, requiresNote: true, category: 'fitness', priority: 'normal' },
      { id: 'o13', title: 'Free weight area check', description: 'Verify weights are racked properly, floor mats in place', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'fitness', priority: 'normal' },
      { id: 'o14', title: 'Stock cleaning supplies', description: 'Ensure spray bottles, wipes, and paper towels are available at all stations', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'fitness', priority: 'normal' },
    ],
  },
  {
    title: 'Common Areas',
    icon: CheckSquare,
    tasks: [
      { id: 'o15', title: 'Check locker rooms', description: 'Verify cleanliness, restock soap/towels/toilet paper, check showers', estimatedMinutes: 10, requiresPhoto: true, requiresNote: true, category: 'common', priority: 'normal' },
      { id: 'o16', title: 'Front desk setup', description: 'Boot up POS system, check supplies, review schedule', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'o17', title: 'Turn on HVAC systems', description: 'Verify temperature settings and air flow in all areas', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'o18', title: 'Turn on lighting', description: 'Activate all interior and exterior lighting', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'o19', title: 'Check parking lot and exterior', description: 'Walk parking lot, check for debris, verify signage', estimatedMinutes: 5, requiresPhoto: false, requiresNote: true, category: 'common', priority: 'normal' },
    ],
  },
]

const closingChecklist: ChecklistSection[] = [
  {
    title: 'Safety & Security',
    icon: Lock,
    tasks: [
      { id: 'c1', title: 'Walk-through all areas', description: 'Ensure all patrons have left the facility', estimatedMinutes: 10, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
      { id: 'c2', title: 'Check all restrooms/locker rooms', description: 'Verify all areas are empty, check for personal items left behind', estimatedMinutes: 5, requiresPhoto: false, requiresNote: true, category: 'safety', priority: 'critical' },
      { id: 'c3', title: 'Lock emergency exits', description: 'Secure all emergency exits from the inside', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
      { id: 'c4', title: 'Arm security system', description: 'Set alarm and verify all zones are active', estimatedMinutes: 2, requiresPhoto: false, requiresNote: false, category: 'safety', priority: 'critical' },
    ],
  },
  {
    title: 'Pool/Aquatics',
    icon: CheckSquare,
    tasks: [
      { id: 'c5', title: 'Final water chemistry test', description: 'Record closing chlorine, pH, and temperature readings', estimatedMinutes: 5, requiresPhoto: true, requiresNote: true, category: 'pool', priority: 'critical' },
      { id: 'c6', title: 'Secure pool area', description: 'Remove all rescue equipment, lock pool gate/barriers', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'pool', priority: 'critical' },
      { id: 'c7', title: 'Cover hot tub/spa', description: 'Place cover on hot tub, verify chemicals are balanced for overnight', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'pool', priority: 'normal' },
    ],
  },
  {
    title: 'Fitness Areas',
    icon: CheckSquare,
    tasks: [
      { id: 'c8', title: 'Power down equipment', description: 'Turn off TVs, cardio machines, and any non-essential equipment', estimatedMinutes: 5, requiresPhoto: false, requiresNote: false, category: 'fitness', priority: 'normal' },
      { id: 'c9', title: 'Clean and sanitize', description: 'Wipe down high-touch surfaces, vacuum/mop fitness floor', estimatedMinutes: 15, requiresPhoto: false, requiresNote: false, category: 'fitness', priority: 'normal' },
      { id: 'c10', title: 'Re-rack all weights', description: 'Ensure all dumbbells, plates, and barbells are properly stored', estimatedMinutes: 10, requiresPhoto: false, requiresNote: false, category: 'fitness', priority: 'normal' },
    ],
  },
  {
    title: 'Final Checks',
    icon: CheckSquare,
    tasks: [
      { id: 'c11', title: 'Empty trash receptacles', description: 'Empty all trash and recycling bins', estimatedMinutes: 10, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'c12', title: 'Adjust HVAC for overnight', description: 'Set thermostat to overnight/economy settings', estimatedMinutes: 2, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'c13', title: 'Turn off all lights', description: 'Switch off interior lighting, verify exterior lights on timer', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'normal' },
      { id: 'c14', title: 'Lock all doors', description: 'Lock main entrance and all remaining doors', estimatedMinutes: 3, requiresPhoto: false, requiresNote: false, category: 'common', priority: 'critical' },
      { id: 'c15', title: 'Submit closing shift report', description: 'Complete and submit the closing shift report with all notes', estimatedMinutes: 5, requiresPhoto: false, requiresNote: true, category: 'common', priority: 'normal' },
    ],
  },
]
