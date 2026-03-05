-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (multi-tenant support)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'supervisor', 'staff', 'lifeguard', 'instructor')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, email)
);

-- Shift reports table
CREATE TABLE shift_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('opening', 'afternoon', 'closing', 'weekend_am', 'weekend_pm')),
  shift_start TIME,
  shift_end TIME,
  submitted_by UUID REFERENCES profiles ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'revision_requested')),

  -- Patron counts
  patron_count_total INTEGER DEFAULT 0,
  patron_count_peak INTEGER,
  patron_count_peak_time TIME,
  patron_count_pool INTEGER,
  patron_count_fitness INTEGER,
  patron_count_courts INTEGER,
  patron_count_other INTEGER,

  -- Staff tracking
  staff_members JSONB DEFAULT '[]'::jsonb,

  -- Pool operations
  pool_readings JSONB DEFAULT '{}'::jsonb,

  -- Area checks
  area_checks JSONB DEFAULT '[]'::jsonb,

  -- Equipment issues
  equipment_down JSONB DEFAULT '[]'::jsonb,

  -- Weather
  weather_conditions TEXT,
  outside_temperature NUMERIC(4,1),

  -- Notes
  has_incidents BOOLEAN DEFAULT false,
  incidents_summary TEXT,
  general_notes TEXT,
  handoff_notes TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  incident_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Classification
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'injury_patron', 'injury_staff', 'illness', 'rescue', 'near_miss',
    'property_damage', 'theft', 'behavioral', 'chemical', 'fire', 'weather', 'other'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
  location TEXT NOT NULL,
  specific_location TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,

  -- Involved persons
  injured_person_name TEXT,
  injured_person_phone TEXT,
  injured_person_email TEXT,
  injured_person_age INTEGER,
  injured_person_is_member BOOLEAN DEFAULT false,
  injured_person_member_id TEXT,

  -- Body diagram (for injuries)
  injury_marks JSONB DEFAULT '[]'::jsonb,

  -- Emergency response
  ems_called BOOLEAN DEFAULT false,
  ems_call_time TIME,
  ems_arrival_time TIME,
  police_called BOOLEAN DEFAULT false,
  police_report_number TEXT,
  hospital_transport BOOLEAN DEFAULT false,
  hospital_name TEXT,
  first_aid_provided TEXT,

  -- Witnesses
  witnesses JSONB DEFAULT '[]'::jsonb,

  -- Photos and maps
  photos JSONB DEFAULT '[]'::jsonb,
  map_markers JSONB DEFAULT '[]'::jsonb,

  -- Description fields
  actions_taken TEXT,
  contributing_factors TEXT,

  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  parent_notified BOOLEAN DEFAULT false,
  insurance_filed BOOLEAN DEFAULT false,
  preventive_measures TEXT,

  -- Signature
  signature_data TEXT,

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  reported_by UUID REFERENCES profiles ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklists table
CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  name TEXT NOT NULL,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('opening', 'closing', 'shift', 'maintenance', 'custom')),
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_template BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist submissions table
CREATE TABLE checklist_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  checklist_id UUID REFERENCES checklists ON DELETE CASCADE,
  submitted_date DATE NOT NULL,
  submitted_by UUID REFERENCES profiles ON DELETE SET NULL,
  submitter_name TEXT NOT NULL,
  completed_tasks JSONB DEFAULT '{}'::jsonb,
  task_notes JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Pool chemistry readings table
CREATE TABLE chemistry_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  pool_name TEXT NOT NULL,
  reading_time TIMESTAMPTZ NOT NULL,
  tested_by UUID REFERENCES profiles ON DELETE SET NULL,
  tester_name TEXT NOT NULL,

  -- Chemistry values
  free_chlorine NUMERIC(4,2) NOT NULL,
  combined_chlorine NUMERIC(4,2),
  ph_level NUMERIC(3,2) NOT NULL,
  alkalinity INTEGER,
  water_temp NUMERIC(4,1) NOT NULL,
  cyanuric_acid INTEGER,

  -- Status
  status TEXT NOT NULL CHECK (status IN ('in_range', 'warning', 'out_of_range')),
  chemicals_added TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  equipment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cardio', 'strength', 'pool', 'court', 'facility', 'safety')),
  location TEXT NOT NULL,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'needs_service', 'out_of_service', 'retired')),

  -- Details
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  last_serviced DATE,
  next_service DATE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, equipment_id)
);

