# Rec Reports - Recreation Facility Operations Management

A comprehensive SaaS platform designed to digitize and streamline daily operational documentation for recreation facilities across North America.

## 🎯 Overview

Rec Reports replaces paper-based shift logs, checklists, and manual reporting systems with a mobile-first, offline-capable digital solution that improves accountability, reduces liability exposure, and provides actionable operational insights.

### Key Features

- ✅ **Daily Operations Reports** - Digital shift documentation and handoff
- 🚨 **Incident Management** - Comprehensive accident/incident reporting with body diagrams
- ✅ **Smart Checklists** - Opening/closing task lists with photo verification
- 📦 **Equipment Tracking** - QR code-based inventory and maintenance logs
- 🔧 **Maintenance Requests** - Work order management system
- 📊 **Analytics Dashboard** - Data-driven insights and performance metrics
- 📱 **Mobile-First PWA** - Works offline with automatic sync
- 🏢 **Multi-Facility Support** - Manage multiple locations from one platform

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Client state management

### Backend
- **Supabase** - Backend as a Service ✅ **INTEGRATED**
  - PostgreSQL database with full schema
  - Row Level Security (RLS) for multi-tenant isolation
  - Authentication (email/password, magic links)
  - Storage (photos, documents)
  - Realtime subscriptions for live updates

### Mobile
- **PWA** - Progressive Web App with offline support
- **Service Workers** - Background sync and caching
- **IndexedDB** - Local data storage

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MF-Rec-Reports
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Enter project details and wait for database provisioning (~2 minutes)

#### Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this repo
3. Copy all content and paste into SQL Editor
4. Click "Run" to create all tables, policies, and functions

This will create:
- Multi-tenant organization structure
- All 15 module tables (reports, incidents, equipment, etc.)
- Row Level Security policies
- Storage buckets (avatars, incident-photos, attachments)
- Auto-incrementing incident numbers (INC-2026-0001)
- Auto-incrementing work order numbers (WO-2026-001)

#### Get API Credentials

1. Go to **Settings** → **API**
2. Copy your:
   - Project URL
   - Anon/Public key

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=Rec Reports
VITE_APP_VERSION=1.0.0
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Create Your First Account

1. Navigate to `http://localhost:5173/signup`
2. Fill in the signup form:
   - **First Name** and **Last Name**
   - **Organization Name** (e.g., "Springfield Recreation Center")
   - **Email** (must be valid)
   - **Password** (minimum 8 characters)
3. Click "Create Account"
4. Check your email for verification (if email confirmation is enabled)
5. Login at `/login` with your credentials

**Note**: The first user to sign up for an organization becomes the admin.

### 7. Build for Production

```bash
npm run build
```

### 8. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
MF-Rec-Reports/
├── supabase/
│   └── schema.sql          # Complete database schema with RLS
│
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components (Sidebar, Navigation)
│   │   ├── auth/          # ProtectedRoute component
│   │   ├── BodyDiagram.tsx
│   │   ├── StatsCard.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── pages/             # Route pages (all functional)
│   │   ├── auth/          # Login, Signup (✅ Supabase integrated)
│   │   ├── reports/       # Shift reports (✅ Supabase integrated)
│   │   ├── incidents/     # Incident management (✅ Supabase integrated)
│   │   ├── checklists/    # Task checklists
│   │   ├── chemistry/     # Pool chemistry tracking
│   │   ├── equipment/     # Equipment inventory
│   │   ├── maintenance/   # Work orders
│   │   ├── staff/         # Staff management
│   │   ├── patrons/       # Patron count tracking
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── settings/      # Settings
│   │   └── admin/         # Form Builder
│   │
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # ✅ Supabase auth integration
│   │
│   ├── hooks/             # Custom React Query hooks
│   │   ├── useShiftReports.ts  # ✅ Reports CRUD + realtime
│   │   ├── useIncidents.ts     # ✅ Incidents CRUD + realtime
│   │   └── useChemistry.ts     # ✅ Chemistry readings
│   │
│   ├── lib/               # Utilities and configuration
│   │   ├── supabase.ts    # ✅ Supabase client
│   │   ├── storage.ts     # ✅ File upload utilities
│   │   └── utils.ts       # Helper functions
│   │
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Supabase table types
│   │
│   ├── App.tsx            # Root with AuthProvider
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                # Static assets
├── .env.example           # Environment template
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🎨 UI Components

The project uses **shadcn/ui** components built with:
- Radix UI primitives
- Tailwind CSS
- Class Variance Authority (CVA)

### Available Components

