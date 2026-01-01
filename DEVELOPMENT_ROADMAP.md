# Rec Reports - Development Roadmap (Lovable Stack)
## Multi-Tenant SaaS Platform for Recreation Organizations

**Target Scale:** Up to 500 users per organization, unlimited organizations
**Architecture:** Multi-tenant, enterprise-grade SaaS built with Lovable
**Timeline:** 12-month phased rollout

---

## Tech Stack (Lovable-Optimized)

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL database (with Row Level Security)
  - Supabase Auth (JWT-based authentication)
  - Supabase Storage (file uploads)
  - Supabase Edge Functions (serverless functions)
  - Supabase Realtime (WebSocket subscriptions)

### Data & State Management
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Routing & Navigation
- **React Router v6** - Client-side routing
- **TanStack Router** (optional upgrade)

### Mobile & PWA
- **Vite PWA Plugin** - Progressive Web App capabilities
- **Workbox** - Service worker and offline support
- **IndexedDB** - Local storage via Dexie.js

### UI/UX Libraries
- **React DnD** - Drag and drop for form builder
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **React PDF** - PDF generation
- **Uppy** - File uploads with progress

### Development Tools
- **ESLint + Prettier** - Code quality
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **TypeScript** - Static typing
- **Biome** (optional) - Fast linter/formatter

### Deployment & Infrastructure
- **Vercel/Netlify** - Frontend hosting (Lovable default)
- **Supabase Cloud** - Backend infrastructure
- **Cloudflare** - CDN and edge caching
- **GitHub Actions** - CI/CD

### Monitoring & Analytics
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **Supabase Analytics** - Database insights

---

## Phase 0: Foundation & Infrastructure (Weeks 1-4)
**Goal:** Establish rock-solid foundation for multi-tenant SaaS platform

### 0.1 Project Setup & Architecture
- [ ] Initialize Lovable project
  ```bash
  # Lovable creates this automatically
  - React + TypeScript + Vite
  - TailwindCSS + shadcn/ui preconfigured
  - React Router setup
  ```
- [ ] Configure project structure
  ```
  src/
  ├── components/        # Reusable UI components
  │   ├── ui/           # shadcn/ui components
  │   ├── forms/        # Form components
  │   └── layout/       # Layout components
  ├── features/         # Feature-based modules
  │   ├── auth/
  │   ├── reports/
  │   ├── incidents/
  │   └── equipment/
  ├── hooks/            # Custom React hooks
  ├── lib/              # Utilities and config
  │   ├── supabase.ts
  │   ├── api.ts
  │   └── utils.ts
  ├── types/            # TypeScript types
  ├── stores/           # Zustand stores
  └── pages/            # Route pages
  ```
- [ ] Set up code quality tools
  - ESLint configuration
  - Prettier configuration
  - Pre-commit hooks (Husky + lint-staged)
  - TypeScript strict mode

### 0.2 Supabase Configuration
- [ ] Create Supabase project (Production, Staging, Development)
- [ ] Design multi-tenant database schema
  ```sql
  -- Core multi-tenant structure
  CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    facility_type TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'facility_admin', 'manager', 'supervisor', 'staff', 'read_only')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] Implement Row Level Security (RLS)
  ```sql
  -- Enable RLS on all tables
  ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Policy: Users can only see their own organization's data
  CREATE POLICY "Users can view own organization"
    ON organizations FOR SELECT
    USING (
      id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid()
      )
    );

  CREATE POLICY "Users can view facilities in their organization"
    ON facilities FOR SELECT
    USING (
      organization_id IN (
        SELECT organization_id FROM profiles
        WHERE id = auth.uid()
      )
    );
  ```

- [ ] Create database functions for common operations
  ```sql
  -- Function to get user's organization
  CREATE OR REPLACE FUNCTION get_user_organization_id()
  RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  $$ LANGUAGE sql SECURITY DEFINER;

  -- Function to check if user has permission
  CREATE OR REPLACE FUNCTION has_permission(required_role TEXT)
  RETURNS BOOLEAN AS $$
    SELECT role IN ('super_admin', required_role)
    FROM profiles
    WHERE id = auth.uid()
  $$ LANGUAGE sql SECURITY DEFINER;
  ```

- [ ] Set up Supabase Storage buckets
  ```typescript
  // Bucket structure
  organizations/{org_id}/
  ├── photos/
  │   ├── incidents/
  │   ├── reports/
  │   └── equipment/
  ├── videos/
  ├── documents/
  └── exports/
  ```

- [ ] Configure Storage policies
  ```sql
  -- Policy: Users can upload to their organization's bucket
  CREATE POLICY "Users can upload files"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'organizations' AND
      (storage.foldername(name))[1] = (
        SELECT organization_id::text FROM profiles WHERE id = auth.uid()
      )
    );
  ```

### 0.3 Authentication & Authorization
- [ ] Set up Supabase Auth configuration
  - Email/password authentication
  - Email verification
  - Password reset flow
  - Session management (12-hour timeout)

- [ ] Create authentication context
  ```typescript
  // src/lib/auth-context.tsx
  interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    organization: Organization | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
  }
  ```

- [ ] Implement role-based access control
  ```typescript
  // src/lib/permissions.ts
  const PERMISSIONS = {
    super_admin: ['*'],
    facility_admin: ['manage_facility', 'manage_users', 'view_reports'],
    manager: ['view_reports', 'approve_tasks', 'manage_incidents'],
    supervisor: ['create_reports', 'assign_tasks', 'report_incidents'],
    staff: ['complete_tasks', 'view_assigned'],
    read_only: ['view_reports']
  };
  ```

- [ ] Create protected route component
  ```typescript
  // src/components/ProtectedRoute.tsx
  const ProtectedRoute = ({
    children,
    requiredPermission
  }: ProtectedRouteProps) => {
    const { user, hasPermission, loading } = useAuth();

    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" />;
    if (!hasPermission(requiredPermission)) return <Unauthorized />;

    return children;
  };
  ```

- [ ] Implement MFA (Time-based One-Time Password)
  - TOTP setup flow
  - Backup codes generation
  - MFA enforcement per organization

### 0.4 Core UI Components
- [ ] Set up shadcn/ui components
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add form
  npx shadcn-ui@latest add input
  npx shadcn-ui@latest add select
  npx shadcn-ui@latest add dialog
  npx shadcn-ui@latest add dropdown-menu
  npx shadcn-ui@latest add table
  npx shadcn-ui@latest add tabs
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add badge
  npx shadcn-ui@latest add toast
  npx shadcn-ui@latest add calendar
  npx shadcn-ui@latest add checkbox
  npx shadcn-ui@latest add radio-group
  ```

