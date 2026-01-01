# Rec Reports - Enhanced Module Development Plan

## Overview
This document outlines the comprehensive features to be added to each module before moving to Lovable.dev.

---

## 🎯 Priority Levels

**Phase A (Critical - Must Have):**
1. Form Builder ("The Brain")
2. Daily Operations Reports
3. Incident Reporting
4. Opening/Closing Checklists
5. Pool Chemistry & Aquatics

**Phase B (Important - Core Operations):**
6. Equipment Inspection Logs
7. Maintenance Request System
8. Staff Communication & Tasks
9. Patron Count & Analytics

**Phase C (Enhanced - Full Feature Set):**
10. Emergency Response Documentation
11. Fitness Floor Management
12. Court & Gymnasium Operations
13. Locker Room & Hygiene
14. Member Services & Feedback
15. Advanced Analytics Dashboard

---

## Module Enhancement Details

### 1. Form Builder ("The Brain") 🧠
**Current State:** Placeholder page
**Needs:**
- Drag-and-drop form builder UI
- 25+ field types (text, number, date, photo, signature, body diagram, chemistry, etc.)
- Field property editor (label, placeholder, validation, required, conditional logic)
- Form preview with real-time updates
- Template library (50+ pre-built templates)
- Form versioning
- Import/export forms as JSON

**Components to Build:**
- `FormBuilder.tsx` - Main builder interface
- `FieldPalette.tsx` - Draggable field types
- `FormCanvas.tsx` - Drop zone for fields
- `FieldPropertiesPanel.tsx` - Edit field settings
- `FormPreview.tsx` - Real-time preview
- `TemplateLibrary.tsx` - Browse and import templates
- `ConditionalLogicBuilder.tsx` - Visual logic builder

---

### 2. Daily Operations Reports 📋
**Current State:** Basic form with tabs
**Needs:**
- Auto-save every 30 seconds
- Photo upload (max 10 photos per report)
- Staff on duty multi-select
- Patron count by time block
- Weather widget integration
- Equipment status checkboxes
- Handoff notes with priority flagging
- Supervisor approval workflow
- PDF export with photos
- Email delivery (EOD summary)
- Report history and search

**Components to Build:**
- `PhotoUploadField.tsx` - Multi-photo upload with compression
- `PatronCountTable.tsx` - Hourly count tracker
- `StaffSelector.tsx` - Multi-select for staff on duty
- `HandoffNotes.tsx` - Priority-tagged notes
- `ReportPDFExport.tsx` - PDF generation
- `AutoSave.tsx` - Auto-save hook with indicator

---

### 3. Incident & Accident Reporting 🚨
**Current State:** Basic form with simple body diagram
**Needs:**
- Enhanced body diagram (front/back with multiple marks)
- Facility floor plan upload and markup
- Witness management (add multiple witnesses)
- Photo/video evidence (max 50MB video)
- EMS documentation
- Staff response timeline
- Severity-based notifications (SMS for critical)
- Follow-up action items with assignment
- OSHA 300 log integration
- Insurance claim linking
- Anonymous near-miss submission

**Components to Build:**
- `EnhancedBodyDiagram.tsx` - Multiple injury marks with labels
- `FacilityFloorPlan.tsx` - Upload and markup custom floor plans
- `WitnessManager.tsx` - Add/edit/remove witnesses
- `VideoUpload.tsx` - Large file upload with progress
- `IncidentTimeline.tsx` - Visual timeline of events
- `NotificationRules.tsx` - Configure alerts by severity
- `FollowUpActions.tsx` - Task creation and assignment
- `OSHA300Export.tsx` - Generate OSHA logs

---

