import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export function FormBuilderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Builder"
        subtitle="Create and customize digital forms for your facility"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Button>
        }
      />

      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Settings}
            title="Form Builder Coming Soon"
            description="The drag-and-drop form builder will allow you to create custom forms for daily reports, inspections, and checklists tailored to your facility's needs."
            action={{
              label: 'Learn More',
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