- [ ] Create custom components
  - `PageHeader` - Consistent page headers
  - `DataTable` - Advanced table with sorting/filtering
  - `FileUpload` - Multi-file upload with progress
  - `EmptyState` - Placeholder for empty data
  - `ErrorBoundary` - Error handling wrapper
  - `Loader` - Loading states
  - `ConfirmDialog` - Confirmation modals

- [ ] Build layout system
  - `AppLayout` - Main app shell
  - `AuthLayout` - Login/signup pages
  - `DashboardLayout` - Dashboard container
  - `MobileNavigation` - Bottom navigation for mobile
  - `Sidebar` - Desktop navigation

### 0.5 Data Layer Setup
- [ ] Configure React Query
  ```typescript
  // src/lib/query-client.ts
  import { QueryClient } from '@tanstack/react-query';

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  ```

- [ ] Create Supabase client wrapper
  ```typescript
  // src/lib/supabase.ts
  import { createClient } from '@supabase/supabase-js';
  import type { Database } from '@/types/supabase';

  export const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  ```

- [ ] Build API layer with React Query
  ```typescript
  // src/lib/api/organizations.ts
  export const useOrganization = (id: string) => {
    return useQuery({
      queryKey: ['organization', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
    });
  };

  export const useUpdateOrganization = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ id, updates }: UpdateOrgParams) => {
        const { data, error } = await supabase
          .from('organizations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['organization', data.id]);
      },
    });
  };
  ```

- [ ] Set up Zustand for client state
  ```typescript
  // src/stores/app-store.ts
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  interface AppState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
  }

  export const useAppStore = create<AppState>()(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: 'light',
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'app-storage',
      }
    )
  );
  ```

### 0.6 Offline & PWA Setup
- [ ] Install and configure Vite PWA plugin
  ```typescript
  // vite.config.ts
  import { VitePWA } from 'vite-plugin-pwa';

  export default defineConfig({
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Rec Reports',
          short_name: 'RecReports',
          description: 'Recreation Facility Operations Management',
          theme_color: '#3b82f6',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                }
              }
            }
          ]
        }
      })
    ]
  });
  ```

- [ ] Set up IndexedDB for offline storage
  ```typescript
  // src/lib/offline-db.ts
  import Dexie, { Table } from 'dexie';

  interface PendingSync {
    id?: number;
    table: string;
    operation: 'insert' | 'update' | 'delete';
    data: any;
    timestamp: Date;
    synced: boolean;
  }

  class OfflineDB extends Dexie {
    pendingSync!: Table<PendingSync>;

    constructor() {
      super('RecReportsOffline');
      this.version(1).stores({
        pendingSync: '++id, table, synced, timestamp'
      });
    }
  }

  export const offlineDB = new OfflineDB();
  ```

