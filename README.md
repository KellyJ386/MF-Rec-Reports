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

### Backend (To be added)
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Storage
  - Edge Functions
  - Realtime subscriptions

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

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (to be added later)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
MF-Rec-Reports/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components (Sidebar, Navigation)
│   │   ├── BodyDiagram.tsx # Interactive body diagram
│   │   ├── StatsCard.tsx   # Statistics card component
│   │   └── EmptyState.tsx  # Empty state placeholder
│   │
│   ├── pages/              # Route pages
│   │   ├── auth/           # Login, Signup
│   │   ├── reports/        # Daily reports
│   │   ├── incidents/      # Incident management
│   │   ├── checklists/     # Task checklists
│   │   ├── equipment/      # Equipment inventory
│   │   ├── maintenance/    # Work orders
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── settings/       # Settings
│   │   ├── admin/          # Admin tools (Form Builder)
│   │   └── DashboardPage.tsx
│   │
│   ├── lib/                # Utilities and configuration
│   │   └── utils.ts        # Helper functions
│   │
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state stores
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md              # This file
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

## 📱 Features Implemented

### ✅ Authentication
- Login page with email/password
- Signup page with organization setup
- Password reset flow (UI ready)

### ✅ Dashboard
- Real-time stats (Reports, Incidents, Tasks, Staff)
- Quick actions (New Report, Report Incident, Complete Checklist)
- Recent activity feed
- Open incidents summary
- Facility performance metrics

### ✅ Reports Module
- List all shift reports
- Create new shift reports with tabs:
  - General information
  - Pool operations
  - Fitness floor
  - Courts & gymnasium
  - Additional notes
- Search and filter
- Export functionality

### ✅ Incidents Module
- List all incidents with severity badges
- Create new incident reports with:
  - Incident classification
  - Interactive body diagram
  - Facility location marking
  - Witness information
  - Photo evidence upload
  - Emergency response documentation
  - Follow-up actions
- OSHA compliance ready

### ✅ Checklists Module
- Opening/closing checklists
- Task dependencies
- Photo verification
- Progress tracking
- Time estimation per task

### ✅ Equipment Module
- Equipment inventory list
- QR code scanning ready
- Maintenance history
- Status tracking (Operational, Needs Service, Out of Service)

### ✅ Maintenance Module
- Work order management
- Priority-based routing
- Status tracking
- Assignment workflow

### ✅ Analytics Module
- KPI dashboard
- Patron traffic analysis
- Incident trends
- Area utilization
- Equipment status

### ✅ Settings Module
- Profile management
- Facility configuration
- Notification preferences
- Security settings

## 🔄 Next Steps (Supabase Integration)

### 1. Set Up Supabase Project
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `.env`

### 2. Create Database Schema
Run the SQL scripts to create:
- `organizations` table
- `facilities` table
- `profiles` table (linked to auth.users)
- `shift_reports` table
- `incidents` table
- `checklists` and `checklist_completions` tables
- `equipment` table
- `work_orders` table

### 3. Enable Row Level Security (RLS)
- Add RLS policies for multi-tenant isolation
- Users can only see their organization's data

### 4. Configure Authentication
- Enable email/password auth
- Set up email templates
- Configure JWT settings

### 5. Set Up Storage
- Create buckets for photos, videos, documents
- Configure storage policies

### 6. Add React Query Hooks
- Create API hooks in `src/lib/api/`
- Replace mock data with real Supabase queries

### 7. Implement Real-time Features
- Supabase Realtime for live updates
- Presence tracking for online users

### 8. Add Offline Support
- IndexedDB for local storage
- Background sync for queued operations
- Conflict resolution

## 🧪 Testing

```bash
# Run type check
npm run type-check

# Run linter
npm run lint
```

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

## 🤝 Contributing

This is a private project. For team members:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For questions or issues:
- Email: support@recreports.com
- Slack: #rec-reports channel

---

**Built with ❤️ for Recreation Facility Professionals**