-- Equipment inspections table
CREATE TABLE equipment_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment ON DELETE CASCADE,
  inspected_by UUID REFERENCES profiles ON DELETE SET NULL,
  inspected_at TIMESTAMPTZ NOT NULL,

  -- Inspection results
  checklist_items JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  passed BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance work orders table
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  work_order_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'plumbing', 'electrical', 'hvac', 'equipment', 'structural', 'cleaning', 'pool', 'other'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'on_hold', 'completed', 'cancelled')),

  -- Assignment
  requested_by UUID REFERENCES profiles ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles ON DELETE SET NULL,

  -- Dates
  due_date DATE,
  completed_date DATE,
  estimated_hours NUMERIC(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patron count logs table
CREATE TABLE patron_count_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  log_time TIMESTAMPTZ NOT NULL,
  area_name TEXT NOT NULL,
  current_count INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  recorded_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member feedback table
CREATE TABLE member_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('compliment', 'complaint', 'suggestion', 'question')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  member_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  area TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'closed')),
  response TEXT,
  responded_by UUID REFERENCES profiles ON DELETE SET NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form schemas table (for form builder)
CREATE TABLE form_schemas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  module_type TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  form_schema_id UUID REFERENCES form_schemas ON DELETE CASCADE,
  submitted_by UUID REFERENCES profiles ON DELETE SET NULL,
  form_data JSONB NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemistry_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patron_count_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Generic RLS policy template (apply to all tables)
-- Users can only access data from their organization
CREATE POLICY "org_isolation_policy" ON shift_reports
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON incidents
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON checklists
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON checklist_submissions
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON chemistry_readings
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON equipment
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON equipment_inspections
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON work_orders
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON patron_count_logs
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON member_feedback
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON form_schemas
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "org_isolation_policy" ON form_submissions
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

-- Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('incident-photos', 'incident-photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('report-attachments', 'report-attachments', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view incident photos in their org"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'incident-photos');

CREATE POLICY "Users can upload incident photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'incident-photos' AND auth.uid() IS NOT NULL);

-- Functions for automatic incident numbering
CREATE OR REPLACE FUNCTION generate_incident_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.incident_number := 'INC-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD((SELECT COUNT(*) + 1 FROM incidents
          WHERE organization_id = NEW.organization_id
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()))::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_incident_number
  BEFORE INSERT ON incidents
  FOR EACH ROW
  WHEN (NEW.incident_number IS NULL)
  EXECUTE FUNCTION generate_incident_number();

-- Functions for automatic work order numbering
CREATE OR REPLACE FUNCTION generate_work_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.work_order_number := 'WO-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD((SELECT COUNT(*) + 1 FROM work_orders
          WHERE organization_id = NEW.organization_id
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()))::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_work_order_number
  BEFORE INSERT ON work_orders
  FOR EACH ROW
  WHEN (NEW.work_order_number IS NULL)
  EXECUTE FUNCTION generate_work_order_number();

-- Indexes for performance
CREATE INDEX idx_shift_reports_org_date ON shift_reports(organization_id, report_date DESC);
CREATE INDEX idx_incidents_org_date ON incidents(organization_id, occurred_at DESC);
CREATE INDEX idx_chemistry_readings_org_pool_time ON chemistry_readings(organization_id, pool_name, reading_time DESC);
CREATE INDEX idx_equipment_org_category ON equipment(organization_id, category);
CREATE INDEX idx_work_orders_org_status ON work_orders(organization_id, status);
CREATE INDEX idx_profiles_org_email ON profiles(organization_id, email);