- [ ] Create offline sync manager
  ```typescript
  // src/lib/sync-manager.ts
  export class SyncManager {
    private syncQueue: PendingSync[] = [];

    async queueOperation(operation: PendingSync) {
      await offlineDB.pendingSync.add({
        ...operation,
        timestamp: new Date(),
        synced: false
      });
    }

    async syncPending() {
      const pending = await offlineDB.pendingSync
        .where('synced')
        .equals(false)
        .toArray();

      for (const item of pending) {
        try {
          await this.syncOperation(item);
          await offlineDB.pendingSync.update(item.id!, { synced: true });
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
    }

    private async syncOperation(item: PendingSync) {
      // Sync logic based on operation type
    }
  }
  ```

### 0.7 Testing Infrastructure
- [ ] Set up Vitest for unit tests
  ```typescript
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        threshold: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80
        }
      }
    }
  });
  ```

- [ ] Set up Playwright for E2E tests
  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    use: {
      baseURL: 'http://localhost:5173',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 13'] },
      },
    ],
  });
  ```

- [ ] Create test utilities
  ```typescript
  // src/test/utils.tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { render } from '@testing-library/react';

  export const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };
  ```

### 0.8 DevOps & Deployment
- [ ] Configure environment variables
  ```bash
  # .env.example
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  VITE_APP_URL=http://localhost:5173
  ```

- [ ] Set up GitHub Actions CI/CD
  ```yaml
  # .github/workflows/ci.yml
  name: CI/CD
  on: [push, pull_request]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: 18
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check
        - run: npm run test:coverage
        - run: npm run build
  ```

- [ ] Configure Vercel/Netlify deployment
  - Connect GitHub repository
  - Set environment variables
  - Configure build settings
  - Set up preview deployments

- [ ] Set up monitoring
  - Sentry error tracking
  - PostHog analytics
  - Vercel/Netlify analytics

**Phase 0 Deliverables:**
- ✅ Fully configured React + TypeScript app
- ✅ Multi-tenant Supabase database with RLS
- ✅ Secure authentication system
- ✅ Offline-capable PWA foundation
- ✅ CI/CD pipeline operational
- ✅ Testing infrastructure in place

**Success Metrics:**
- All tests passing (>80% coverage)
- Lighthouse score: >90 (Performance, Accessibility, Best Practices, SEO)
- Bundle size: <500KB (initial load)
- Time to Interactive: <3s

---

## Phase 1: MVP - Core Operations Platform (Weeks 5-16)
**Goal:** Launch minimal viable product with 3 core modules to 5 beta customers

### 1.1 Admin Form Builder ("The Brain")
**Critical for configurability across diverse facilities**

#### Form Schema System
- [ ] Create form schema types
  ```typescript
  // src/types/forms.ts
  interface FormField {
    id: string;
    type: 'text' | 'number' | 'email' | 'date' | 'time' | 'checkbox' |
          'select' | 'radio' | 'textarea' | 'file' | 'photo' | 'signature' |
          'body-diagram' | 'facility-map' | 'temperature' | 'chemistry';
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: Zod.Schema;
    options?: SelectOption[];
    conditionalDisplay?: ConditionalRule;
    helpText?: string;
    defaultValue?: any;
  }

  interface FormSchema {
    id: string;
    name: string;
    description: string;
    module_type: 'daily_report' | 'incident' | 'checklist' | 'equipment';
    sections: FormSection[];
    settings: FormSettings;
  }

  interface FormSection {
    id: string;
    title: string;
    fields: FormField[];
    order: number;
  }
  ```

- [ ] Build form schema database table
  ```sql
  CREATE TABLE form_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    module_type TEXT NOT NULL,
    schema JSONB NOT NULL,
    settings JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE form_schemas ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can view forms in their organization"
    ON form_schemas FOR SELECT
    USING (organization_id = get_user_organization_id());
  ```

#### Form Builder UI
- [ ] Create drag-and-drop form builder
  ```typescript
  // src/features/forms/FormBuilder.tsx
  import { DndContext, DragOverlay } from '@dnd-kit/core';
  import { SortableContext } from '@dnd-kit/sortable';

  const FormBuilder = () => {
    const [fields, setFields] = useState<FormField[]>([]);
    const [activeField, setActiveField] = useState<FormField | null>(null);

    return (
      <div className="grid grid-cols-12 gap-4">
        {/* Field Palette */}
        <div className="col-span-3">
          <FieldPalette />
        </div>

        {/* Canvas */}
        <div className="col-span-6">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={fields}>
              {fields.map(field => (
                <SortableField key={field.id} field={field} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Properties Panel */}
        <div className="col-span-3">
          <FieldProperties field={activeField} />
        </div>
      </div>
    );
  };
  ```

- [ ] Build field palette component
  ```typescript
  const FIELD_TYPES = [
    { type: 'text', icon: Type, label: 'Text Input' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'photo', icon: Camera, label: 'Photo Upload' },
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    // ... more field types
  ];
  ```

- [ ] Create field property editor
  - Label and placeholder editing
  - Validation rules (required, min/max, regex)
  - Conditional display logic builder
  - Help text with rich formatting
  - Default value setting

- [ ] Build form preview component
  - Real-time preview as you build
  - Mobile/desktop view toggle
  - Test data population
  - Validation testing

#### Form Rendering Engine
- [ ] Create dynamic form renderer
  ```typescript
  // src/components/DynamicForm.tsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';

  const DynamicForm = ({ schema }: { schema: FormSchema }) => {
    const formSchema = useMemo(() => generateZodSchema(schema), [schema]);

    const form = useForm({
      resolver: zodResolver(formSchema),
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {schema.sections.map(section => (
            <FormSection key={section.id} section={section} />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  };
  ```

- [ ] Implement field renderers for each type
  ```typescript
  // src/components/form-fields/
  - TextFieldRenderer.tsx
  - NumberFieldRenderer.tsx
  - DateFieldRenderer.tsx
  - PhotoFieldRenderer.tsx
  - SignatureFieldRenderer.tsx
  - BodyDiagramRenderer.tsx
  - FacilityMapRenderer.tsx
  // ... etc
  ```

- [ ] Build conditional logic engine
  ```typescript
  const evaluateCondition = (
    condition: ConditionalRule,
    formValues: FormValues
  ): boolean => {
    // Evaluate show/hide conditions based on other field values
    // Support AND/OR logic, comparisons, etc.
  };
  ```

#### Form Templates
- [ ] Create template library
  - 50+ pre-built templates by facility type
  - University rec center templates
  - YMCA templates
  - Municipal facility templates
  - Aquatics facility templates

- [ ] Build template management
  - Template import/export (JSON)
  - Template duplication
  - Template versioning
  - Share templates across facilities

### 1.2 Module: Daily Operations Reports

#### Database Schema
```sql
CREATE TABLE shift_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  form_schema_id UUID REFERENCES form_schemas(id),
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('opening', 'am', 'pm', 'evening', 'closing')),
  submitted_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'archived')),
  data JSONB NOT NULL DEFAULT '{}',
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  staff_on_duty UUID[] DEFAULT ARRAY[]::UUID[],
  patron_counts JSONB,
  weather JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_shift_reports_facility_date ON shift_reports(facility_id, shift_date DESC);
CREATE INDEX idx_shift_reports_status ON shift_reports(status);

-- Enable RLS
ALTER TABLE shift_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports in their organization"
  ON shift_reports FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create reports"
  ON shift_reports FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id());
```

#### Report Creation Interface
- [ ] Build shift report form page
  ```typescript
  // src/pages/ShiftReportPage.tsx
  const ShiftReportPage = () => {
    const { formSchema } = useFormSchema('daily_report');
    const { mutate: saveReport } = useSaveReport();

    // Auto-save every 30 seconds
    useAutoSave(formData, saveReport, 30000);

    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title="Daily Shift Report"
          subtitle={`${shiftType} - ${format(shiftDate, 'MMMM d, yyyy')}`}
        />
        <DynamicForm
          schema={formSchema}
          onSubmit={handleSubmit}
          autoSave={true}
        />
      </div>
    );
  };
  ```

- [ ] Implement auto-save functionality
  ```typescript
  const useAutoSave = (data: any, saveFn: Function, interval: number) => {
    const [lastSaved, setLastSaved] = useState<Date>(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        saveFn(data);
        setLastSaved(new Date());
      }, interval);

      return () => clearInterval(timer);
    }, [data]);

    return { lastSaved };
  };
  ```

- [ ] Create photo upload component
  ```typescript
  // src/components/PhotoUpload.tsx
  import { useUploadThing } from '@/lib/upload';

  const PhotoUpload = () => {
    const { upload, progress } = useUploadThing();

    const handleUpload = async (files: File[]) => {
      const compressed = await Promise.all(
        files.map(file => compressImage(file, 500)) // 500KB max
      );

      const urls = await upload(compressed);
      return urls;
    };

    return (
      <Uppy
        onUpload={handleUpload}
        maxFiles={10}
        allowedTypes={['image/*']}
      />
    );
  };
  ```

- [ ] Build patron count tracking
  ```typescript
  interface PatronCount {
    area: string;
    timeBlock: string;
    count: number;
  }

  const PatronCountTable = () => {
    const [counts, setCounts] = useState<PatronCount[]>([]);

    return (
      <div className="grid grid-cols-3 gap-4">
        {areas.map(area => (
          <Card key={area}>
            <CardHeader>{area}</CardHeader>
            <CardContent>
              <Input
                type="number"
                value={counts.find(c => c.area === area)?.count}
                onChange={(e) => updateCount(area, e.target.value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  ```

#### Shift Handoff System
- [ ] Create handoff notes component
  ```typescript
  const ShiftHandoff = () => {
    const { data: outstandingIssues } = useOutstandingIssues();
    const { data: priorityTasks } = usePriorityTasks();

    return (
      <Card>
        <CardHeader>Shift Handoff</CardHeader>
        <CardContent>
          <Tabs>
            <TabsList>
              <TabsTrigger>Outstanding Issues</TabsTrigger>
              <TabsTrigger>Priority Tasks</TabsTrigger>
              <TabsTrigger>Notes</TabsTrigger>
            </TabsList>
            <TabsContent>
              {/* Content for each tab */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };
  ```

#### Report Export & Distribution
- [ ] Implement PDF generation
  ```typescript
  // src/lib/pdf-generator.ts
  import { jsPDF } from 'jspdf';
  import html2canvas from 'html2canvas';

  export const generateReportPDF = async (reportId: string) => {
    const element = document.getElementById(`report-${reportId}`);
    const canvas = await html2canvas(element!);

    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

    return pdf.output('blob');
  };
  ```

- [ ] Build email delivery system (Supabase Edge Function)
  ```typescript
  // supabase/functions/send-eod-report/index.ts
  import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

  serve(async (req) => {
    const { reportId } = await req.json();

    // Fetch report data
    // Generate PDF
    // Send email via Resend or SendGrid

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  ```

### 1.3 Module: Incident & Accident Reporting

#### Database Schema
```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES profiles(id),
  incident_number TEXT UNIQUE NOT NULL, -- Auto-generated
  incident_type TEXT NOT NULL CHECK (incident_type IN
    ('injury', 'illness', 'property_damage', 'behavioral', 'near_miss')),
  severity TEXT NOT NULL CHECK (severity IN
    ('minor', 'moderate', 'severe', 'critical')),
  occurred_at TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  location_diagram JSONB, -- Coordinates on facility map
  body_diagram JSONB, -- Injury locations on body diagram
  description TEXT NOT NULL,
  witnesses JSONB DEFAULT '[]',
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  ems_called BOOLEAN DEFAULT false,
  ems_arrived_at TIMESTAMPTZ,
  staff_response TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  osha_reportable BOOLEAN DEFAULT false,
  insurance_claim_number TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate incident number
CREATE OR REPLACE FUNCTION generate_incident_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.incident_number := 'INC-' ||
    to_char(NEW.occurred_at, 'YYYYMMDD') || '-' ||
    LPAD(nextval('incident_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE incident_number_seq;
CREATE TRIGGER set_incident_number
  BEFORE INSERT ON incidents
  FOR EACH ROW EXECUTE FUNCTION generate_incident_number();
```

#### Interactive Diagrams
- [ ] Build body diagram component
  ```typescript
  // src/components/BodyDiagram.tsx
  import { useState } from 'react';

  const BodyDiagram = ({ value, onChange }: BodyDiagramProps) => {
    const [marks, setMarks] = useState<Mark[]>(value || []);
    const [view, setView] = useState<'front' | 'back'>('front');

    const handleClick = (e: React.MouseEvent<SVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newMark = { x, y, view, type: 'injury' };
      const updated = [...marks, newMark];
      setMarks(updated);
      onChange(updated);
    };

    return (
      <div className="space-y-4">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
          </TabsList>
        </Tabs>

        <svg
          viewBox="0 0 200 500"
          className="w-full max-w-md border cursor-crosshair"
          onClick={handleClick}
        >
          {/* Body SVG paths */}
          <BodySVG view={view} />

          {/* Injury marks */}
          {marks
            .filter(m => m.view === view)
            .map((mark, i) => (
              <circle
                key={i}
                cx={mark.x}
                cy={mark.y}
                r="5"
                fill="red"
                className="cursor-pointer"
                onClick={() => removeMark(i)}
              />
            ))}
        </svg>
      </div>
    );
  };
  ```

- [ ] Build facility map diagram
  ```typescript
  // Similar to body diagram but with custom facility floor plan SVG
  const FacilityMap = ({ facilityId, value, onChange }) => {
    const { data: floorPlan } = useFloorPlan(facilityId);

    // Same marking logic as body diagram
    // Allow uploading custom floor plan SVG
  };
  ```

#### Incident Form
- [ ] Create incident report form
  ```typescript
  const IncidentReportForm = () => {
    const form = useForm<IncidentFormData>({
      resolver: zodResolver(incidentSchema),
    });

    return (
      <Form {...form}>
        <FormField name="incident_type" />
        <FormField name="severity" />
        <FormField name="occurred_at" />
        <FormField name="location" />

        <FormField
          name="location_diagram"
          render={({ field }) => (
            <FacilityMap {...field} />
          )}
        />

        <FormField
          name="body_diagram"
          render={({ field }) => (
            <BodyDiagram {...field} />
          )}
        />

        <FormField name="description" />
        <WitnessesFieldArray />
        <PhotoUpload />
        <VideoUpload maxSize={50 * 1024 * 1024} /> {/* 50MB */}
      </Form>
    );
  };
  ```

#### Notification System
- [ ] Build notification engine (Supabase Edge Function)
  ```typescript
  // supabase/functions/incident-notifications/index.ts

  const notifyIncident = async (incident: Incident) => {
    const { severity, facility_id } = incident;

    // Get notification rules for this facility
    const rules = await getNotificationRules(facility_id);

    // Severity-based routing
    if (severity === 'critical') {
      await sendSMS(rules.emergency_contacts);
      await sendEmail(rules.emergency_contacts);
      await sendSlack(rules.slack_webhook);
    } else if (severity === 'severe') {
      await sendEmail(rules.manager_emails);
    }

    // Always notify risk management
    await sendEmail(rules.risk_management_email);
  };
  ```

- [ ] Create real-time notifications
  ```typescript
  // src/hooks/useIncidentNotifications.ts
  import { useEffect } from 'react';
  import { supabase } from '@/lib/supabase';
  import { toast } from 'sonner';

  export const useIncidentNotifications = () => {
    useEffect(() => {
      const channel = supabase
        .channel('incidents')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'incidents',
          },
          (payload) => {
            const incident = payload.new;

            if (incident.severity === 'critical') {
              toast.error(`Critical Incident: ${incident.incident_number}`, {
                description: incident.description,
                action: {
                  label: 'View',
                  onClick: () => navigate(`/incidents/${incident.id}`),
                },
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);
  };
  ```

#### OSHA Integration
- [ ] Create OSHA 300 log export
  ```typescript
  const generateOSHA300Log = async (facilityId: string, year: number) => {
    const incidents = await supabase
      .from('incidents')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('osha_reportable', true)
      .gte('occurred_at', `${year}-01-01`)
      .lte('occurred_at', `${year}-12-31`);

    // Format as OSHA 300 CSV
    return formatOSHA300CSV(incidents.data);
  };
  ```

### 1.4 Module: Opening & Closing Checklists

#### Database Schema
```sql
CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('opening', 'closing', 'hourly', 'daily')),
  tasks JSONB NOT NULL, -- Array of tasks with dependencies
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  completed_by UUID REFERENCES profiles(id),
  tasks_completed JSONB NOT NULL, -- Task completion status with timestamps
  photos JSONB, -- Photos per task
  deviations TEXT,
  signature TEXT, -- Data URL of signature
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Checklist Builder
- [ ] Create task dependency system
  ```typescript
  interface ChecklistTask {
    id: string;
    title: string;
    description: string;
    requiresPhoto: boolean;
    estimatedMinutes: number;
    dependencies: string[]; // IDs of tasks that must be completed first
    videoUrl?: string; // Training video
    photoExampleUrl?: string;
  }

  const TaskDependencyGraph = ({ tasks, onChange }) => {
    // Visual graph showing task dependencies
    // Prevent circular dependencies
    // Validate completion order
  };
  ```

- [ ] Build checklist management UI
  ```typescript
  const ChecklistBuilder = () => {
    const [tasks, setTasks] = useState<ChecklistTask[]>([]);

    const addTask = () => {
      setTasks([...tasks, createEmptyTask()]);
    };

    return (
      <div>
        <DndContext onDragEnd={handleReorder}>
          <SortableContext items={tasks}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button onClick={addTask}>Add Task</Button>
      </div>
    );
  };
  ```

#### Checklist Completion Interface
- [ ] Create mobile-optimized checklist UI
  ```typescript
  const ChecklistCompletion = ({ checklistId }: Props) => {
    const { data: checklist } = useChecklist(checklistId);
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [photos, setPhotos] = useState<Record<string, string[]>>({});

    const canCompleteTask = (taskId: string) => {
      const task = checklist.tasks.find(t => t.id === taskId);
      return task?.dependencies.every(dep => completed[dep]) ?? false;
    };

    const completeTask = async (taskId: string) => {
      const task = checklist.tasks.find(t => t.id === taskId);

      // Validate photo if required
      if (task.requiresPhoto && !photos[taskId]?.length) {
        toast.error('Photo required for this task');
        return;
      }

      setCompleted({ ...completed, [taskId]: true });
    };

    return (
      <div className="space-y-4 pb-20">
        {checklist.tasks.map(task => (
          <Card
            key={task.id}
            className={cn(
              !canCompleteTask(task.id) && 'opacity-50',
              completed[task.id] && 'bg-green-50'
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <Checkbox
                  checked={completed[task.id]}
                  onCheckedChange={() => completeTask(task.id)}
                  disabled={!canCompleteTask(task.id)}
                />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {task.description}
              </p>

              {task.videoUrl && (
                <video src={task.videoUrl} controls className="w-full mb-4" />
              )}

              {task.requiresPhoto && (
                <PhotoCapture
                  value={photos[task.id]}
                  onChange={(urls) => setPhotos({ ...photos, [task.id]: urls })}
                  required
                />
              )}

              <Badge variant="secondary">
                Est. {task.estimatedMinutes} min
              </Badge>
            </CardContent>
          </Card>
        ))}

        {/* Signature */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <SignaturePad onChange={setSignature} />
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          disabled={!allTasksCompleted}
          onClick={submitChecklist}
        >
          Submit Checklist
        </Button>
      </div>
    );
  };
  ```

- [ ] Implement escalation system
  ```typescript
  // Escalate if checklist not completed by expected time
  const useChecklistEscalation = (checklistId: string, expectedTime: Date) => {
    useEffect(() => {
      const checkTime = setInterval(() => {
        const now = new Date();
        const overdue = differenceInMinutes(now, expectedTime);

        if (overdue > 15 && !isCompleted) {
          // Send notification to manager
          notifyManager({
            type: 'overdue_checklist',
            checklistId,
            minutesOverdue: overdue,
          });
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkTime);
    }, []);
  };
  ```

### 1.5 Mobile PWA Enhancements
- [ ] Optimize for mobile performance
  - Lazy load images
  - Virtual scrolling for long lists
  - Optimize bundle size
  - Prefetch critical data

- [ ] Implement camera features
  ```typescript
  const CameraCapture = ({ onCapture }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Back camera
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    };

    const capturePhoto = () => {
      const canvas = document.createElement('canvas');
      const video = videoRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        const compressed = await compressImage(blob!, 500); // 500KB
        onCapture(compressed);
      }, 'image/jpeg', 0.9);
    };

    return (
      <div>
        <video ref={videoRef} autoPlay playsInline className="w-full" />
        <Button onClick={capturePhoto}>Capture</Button>
      </div>
    );
  };
  ```

- [ ] Add install prompts
  ```typescript
  const useInstallPrompt = () => {
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
      const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const promptInstall = async () => {
      if (!installPrompt) return;

      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    };

    return { canInstall: !!installPrompt, promptInstall };
  };
  ```

### 1.6 Dashboard & Navigation
- [ ] Create main dashboard
  ```typescript
  const Dashboard = () => {
    const { user, organization } = useAuth();
    const { data: todayStats } = useTodayStats();
    const { data: openIncidents } = useOpenIncidents();
    const { data: pendingTasks } = usePendingTasks();

    return (
      <div className="space-y-6">
        <PageHeader
          title={`Welcome back, ${user.first_name}`}
          subtitle={organization.name}
        />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Reports Today"
            value={todayStats?.reports}
            icon={FileText}
          />
          <StatsCard
            title="Open Incidents"
            value={openIncidents?.length}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingTasks?.length}
            icon={CheckSquare}
          />
          <StatsCard
            title="Staff On Duty"
            value={todayStats?.staffCount}
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Button size="lg" asChild>
              <Link to="/reports/new">
                <FileText className="mr-2" />
                New Shift Report
              </Link>
            </Button>
            <Button size="lg" variant="destructive" asChild>
              <Link to="/incidents/new">
                <AlertTriangle className="mr-2" />
                Report Incident
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/checklists">
                <CheckSquare className="mr-2" />
                Complete Checklist
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    );
  };
  ```

- [ ] Build navigation system
  ```typescript
  // Desktop sidebar + mobile bottom nav
  const AppLayout = () => {
    return (
      <div className="min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="md:ml-64 pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
          <BottomNavigation />
        </nav>
      </div>
    );
  };
  ```

**Phase 1 Deliverables:**
- ✅ Form builder fully functional
- ✅ 3 core modules operational
- ✅ Mobile PWA installable
- ✅ Real-time features working
- ✅ 5 beta customers onboarded

**Success Metrics:**
- Beta satisfaction: 8+/10
- Report completion: <5 min
- Mobile Lighthouse: >90
- Daily active usage: 75%+

---

## Phase 2: Operational Excellence (Weeks 17-28)
**Goal:** Expand to 25 customers with comprehensive facility management

### 2.1 Module: Facility Condition Tracking
- [ ] Area inspection system with floor plans
- [ ] Pass/Fail/NA checklist system
- [ ] Temperature/humidity logging
- [ ] Trend visualization
- [ ] Automated scheduling
- [ ] Condition analytics

### 2.2 Module: Equipment Inspection Logs
- [ ] Equipment inventory with QR codes
- [ ] QR code scanning (mobile camera)
- [ ] Maintenance history tracking
- [ ] Preventive maintenance scheduling
- [ ] Cost tracking
- [ ] Equipment lifecycle management

### 2.3 Module: Pool Chemistry & Aquatics
- [ ] Multi-pool configuration
- [ ] Chemistry parameter logging (10+ parameters)
- [ ] Auto-validation and alerts
- [ ] Chemical dosing calculations
- [ ] Inventory management
- [ ] Health department compliance tracking

### 2.4 Module: Maintenance Request System
- [ ] Work order creation and tracking
- [ ] Priority-based routing
- [ ] Photo/video attachment
- [ ] Cost estimation
- [ ] Vendor management
- [ ] Integration prep (Connect2 API)

### 2.5 Multi-Facility Management
- [ ] Organization hierarchy (Org → Facilities → Departments)
- [ ] Cross-facility dashboards
- [ ] Comparison reports
- [ ] Template sharing
- [ ] Consolidated analytics

### 2.6 Advanced Offline Sync
- [ ] Differential sync (only changes)
- [ ] Conflict resolution UI
- [ ] Retry logic with exponential backoff
- [ ] Sync status dashboard
- [ ] Selective sync preferences

### 2.7 Enhanced Analytics
- [ ] Custom dashboard builder
- [ ] KPI tracking with targets
- [ ] Data visualizations (Recharts)
- [ ] Scheduled reports
- [ ] Export to Excel/PDF

**Phase 2 Deliverables:**
- ✅ 7 total modules operational
- ✅ 25 paying customers
- ✅ Multi-facility support
- ✅ Full offline capability
- ✅ Advanced analytics

---

## Phase 3: Integration & Scale (Weeks 29-40)
**Goal:** Scale to 75 customers with enterprise integrations

### 3.1 Module: Staff Communication & Tasks
### 3.2 Module: Patron Count & Analytics
### 3.3 Module: Emergency Response Documentation
### 3.4 Connect2 Integration (REST API)
### 3.5 SubItUp Integration (Schedule sync)
### 3.6 Public REST API with OAuth
### 3.7 Webhooks System
### 3.8 Advanced Reporting Suite

---

## Phase 4: Enterprise & Advanced Features (Weeks 41-52)
**Goal:** Reach 150 customers with full enterprise capabilities

### 4.1 Module: Fitness Floor Management
### 4.2 Module: Court & Gymnasium Operations
### 4.3 Module: Locker Room & Hygiene Management
### 4.4 Module: Member Services & Feedback
### 4.5 Predictive Analytics (Optional ML)
### 4.6 White-Label Features
### 4.7 Enterprise SSO (SAML 2.0)
### 4.8 Billing Integration (Stripe)
### 4.9 SOC 2 Compliance
### 4.10 Mobile App Enhancements

---

## Key Lovable-Specific Considerations

### Performance Optimization
- Code splitting by route
- Image optimization (next/image patterns)
- React Query caching strategy
- Memoization (useMemo, useCallback)
- Virtual scrolling for large lists

### Security Best Practices
- Supabase RLS for all tables
- Input validation with Zod
- XSS prevention (sanitize user input)
- CSRF protection
- Secure file uploads

### Developer Experience
- TypeScript strict mode
- ESLint + Prettier
- Husky pre-commit hooks
- Conventional commits
- Component documentation (Storybook optional)

### Deployment Strategy
- Vercel/Netlify auto-deploy from main
- Preview deployments for PRs
- Environment variables per environment
- Database migrations via Supabase CLI
- Edge function deployment

---

## Success Metrics Summary

### Phase 0 (Foundation)
- ✅ Lighthouse score >90
- ✅ Bundle size <500KB
- ✅ Test coverage >80%
- ✅ Time to Interactive <3s

### Phase 1 (MVP)
- ✅ 5 beta customers
- ✅ 100+ reports submitted
- ✅ Mobile installs: 50+
- ✅ Satisfaction: 8+/10

### Phase 2 (Expansion)
- ✅ 25 paying customers
- ✅ MRR: $25K+
- ✅ DAU: 75%+
- ✅ Support: <5 tickets/customer/month

### Phase 3 (Integration)
- ✅ 75 paying customers
- ✅ MRR: $75K+
- ✅ API: 100K requests/month
- ✅ Integration adoption: 50%+

### Phase 4 (Enterprise)
- ✅ 150 paying customers
- ✅ ARR: $1.8M+
- ✅ NPS: 50+
- ✅ Annual churn: <8%

---

## Next Steps

1. **Review this Lovable-optimized roadmap**
2. **Set up Supabase project** (database, auth, storage)
3. **Initialize Lovable project** with shadcn/ui
4. **Begin Phase 0** foundation work
5. **Recruit beta customers** for Phase 1

**Ready to build in Lovable? Let's start! 🚀**
