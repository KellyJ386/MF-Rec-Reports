import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Layouts
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { NewReportPage } from '@/pages/reports/NewReportPage'
import { IncidentsPage } from '@/pages/incidents/IncidentsPage'
import { NewIncidentPage } from '@/pages/incidents/NewIncidentPage'
import { ChecklistsPage } from '@/pages/checklists/ChecklistsPage'
import { FormBuilderPage } from '@/pages/admin/FormBuilderPage'
import { EquipmentPage } from '@/pages/equipment/EquipmentPage'
import { MaintenancePage } from '@/pages/maintenance/MaintenancePage'
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* App Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Reports */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/new" element={<NewReportPage />} />

            {/* Incidents */}
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents/new" element={<NewIncidentPage />} />

            {/* Checklists */}
            <Route path="/checklists" element={<ChecklistsPage />} />

            {/* Equipment */}
            <Route path="/equipment" element={<EquipmentPage />} />

            {/* Maintenance */}
            <Route path="/maintenance" element={<MaintenancePage />} />

            {/* Analytics */}
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Admin */}
            <Route path="/admin/forms" element={<FormBuilderPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