- ✅ Button, Input, Label, Textarea
- ✅ Card, Badge, Avatar
- ✅ Select, Checkbox, Tabs
- ✅ Dialog, Dropdown Menu
- ✅ Custom: StatsCard, EmptyState, BodyDiagram, PageHeader

## 📱 Features & Supabase Integration Status

### ✅ Authentication (Fully Integrated)
- **Supabase Auth** with email/password
- Organization creation on signup
- User profile creation with RLS
- Protected routes
- Session management
- Real-time auth state

### ✅ Shift Reports Module (Fully Integrated)
- **Real-time updates** via Supabase subscriptions
- List all shift reports with filters
- Create shift reports with:
  - General information (date, shift type, staff)
  - Pool operations
  - Patron counts
  - Highlights and notes
- Multi-tenant isolation (organization-based)
- Search and filter by status/shift
- Row Level Security policies

### ✅ Incidents Module (Fully Integrated)
- **Real-time incident updates**
- List all incidents with severity badges
- Auto-generated incident numbers (INC-2026-0001)
- Create incident reports with:
  - Incident classification
  - Interactive body diagram
  - Facility location
  - Witness information
  - Photo upload support (Supabase Storage)
  - EMS/emergency response tracking
  - Follow-up actions
- OSHA compliance ready
- RLS policies for data isolation

### ✅ Pool Chemistry (Hooks Ready)
- React Query hooks created
- Auto-status calculation (in_range, warning, out_of_range)
- Trend analysis queries
- Integration with chemistry_readings table

### 🚧 Other Modules (UI Complete, Backend Ready)
- **Checklists** - UI complete, hooks needed
- **Equipment** - UI complete, hooks needed
- **Maintenance** - UI complete, work_orders table ready
- **Staff Management** - UI complete
- **Patron Count** - UI complete
- **Analytics** - Charts ready, data queries needed
- **Settings** - UI complete

### 🎯 File Storage (Configured)
- **Storage buckets** created:
  - `avatars` (public)
  - `incident-photos` (private)
  - `report-attachments` (private)
- Upload utilities in `src/lib/storage.ts`
- Validation presets for images/documents

## 🗄️ Database Schema

The schema (`supabase/schema.sql`) includes:

### Core Tables
- **organizations** - Multi-tenant organization data
- **profiles** - User profiles (extends auth.users)
- **shift_reports** - Daily shift documentation
- **incidents** - Incident reports with auto-numbering
- **chemistry_readings** - Pool water test results
- **equipment** - Equipment inventory
- **work_orders** - Maintenance requests (auto-numbered)
- **checklists** - Checklist templates
- **checklist_submissions** - Completed checklists

### Security Features
- **Row Level Security (RLS)** on all tables
- Organization-based data isolation
- Automatic user assignment to organization
- Admin role support

### Auto-Generated Features
- Incident numbers: `INC-{year}-{sequential}`
- Work order numbers: `WO-{year}-{sequential}`
- Timestamps (created_at, updated_at)
- Profile creation trigger on user signup

### Storage Buckets
- `avatars` - User profile pictures (public)
- `incident-photos` - Incident evidence (private)
- `report-attachments` - Report documents (private)

## 🔐 Security & Multi-Tenancy

### Row Level Security Policies

Every table has RLS policies that ensure:
- Users only access data from their organization
- Admins can manage organization settings
- Staff can create/update within their scope
- Viewers have read-only access

Example policy:
```sql
-- Users can only see their organization's incidents
CREATE POLICY "Users can view own organization incidents"
  ON incidents FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));
```

### Authentication Flow
1. User signs up → `auth.users` record created
2. Trigger creates `profiles` record
3. First user creates organization
4. Profile linked to organization
5. RLS policies enforce isolation

## 🚀 Real-time Features

Supabase Realtime subscriptions are enabled for:

### Shift Reports
```typescript
useShiftReportsSubscription()
```
- New reports appear instantly
- Status updates broadcast live
- Filtered by organization

### Incidents
```typescript
useIncidentsSubscription()
```
- Real-time incident alerts
- Live status changes
- Automatic UI updates

### How It Works
1. Hook subscribes to table changes
2. Filters by organization_id
3. Invalidates React Query cache
4. UI automatically re-renders

## 📤 File Uploads

The `src/lib/storage.ts` utility provides:

### Upload Functions
```typescript
// Upload incident photo
await storage.uploadIncidentPhoto(file, incidentId, organizationId)

// Upload avatar
await storage.uploadAvatar(file, userId)

// Upload report attachment
await storage.uploadReportAttachment(file, reportId, organizationId)
```

### Validation
```typescript
// Validate before upload
storage.validateFile(file, VALIDATION_PRESETS.image)
storage.validateFile(file, VALIDATION_PRESETS.document)
```