### 4. Opening & Closing Checklists ✅
**Current State:** Basic checklist with progress bar
**Needs:**
- Task dependencies (can't do B until A done)
- Photo verification (required for certain tasks)
- Video training embedded per task
- Time estimation and tracking
- Digital signature capture
- Manager override with reason
- Recurring checklist templates
- Seasonal variations
- Weather-dependent tasks
- Escalation alerts (15 min overdue)
- Completion history
- Performance metrics (avg time per task)

**Components to Build:**
- `TaskDependencyGraph.tsx` - Visual dependency manager
- `PhotoVerification.tsx` - Camera capture with validation
- `VideoPlayer.tsx` - Embedded training videos
- `SignaturePad.tsx` - Digital signature capture
- `ManagerOverride.tsx` - Override workflow
- `ChecklistScheduler.tsx` - Recurring task setup
- `EscalationAlerts.tsx` - Overdue notifications

---

### 5. Pool Chemistry & Aquatics 🏊
**Current State:** Not built
**Needs:**
- Multi-pool configuration (lap, leisure, spa, splash pad)
- 10+ chemistry parameters (chlorine, pH, alkalinity, etc.)
- Auto-validation with acceptable ranges
- Out-of-range alerts (SMS/email)
- Chemical dosing calculations
- Chemical inventory tracking
- Usage forecasting
- Filter pressure logs
- Backwash scheduling
- Pump room equipment checks
- Lifeguard rotation schedule
- Rescue equipment inspections
- Health department compliance reports
- SDS sheet library

**Components to Build:**
- `PoolSelector.tsx` - Multi-pool dropdown
- `ChemistryTestLog.tsx` - Parameter entry with validation
- `DosingCalculator.tsx` - Chemical amount calculator
- `ChemicalInventory.tsx` - Stock tracking
- `FilterPressureLog.tsx` - Pressure readings over time
- `LifeguardSchedule.tsx` - Rotation management
- `ComplianceReport.tsx` - Health dept export

---

### 6. Equipment Inspection Logs 📦
**Current State:** Basic list view
**Needs:**
- QR code generation (bulk and individual)
- QR code scanning with camera
- Equipment hierarchy (category → subcategory → unit)
- Visual inspection checklists
- Hours/cycles tracking
- Maintenance history timeline
- Part replacement logs
- Warranty information
- Service vendor management
- Out-of-service tagging
- Auto-generate "Out of Order" signs (PDF)
- Preventive maintenance scheduler
- Repair vs. replace cost analysis

**Components to Build:**
- `QRCodeGenerator.tsx` - Bulk QR creation
- `QRCodeScanner.tsx` - Camera-based scanner
- `EquipmentHierarchy.tsx` - Tree view
- `InspectionChecklist.tsx` - Dynamic checklist
- `MaintenanceTimeline.tsx` - Visual history
- `PartReplacementLog.tsx` - Parts tracking
- `OutOfServiceSign.tsx` - PDF generator
- `PMScheduler.tsx` - Preventive maintenance calendar

---

### 7. Maintenance Request System 🔧
**Current State:** Basic work order list
**Needs:**
- Issue categorization (plumbing, HVAC, electrical, etc.)
- Priority-based routing
- Location tagging with floor plans
- Photo/video evidence
- Safety hazard flagging (auto-escalate)
- Vendor assignment and management
- Cost estimation vs. actual
- Parts tracking and inventory
- Status updates with timestamps
- Completion verification with photos
- Recurring maintenance tasks
- Preventive vs. reactive analytics
- Integration hooks for CMMS/Connect2

**Components to Build:**
- `WorkOrderForm.tsx` - Enhanced creation
- `VendorManagement.tsx` - Vendor database
- `CostTracking.tsx` - Estimate vs. actual
- `PartsInventory.tsx` - Parts database
- `SafetyHazardAlert.tsx` - Auto-escalation
- `MaintenanceAnalytics.tsx` - PM vs reactive

---

### 8. Staff Communication & Task Management 💬
**Current State:** Not built
**Needs:**
- Shift handoff notes with priority
- Task assignment by role
- Task status tracking (not started, in progress, done)
- Due dates and reminders
- Task reassignment
- Cross-shift visibility
- Manager review and approval
- Recurring task templates
- Photo evidence for completion
- Staff acknowledgment signatures
- Performance metrics (completion rate, time)
- Workload balancing

**Components to Build:**
- `ShiftHandoff.tsx` - Structured handoff
- `TaskAssignment.tsx` - Create and assign
- `TaskBoard.tsx` - Kanban view
- `RecurringTasks.tsx` - Template manager
- `StaffPerformance.tsx` - Metrics dashboard

---

### 9. Patron Count & Analytics 👥
**Current State:** Not built
**Needs:**
- Real-time headcount by area
- Check-in integration (barcode, RFID, manual)
- Capacity threshold alerts
- Demographic tracking (member type, age)
- Peak usage identification
- Program participation tracking
- Trend analysis (daily, weekly, monthly)
- Revenue correlation
- Space utilization efficiency
- Waitlist management
- Public capacity widget (embeddable)

**Components to Build:**
- `PatronCounter.tsx` - Real-time counter
- `CheckInIntegration.tsx` - Barcode/RFID
- `CapacityAlerts.tsx` - Threshold warnings
- `UsageTrends.tsx` - Charts and graphs
- `PublicWidget.tsx` - Embeddable capacity display

---

### 10. Emergency Response Documentation 🚑
**Current State:** Not built
**Needs:**
- Emergency type classification
- EMS call documentation
- Evacuation procedure checklists
- Emergency contact lists (offline accessible)
- AED deployment logging
- CPR administration documentation
- Emergency equipment location maps
- Staff certification verification
- Drill schedules and participation
- After-action review templates
- Corrective action plans
- Crisis communication templates

**Components to Build:**
- `EmergencyTypeSelector.tsx`
- `EMSCallLog.tsx`
- `EvacuationChecklist.tsx`
- `EmergencyContactList.tsx` - Offline accessible
- `EquipmentLocationMap.tsx` - Interactive map
- `CertificationTracker.tsx` - Expiration alerts
- `DrillScheduler.tsx`
- `AfterActionReport.tsx`

---

### 11. Fitness Floor Management 💪
**Current State:** Not built
**Needs:**
- Equipment availability status board
- Member count by time block
- Equipment cleaning logs
- Audio/visual system checks
- Towel service tracking
- Personal training session logging
- Group fitness class attendance
- Equipment malfunction reporting
- New member orientation tracking
- Fitness assessment scheduling
- Locker room supply inventory
- Peak usage heat maps

**Components to Build:**
- `EquipmentStatusBoard.tsx` - Real-time availability
- `CleaningLog.tsx` - Equipment cleaning tracker
- `ClassAttendance.tsx` - Group fitness tracking
- `UsageHeatMap.tsx` - Visual heat map

---

### 12. Court & Gymnasium Operations 🏀
**Current State:** Not built
**Needs:**
- Court/gym identification system
- Surface condition inspection
- Net and equipment setup logs
- Lighting and scoreboard checks
- HVAC monitoring
- Reservation conflict documentation
- Event setup/breakdown checklists
- Spectator area preparation
- Floor cleaning and maintenance logs
- Damage reporting with location markup
- Usage tracking by sport/activity
- Multi-purpose space configuration

**Components to Build:**
- `CourtInspection.tsx`
- `SurfaceCondition.tsx`
- `EventSetupChecklist.tsx`
- `ReservationConflicts.tsx`
- `UsageByActivity.tsx`

---

### 13. Locker Room & Hygiene Management 🚿
**Current State:** Not built
**Needs:**
- Hourly cleaning verification
- Supply inventory (soap, towels, TP)
- Locker condition inspections
- Shower/toilet functionality checks
- Drain and plumbing issue reporting
- Temperature and ventilation monitoring
- Lost and found item logging
- Odor control measures
- Deep cleaning schedules
- Chemical usage tracking

**Components to Build:**
- `HourlyCleaningLog.tsx`
- `SupplyInventory.tsx` - Reorder alerts
- `LockerInspection.tsx`
- `LostAndFound.tsx`
- `DeepCleaningSchedule.tsx`

---

### 14. Member Services & Feedback 😊
**Current State:** Not built
**Needs:**
- Member inquiry logging
- Complaint documentation
- Compliment tracking
- Suggestion collection
- Service recovery actions
- NPS surveys
- Response time metrics
- Issue categorization
- Staff kudos tracking
- Satisfaction dashboard

**Components to Build:**
- `InquiryLog.tsx`
- `ComplaintForm.tsx`
- `NPSSurvey.tsx`
- `ServiceRecovery.tsx`
- `SatisfactionDashboard.tsx`

---

### 15. Advanced Analytics Dashboard 📊
**Current State:** Placeholder charts
**Needs:**
- Real charts with Recharts library
- Patron traffic line chart
- Incident trends bar chart
- Area utilization heat map
- Equipment status pie chart
- Task completion rate
- Response time averages
- Revenue correlation graphs
- Predictive analytics (trends)
- Custom date ranges
- Export to Excel/PDF
- Scheduled report delivery

**Components to Build:**
- `PatronTrafficChart.tsx` - Line chart
- `IncidentTrendsChart.tsx` - Bar chart
- `UtilizationHeatMap.tsx` - Heat map
- `EquipmentStatusChart.tsx` - Pie chart
- `CustomDateRangePicker.tsx`
- `ReportExporter.tsx`

---

## 🎨 Shared Components Needed

### Photo & Media
- `PhotoUpload.tsx` - Multi-file with compression
- `VideoUpload.tsx` - Large files with progress
- `CameraCapture.tsx` - Direct camera access
- `ImageGallery.tsx` - Photo viewer/lightbox
- `ImageAnnotation.tsx` - Draw on images

### Forms & Inputs
- `SignaturePad.tsx` - Digital signatures
- `QRCodeScanner.tsx` - Camera-based QR scanner
- `DateTimePicker.tsx` - Enhanced date/time
- `MultiSelect.tsx` - Searchable multi-select
- `RichTextEditor.tsx` - Formatted text input
- `FileUpload.tsx` - Generic file uploader

### Data Display
- `DataTable.tsx` - Advanced table with sorting/filtering
- `Timeline.tsx` - Event timeline
- `Kanban.tsx` - Kanban board
- `Calendar.tsx` - Event calendar
- `ProgressBar.tsx` - Enhanced progress indicators

### Notifications & Alerts
- `NotificationCenter.tsx` - In-app notifications
- `AlertSystem.tsx` - Configurable alerts
- `ToastNotifications.tsx` - Enhanced toasts

---

## 🚀 Development Approach

### Option 1: Module-by-Module (Recommended)
Build each module to 100% completion before moving to the next:
1. Start with Form Builder (enables all other modules)
2. Then Daily Reports (most used)
3. Then Incidents (critical for safety)
4. Continue through priority order

### Option 2: Feature-by-Feature
Build one feature across all modules, then next feature:
1. Photo uploads everywhere
2. Signature capture everywhere
3. Analytics everywhere
4. Etc.

### Option 3: Hybrid
Build core features for all modules (80%), then polish (20%)

---

## 📋 Which Approach Would You Prefer?

1. **Module-by-Module** - Fully complete one module at a time
2. **Priority Modules First** - Build Phase A modules completely
3. **Core Features First** - Add key features across all modules
4. **Your Custom Plan** - Tell me what you want prioritized

**I recommend starting with:**
1. Form Builder (enables everything)
2. Shared components (photo upload, signature, etc.)
3. Then tackle modules one-by-one in priority order

What would you like me to start with?
