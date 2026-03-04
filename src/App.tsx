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
import { ChemistryPage } from '@/pages/chemistry/ChemistryPage'
import { EquipmentPage } from '@/pages/equipment/EquipmentPage'
import { MaintenancePage } from '@/pages/maintenance/MaintenancePage'
import { StaffPage } from '@/pages/staff/StaffPage'
import { PatronCountPage } from '@/pages/patrons/PatronCountPage'
import { EmergencyPage } from '@/pages/emergency/EmergencyPage'
import { FitnessPage } from '@/pages/fitness/FitnessPage'
import { CourtsPage } from '@/pages/courts/CourtsPage'
import { LockerRoomPage } from '@/pages/lockerrooms/LockerRoomPage'
import { MemberServicesPage } from '@/pages/members/MemberServicesPage'
import { FormBuilderPage } from '@/pages/admin/FormBuilderPage'
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
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

            {/* Pool Chemistry */}
            <Route path="/chemistry" element={<ChemistryPage />} />

            {/* Equipment */}
            <Route path="/equipment" element={<EquipmentPage />} />

            {/* Maintenance */}
            <Route path="/maintenance" element={<MaintenancePage />} />

            {/* Staff */}
            <Route path="/staff" element={<StaffPage />} />

            {/* Patron Count */}
            <Route path="/patrons" element={<PatronCountPage />} />

            {/* Emergency */}
            <Route path="/emergency" element={<EmergencyPage />} />

            {/* Fitness */}
            <Route path="/fitness" element={<FitnessPage />} />

            {/* Courts */}
            <Route path="/courts" element={<CourtsPage />} />

            {/* Locker Rooms */}
            <Route path="/locker-rooms" element={<LockerRoomPage />} />

            {/* Member Services */}
            <Route path="/members" element={<MemberServicesPage />} />

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