### Limits
- Images: 5MB max (JPEG, PNG, GIF, WebP)
- Documents: 10MB max (PDF, DOC, DOCX, TXT)
- Avatars: 2MB max (JPEG, PNG, WebP)

## 🧪 Testing

```bash
# Run type check
npm run type-check

# Run linter
npm run lint
```

## 📦 Deployment

### Environment Variables (Required)

Set these in your hosting platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repo
4. Add environment variables
5. Click "Deploy"

Vercel auto-detects Vite projects.

### Deploy to Netlify

1. Connect GitHub repository at [netlify.com](https://netlify.com)
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Site settings
4. Click "Deploy site"

### Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect GitHub repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
5. Add environment variables
6. Save and deploy

### Post-Deployment Checklist

- ✅ Environment variables set correctly
- ✅ Supabase URL accessible
- ✅ Test user signup/login
- ✅ Check browser console for errors
- ✅ Verify database connections
- ✅ Test file uploads (if using storage)

## 🐛 Troubleshooting

### "Supabase client not initialized"

**Cause**: Missing or incorrect environment variables

**Fix**:
1. Check `.env` file exists in project root
2. Verify variables start with `VITE_` prefix
3. Restart dev server: `npm run dev`

### "Row Level Security policy violation"

**Cause**: User profile not linked to organization

**Fix**:
1. Check Supabase dashboard → Table Editor → `profiles`
2. Verify your user has an `organization_id`
3. If missing, sign up again or manually set in database

### "Cannot read properties of undefined (reading 'organization_id')"

**Cause**: Profile not loaded or auth state not ready

**Fix**:
- The AuthContext handles this with a loading state
- Ensure you're using `useAuth()` hook in protected components
- Check that `<AuthProvider>` wraps your app

### File upload fails

**Cause**: Storage bucket doesn't exist or wrong permissions

**Fix**:
1. Go to Supabase → Storage
2. Verify buckets exist:
   - `avatars` (public)
   - `incident-photos` (private)
   - `report-attachments` (private)
3. Check bucket policies allow authenticated uploads
4. Verify file size limits (5MB images, 10MB documents)

### Real-time updates not working

**Cause**: Supabase Realtime not enabled

**Fix**:
1. Go to Supabase → Database → Replication
2. Enable replication for tables:
   - `shift_reports`
   - `incidents`
   - Other tables as needed
3. Save changes

### Build fails with TypeScript errors

**Cause**: Type mismatches or missing types

**Fix**:
```bash
# Run type check to see all errors
npm run type-check

# Common fixes:
# 1. Update types in src/types/index.ts
# 2. Check Supabase table column names match types
# 3. Run: npm install --save-dev @types/node
```

### CORS errors in development

**Cause**: Supabase URL not whitelisted

**Fix**:
1. Go to Supabase → Authentication → URL Configuration
2. Add `http://localhost:5173` to allowed URLs
3. Save changes

## 🔧 Development Tips

### Hot Reload Not Working

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Inspect Database

Use Supabase SQL Editor or Table Editor:
- View all data in real-time
- Test RLS policies (switch user context)
- Check indexes and performance

### Debug React Query

```typescript
// Add to App.tsx temporarily
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// In component:
<ReactQueryDevtools initialIsOpen={false} />
```

### Test with Multiple Organizations

1. Sign up with different email addresses
2. Each creates a new organization
3. Verify data isolation works
4. Test RLS policies are effective

## 🚀 Next Steps & Roadmap

### Immediate Next Steps
- [ ] Add remaining module hooks (equipment, checklists, etc.)
- [ ] Implement photo capture in incident forms
- [ ] Add email notifications for critical incidents
- [ ] Export reports to PDF

### Future Enhancements
- [ ] Mobile app (React Native or Capacitor)
- [ ] SMS notifications via Twilio
- [ ] Advanced analytics with custom date ranges
- [ ] QR code scanning for equipment
- [ ] Integration with access control systems
- [ ] Multi-facility management dashboard
- [ ] Custom role-based permissions
- [ ] Offline PWA with service workers
- [ ] Automated compliance reports
- [ ] AI-powered incident classification

## 🤝 Contributing

This is a private project. For team members:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly (check auth, RLS, realtime)
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/your-feature`
6. Submit a pull request

### Coding Standards
- Use TypeScript strict mode
- Follow existing code style
- Add JSDoc comments for complex functions
- Test multi-tenant scenarios
- Verify RLS policies work as expected

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev/guide/)

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Email: support@recreports.com
- Documentation: Check this README first

---

**Built with ❤️ for Recreation Facility Professionals**
