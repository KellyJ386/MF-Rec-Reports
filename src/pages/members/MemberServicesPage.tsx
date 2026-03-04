import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users, Search, Star, MessageSquare, Plus,
  ThumbsUp, ThumbsDown, TrendingUp, Send, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feedback {
  id: string
  type: 'compliment' | 'complaint' | 'suggestion' | 'question'
  subject: string
  message: string
  memberName: string
  date: string
  status: 'new' | 'in_review' | 'resolved' | 'closed'
  rating?: number
  area: string
  response?: string
}

const typeConfig = {
  compliment: { label: 'Compliment', variant: 'success' as const, icon: ThumbsUp },
  complaint: { label: 'Complaint', variant: 'destructive' as const, icon: ThumbsDown },
  suggestion: { label: 'Suggestion', variant: 'warning' as const, icon: MessageSquare },
  question: { label: 'Question', variant: 'secondary' as const, icon: MessageSquare },
}

export function MemberServicesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = mockFeedback.filter(f => {
    const matchSearch = !search ||
      f.subject.toLowerCase().includes(search.toLowerCase()) ||
      f.memberName.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || f.type === typeFilter
    return matchSearch && matchType
  })

  const avgRating = mockFeedback.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / mockFeedback.filter(f => f.rating).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Services & Feedback"
        subtitle="Track member feedback, complaints, and satisfaction"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Feedback
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><MessageSquare className="h-4 w-4 text-primary" /></div><div><p className="text-2xl font-bold">{mockFeedback.length}</p><p className="text-xs text-muted-foreground">Total Feedback</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-yellow-500/10 p-2"><Star className="h-4 w-4 text-yellow-600" /></div><div><p className="text-2xl font-bold">{avgRating.toFixed(1)}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-green-500/10 p-2"><ThumbsUp className="h-4 w-4 text-green-600" /></div><div><p className="text-2xl font-bold">{mockFeedback.filter(f => f.type === 'compliment').length}</p><p className="text-xs text-muted-foreground">Compliments</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-red-500/10 p-2"><ThumbsDown className="h-4 w-4 text-red-600" /></div><div><p className="text-2xl font-bold">{mockFeedback.filter(f => f.type === 'complaint').length}</p><p className="text-xs text-muted-foreground">Complaints</p></div></div></CardContent></Card>
      </div>

      {/* New Feedback Form */}
      {showForm && (
        <Card className="border-primary">
          <CardHeader><CardTitle className="text-base">Log Member Feedback</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Member name" />
              <Select><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliment">Compliment</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Subject" />
              <Select><SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pool">Pool/Aquatics</SelectItem>
                  <SelectItem value="fitness">Fitness Floor</SelectItem>
                  <SelectItem value="courts">Courts/Gym</SelectItem>
                  <SelectItem value="locker">Locker Rooms</SelectItem>
                  <SelectItem value="front_desk">Front Desk</SelectItem>
                  <SelectItem value="programs">Programs</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Feedback details..." rows={3} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" className="p-0.5">
                  <Star className="h-5 w-5 text-muted-foreground hover:text-yellow-400" />
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setShowForm(false)}><Send className="mr-1.5 h-3.5 w-3.5" />Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback..." className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="compliment">Compliments</SelectItem>
                <SelectItem value="complaint">Complaints</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
                <SelectItem value="question">Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-3">
        {filtered.map(fb => {
          const config = typeConfig[fb.type]
          const TypeIcon = config.icon
          return (
            <Card key={fb.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <TypeIcon className={cn('h-4 w-4',
                        fb.type === 'compliment' ? 'text-green-600' :
                        fb.type === 'complaint' ? 'text-red-600' : 'text-primary'
                      )} />
                      <h3 className="font-semibold text-sm">{fb.subject}</h3>
                      <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                      <Badge variant={
                        fb.status === 'resolved' ? 'success' :
                        fb.status === 'new' ? 'warning' : 'secondary'
                      } className="text-[10px]">
                        {fb.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{fb.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{fb.memberName}</span>
                      <span>{fb.area}</span>
                      <span>{fb.date}</span>
                      {fb.rating && (
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < fb.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
                          ))}
                        </span>
                      )}
                    </div>
                    {fb.response && (
                      <div className="mt-2 pl-3 border-l-2 border-primary/30">
                        <p className="text-xs"><span className="font-medium">Response:</span> {fb.response}</p>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const mockFeedback: Feedback[] = [
  { id: '1', type: 'compliment', subject: 'Great lifeguard team!', message: 'The lifeguards were very attentive and professional today. My kids felt safe.', memberName: 'Jane Doe', date: 'Mar 3, 2026', status: 'resolved', rating: 5, area: 'Pool/Aquatics', response: 'Thank you for the kind words! We will pass along to our aquatics team.' },
  { id: '2', type: 'complaint', subject: 'Locker room cleanliness', message: 'The men\'s locker room showers were not cleaned properly. Found hair and soap residue.', memberName: 'Bob Smith', date: 'Mar 2, 2026', status: 'in_review', rating: 2, area: 'Locker Rooms' },
  { id: '3', type: 'suggestion', subject: 'Extended pool hours', message: 'Would it be possible to extend lap swim hours on weekends? Current hours end too early for those of us who work Saturday mornings.', memberName: 'Sarah Lee', date: 'Mar 1, 2026', status: 'new', rating: 4, area: 'Pool/Aquatics' },
  { id: '4', type: 'complaint', subject: 'Broken equipment not fixed', message: 'Treadmill #15 has been broken for over two weeks. When will it be repaired?', memberName: 'Tom Wilson', date: 'Feb 28, 2026', status: 'resolved', rating: 2, area: 'Fitness Floor', response: 'We apologize for the delay. The replacement belt has been ordered and should be installed within 3 business days.' },
  { id: '5', type: 'compliment', subject: 'Excellent group fitness classes', message: 'The new yoga instructor is amazing! Best class I\'ve attended here.', memberName: 'Maria Garcia', date: 'Feb 27, 2026', status: 'resolved', rating: 5, area: 'Programs' },
  { id: '6', type: 'question', subject: 'Guest pass policy', message: 'How many guest passes can members use per month? Is there a limit?', memberName: 'Chris Park', date: 'Feb 26, 2026', status: 'resolved', area: 'Front Desk', response: 'Members receive 4 guest passes per month. Additional passes are $5 each.' },
]
