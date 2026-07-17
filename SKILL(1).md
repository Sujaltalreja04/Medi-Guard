# SKILL.md — MedWaste AI Prototype

## 1. ROLE AND MISSION

You are an expert full-stack product engineer, React architect, Convex backend engineer, enterprise UI/UX designer, healthcare technology architect, AI vision integration engineer, and IoT product prototyping specialist.

Your task is to design and build a complete, polished, interactive prototype of:

# MediGuard
## Intelligent Medical Waste Monitoring & Compliance Platform

The platform is designed for hospitals, diagnostic centers, clinics, laboratories, and healthcare facilities.

The system monitors medical-waste disposal stations. When a waste item is captured, the application sends the image to the NVIDIA API using the `minimaxai/minimax-m3` model for visual analysis. The model identifies the visible waste object and returns structured classification information. The application then evaluates that classification against configurable segregation rules for the selected bin.

The platform monitors:
- Medical waste disposal events
- AI visual waste identification
- Waste segregation violations
- Critical sharps incidents
- Bin capacity and fill levels
- Device connectivity
- Camera health
- Sensor health
- Alert acknowledgment
- Incident resolution
- Facility compliance
- AI confidence
- Operational trends
- Device uptime
- Historical events
- Compliance reporting
- Human review and corrected classifications

The application must feel like a real enterprise healthcare AI + IoT monitoring product, not a generic dashboard, hackathon project, student project, static mockup, or disconnected collection of CRUD pages.

Do not use the words "simulation", "simulated", "fake", "mock", "dummy", or similar terminology anywhere in the normal user interface.

The prototype should use real image analysis through NVIDIA's API where image input is available. Physical sensors and IoT hardware are not required for this prototype; their operational state should be represented through the application data model and UI.

---

# 2. REQUIRED STACK

## Frontend
- React.js
- Vite
- TypeScript preferred
- Tailwind CSS
- Lucide React icons
- Recharts

Use:
- Functional components
- React hooks
- Reusable components
- Feature-based architecture
- Clean separation of UI, Convex data, and NVIDIA vision integration

## Backend
Use Convex for:
- Database
- Queries
- Mutations
- Actions
- Real-time subscriptions
- Event storage
- Alert storage
- Device state
- Bin state
- Facilities
- Waste classes
- Segregation rules
- Reviews
- Audit logs
- Analytics
- AI analysis records

## AI Vision
Use NVIDIA API endpoint:

`https://integrate.api.nvidia.com/v1/chat/completions`

Model:

`minimaxai/minimax-m3`

The NVIDIA API key MUST remain server-side.

Environment variable:

`NVIDIA_API_KEY`

Never expose the NVIDIA API key in React client code, browser bundles, local storage, query parameters, or frontend network configuration.

All NVIDIA API calls must be performed through a secure server-side Convex action or equivalent server-side execution environment.

---

# 3. CORE AI ARCHITECTURE

The primary image-analysis workflow is:

Camera/Image
→ Secure upload
→ Convex server-side action
→ NVIDIA API
→ MiniMax M3
→ Structured waste classification
→ Validation layer
→ Segregation Rule Engine
→ Decision
→ Convex event record
→ Alert generation
→ Real-time dashboard update
→ Human review

The AI model is responsible for visual understanding.

The AI model must NOT be solely responsible for deciding whether disposal is correct.

Responsibilities must be separated:

### MiniMax M3
Identifies visible objects and returns:
- Waste class
- Confidence estimate
- Visual description
- Risk indicators
- Multiple objects when visible
- Uncertainty
- Image quality notes

### Application Rule Engine
Determines:
- Whether the detected class is allowed in the selected bin
- Whether it is prohibited
- Whether it is critical
- Whether human review is required
- Alert severity

### Human Supervisor
Makes the final reviewed decision:
- Confirmed violation
- Correct disposal
- Unable to determine
- False detection
- Wrong classification
- Test event

---

# 4. NVIDIA VISION INTEGRATION

Create a dedicated Convex action such as:

`analyzeWasteImage`

The action should:
1. Receive an image reference or supported image input.
2. Validate file type and size.
3. Construct the NVIDIA API request.
4. Send the image and a strict waste-analysis instruction to MiniMax M3.
5. Request structured JSON output.
6. Parse the response.
7. Validate the returned structure.
8. Normalize waste class names.
9. Store analysis metadata.
10. Pass the normalized result to the segregation rule engine.
11. Create or update the disposal event.
12. Generate an alert when required.
13. Return the final result to the frontend.

Use Axios or fetch server-side.

Conceptual endpoint:

```ts
const invokeUrl =
  "https://integrate.api.nvidia.com/v1/chat/completions";
```

Authorization:

```ts
Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`
```

Never use:

```ts
Authorization: "Bearer $NVIDIA_API_KEY"
```

as a literal runtime credential.

Use the environment variable value securely.

The exact multimodal image payload must follow the currently supported NVIDIA API format for this model. Keep the image-message construction isolated in one adapter function so it can be changed without modifying the rest of the application.

Create:

`convex/lib/nvidiaVision.ts`

Responsibilities:
- Build multimodal messages
- Call NVIDIA API
- Parse responses
- Handle timeouts
- Handle malformed responses
- Retry transient failures
- Normalize model output

---

# 5. AI SYSTEM PROMPT

Use a strict prompt similar to:

"You are the visual classification component of a medical waste monitoring system.

Analyze only what is visually observable in the provided image.

Identify medical or general waste objects visible near the waste-bin disposal area.

Do not infer infection, contamination, chemical composition, radioactivity, patient identity, or medical history from appearance.

Return only valid JSON.

Use only the allowed waste classes supplied by the application.

If the object cannot be identified reliably, classify it as UNKNOWN_ITEM.

If multiple objects are visible, return each object separately.

For each detection provide:
- class
- confidence
- visual_description
- risk_indicator
- uncertainty_reason

Also provide:
- primary_class
- overall_confidence
- image_quality
- requires_review

Never decide whether the disposal is correct or incorrect. The application rule engine handles segregation decisions."

---

# 6. STRUCTURED AI OUTPUT

Normalize AI output to:

```json
{
  "primaryClass": "SYRINGE",
  "overallConfidence": 0.93,
  "imageQuality": "GOOD",
  "requiresReview": false,
  "detections": [
    {
      "class": "SYRINGE",
      "confidence": 0.93,
      "visualDescription": "Disposable syringe-like object",
      "riskIndicator": "SHARP",
      "uncertaintyReason": null
    }
  ]
}
```

Allowed primary classes:
- SYRINGE
- NEEDLE_SHARP
- GLOVES
- FACE_MASK
- GAUZE_DRESSING
- MEDICINE_VIAL
- AMPOULE
- PLASTIC_BOTTLE
- MEDICAL_CONTAINER
- PAPER_PACKAGING
- GENERAL_WASTE
- UNKNOWN_ITEM

Never trust arbitrary class names directly from model output.

Map model responses into this controlled enum.

If parsing fails:
- Mark AI analysis as FAILED
- Preserve the event
- Do not invent a classification
- Route the event to review when appropriate
- Show a recoverable analysis status

---

# 7. CONFIDENCE POLICY

Suggested UI policy:
- 0.85–1.00: High confidence
- 0.65–0.84: Medium confidence
- 0.40–0.64: Low confidence
- Below 0.40: Unknown / review

These values are product thresholds, not scientifically calibrated probabilities.

Critical classes such as visible syringes or sharps may use configurable lower alert thresholds.

All thresholds must be configurable through segregation rules.

---

# 8. IMAGE ANALYSIS EXPERIENCE

Provide a real image-analysis workflow.

Users with appropriate access should be able to:
- Select or upload a waste-event image
- Select the associated facility
- Select department
- Select bin
- Submit for analysis

Show processing stages:
1. Event received
2. Image analysis in progress
3. Object identified
4. Segregation rules evaluated
5. Decision generated
6. Event recorded

Do not expose chain-of-thought or internal model reasoning.

Show only operational statuses.

After analysis display:
- Image
- Detected object
- Confidence
- Risk indicator
- Selected bin
- Expected bin category if relevant
- Rule result
- Severity
- Review requirement

Example:

Detected Object:
Syringe

AI Confidence:
93%

Selected Bin:
General Waste GW-12

Rule Result:
Critical Violation

Expected Waste Stream:
Sharps

Status:
Requires Supervisor Review

Use wording such as:
"Possible syringe detected"

before human confirmation.

After confirmation:
"Confirmed segregation violation"

---

# 9. DESIGN PHILOSOPHY

Communicate:
- Safety
- Intelligence
- Reliability
- Medical compliance
- Real-time monitoring
- Operational control
- Enterprise readiness

Use:
- Dark sidebar
- Light main workspace
- Clean cards
- Subtle borders
- Soft shadows
- Rounded corners
- Professional typography
- Strong information hierarchy

Semantic states:
- Green: healthy / correct / online
- Amber: warning / probable violation
- Red: critical / sharps / device failure
- Blue: informational
- Gray: offline / unknown

Do not rely on color alone.

---

# 10. APPLICATION IDENTITY

Product:
MedWaste AI

Subtitle:
Intelligent Medical Waste Monitoring & Compliance Platform

Sidebar branding:
MedWaste AI
AI-Powered Waste Intelligence

---

# 11. GLOBAL NAVIGATION

Sidebar:
- Overview
- Live Monitoring
- Analyze Waste
- Alerts
- Disposal Events
- Bins
- Facilities
- Device Health
- Analytics
- Reports
- Segregation Rules
- AI Performance
- Audit Logs
- Settings

Top bar:
- Facility selector
- Department selector
- Global search
- Notifications
- System health
- User avatar

---

# 12. OVERVIEW DASHBOARD

Route:
`/dashboard`

Header:
"Good morning, Operations Team"

Subtitle:
"Here's what's happening across your medical waste network."

KPI cards:
- Monitored Bins: 48
- Active Critical Alerts: 3
- Bins Near Capacity: 7
- Events Today: 1,284
- Confirmed Violations: 18
- Average Response Time: 2m 14s

All values should come from Convex queries.

Include operational status by:
- Emergency
- ICU
- Surgery
- Pathology Lab
- General Ward
- Radiology
- Pharmacy
- Outpatient Department

Each shows:
- Bins
- Online devices
- Alerts
- Capacity warnings
- Compliance percentage

---

# 13. REAL-TIME ACTIVITY FEED

Show events with timestamps.

Examples:

Correct Disposal
Syringe detected
Sharps Container SC-04
Confidence: 96%
Emergency Department

CRITICAL VIOLATION
Possible syringe detected in General Waste
Bin GW-12
Confidence: 93%
ICU

Bin Capacity Warning
Bin BW-07
Fill Level: 87%
Surgery

Device Reconnected
EDGE-022
Pathology Lab

Use Convex subscriptions so new records update instantly.

---

# 14. LIVE MONITORING

Route:
`/monitoring`

Grid of monitored stations.

Each card:
- Preview area
- Bin name
- Bin ID
- Department
- Waste stream
- Fill level
- Device connection
- Camera health
- Sensor health
- Last detection
- AI status

Overlay:
- AI Monitoring Active
- Analysis latency
- Model: MiniMax M3
- Last detection
- Confidence

When an analyzed event exists, show a visual detection overlay or labeled region if coordinate data is available.

Do not fabricate bounding-box coordinates when the model does not provide reliable coordinates.

---

# 15. ANALYZE WASTE PAGE

Route:
`/analyze`

Create a polished image-analysis workspace.

Inputs:
- Facility
- Department
- Bin
- Waste-event image

Action:
Analyze Waste

On submission:
- Upload image securely
- Call Convex action
- Convex calls NVIDIA MiniMax M3
- Parse structured result
- Evaluate segregation rules
- Save event
- Generate alert if necessary
- Navigate to event result

Provide:
- Loading state
- Timeout handling
- API failure state
- Invalid image state
- Retry action

Never expose API keys or raw provider errors to normal users.

---

# 16. DECISION STATES

Support:
- CORRECT
- PROBABLE_VIOLATION
- CRITICAL_VIOLATION
- LOW_CONFIDENCE_REVIEW
- UNKNOWN_ITEM
- AI_ANALYSIS_FAILED
- SENSOR_ERROR
- BIN_CAPACITY_WARNING
- DEVICE_OFFLINE
- CAMERA_OBSTRUCTION
- DEVICE_RECONNECTED

---

# 17. RULE ENGINE

Rules are configurable per facility.

Each rule:
- Rule ID
- Facility
- Bin Type
- Waste Class
- Result
- Severity
- Minimum Confidence
- Effective date
- Status

Example:

Waste:
SYRINGE

Bin:
GENERAL_WASTE

Minimum Confidence:
0.75

Decision:
CRITICAL_VIOLATION

Severity:
CRITICAL

The rule engine, not MiniMax M3, makes this decision.

---

# 18. CRITICAL ALERT EXPERIENCE

For a critical event show:

CRITICAL SEGREGATION ALERT

Possible syringe detected in General Waste Bin GW-12.

ICU — Station 2

AI Confidence: 93%

Actions:
- Review Event
- Acknowledge

Immediately:
- Add alert
- Update dashboard KPI
- Update activity feed
- Update event history
- Update relevant bin status

---

# 19. ALERT MANAGEMENT

Route:
`/alerts`

Statistics:
- Critical
- High
- Medium
- Low
- Unreviewed
- Resolved Today

Filters:
- Facility
- Department
- Severity
- Waste Class
- Review Status
- Date
- Confidence
- Bin
- Device
- Search

Table:
- Time
- Severity
- Location
- Bin
- Detected Object
- Confidence
- Status
- Waiting Time
- Assigned To
- Actions

---

# 20. EVENT DETAIL

Route:
`/events/:eventId`

Show:
- Event image
- Detection label
- Confidence
- Timestamp
- Detected class
- Bin
- Expected waste stream
- Decision
- Severity
- Department
- Device
- Model
- Fill level
- AI analysis status
- Rule applied

Review controls:
- Confirmed Violation
- Correct Disposal
- Unable to Determine
- False Detection
- Wrong Classification
- Test Event

Wrong Classification allows corrected class selection.

Fields:
- Review notes
- Corrective action
- Reviewer

---

# 21. EVENT TIMELINE

Example:
- Waste disposal event received
- Image captured/uploaded
- MiniMax M3 analysis started
- Possible syringe identified — 93%
- Segregation rule evaluated
- Critical violation generated
- Alert created
- Alert acknowledged
- Supervisor review completed

Store timestamps where possible.

Do not invent exact processing timestamps that were never recorded.

---

# 22. DISPOSAL EVENTS

Route:
`/events`

Support:
- Correct
- Violations
- Unknown
- Low confidence
- AI analysis failed
- Reviewed

Filters:
- Date
- Facility
- Department
- Bin
- Waste class
- Decision
- Confidence
- Review status

---

# 23. BINS

Route:
`/bins`

Each bin:
- Name
- ID
- Department
- Type
- Waste stream
- Fill level
- Status
- Device
- Last collection
- Last disposal
- Open alerts

Fill states:
- 0–20% Empty
- 21–69% Normal
- 70–89% Almost Full
- 90–100% Critical

Thresholds configurable.

---

# 24. BIN DETAIL

Show:
- Current fill
- Fill history
- Recent events
- Waste distribution
- Alerts
- Device
- Collection history
- Rules

Admin configuration:
- Warning threshold
- Critical threshold
- Device
- Waste stream
- Allowed classes
- Prohibited classes
- Critical classes

---

# 25. DEVICE HEALTH

Route:
`/devices`

KPIs:
- Total
- Online
- Offline
- Warnings
- Camera Issues
- Sensor Issues

Device fields:
- Device ID
- Bin
- Location
- Connection
- Last heartbeat
- Camera
- Trigger sensor
- Fill sensor
- Storage
- Software version
- AI integration version
- Queue depth

Device detail actions:
- Restart Device
- Run Health Check
- Test Camera
- Test Sensors
- Sync Configuration

For the prototype, these actions update operational state in Convex.

---

# 26. FACILITIES

Route:
`/facilities`

Seed three realistic facilities.

Each:
- Departments
- Bins
- Devices
- Events today
- Active alerts
- Compliance score
- Device uptime

---

# 27. RULE MATRIX

Route:
`/rules`

Rows:
Waste classes

Columns:
Bin types

States:
- Allowed
- Warning
- Prohibited
- Critical

Allow editing.

Never assume universal bin-color rules.

---

# 28. ANALYTICS

Route:
`/analytics`

Include:
- Disposal Events Over Time
- Violations Over Time
- Waste Category Distribution
- Violations by Department
- Violations by Bin
- Critical Sharps Incidents
- Alert Response Time
- Bin Fill Trends
- Device Uptime
- AI Confidence Distribution
- Confirmed vs Dismissed Alerts

Filters:
- Today
- 7 Days
- 30 Days
- 90 Days
- Custom
- Facility
- Department

---

# 29. AI PERFORMANCE

Route:
`/ai-performance`

Show:
- Provider: NVIDIA
- Model: MiniMax M3
- Model identifier: minimaxai/minimax-m3
- Total analyses
- Successful analyses
- Failed analyses
- Average response latency
- Average returned confidence
- Reviewed events
- Confirmed detections
- Corrected classifications
- False alert rate

Class metrics:
- Detection count
- Average confidence
- Human confirmation rate
- Correction rate
- Review rate

Do not describe model-generated confidence as calibrated accuracy.

Do not claim clinical or regulatory validation.

---

# 30. REPORTS

Route:
`/reports`

Reports:
- Daily Operations Summary
- Weekly Compliance Summary
- Waste Segregation Report
- Critical Incident Report
- Bin Capacity Report
- Device Uptime Report
- AI Performance Report
- Audit Trail Report

Actions:
- Generate
- Preview
- Download PDF
- Export CSV

---

# 31. COMPLIANCE

Show:
- Overall segregation compliance
- Correct disposals
- Confirmed violations
- Critical violations
- Review completion
- Response time
- Device coverage
- Trend

Do not claim regulatory certification.

---

# 32. AUDIT LOG

Route:
`/audit`

Track:
- Login
- Alert acknowledgment
- Event review
- Classification correction
- Rule creation/modification
- Device configuration
- Report generation
- Data export
- AI analysis request status

Fields:
- Timestamp
- Actor
- Role
- Action
- Resource
- Before
- After
- IP address where available
- Status

---

# 33. USER ROLES

Support:
- Waste Operator
- Waste Management Supervisor
- Compliance Officer
- Facility Administrator
- Maintenance Technician
- AI Administrator

Implement role-aware navigation and actions.

---

# 34. CONVEX SCHEMA

Create tables:
- facilities
- locations
- departments
- bins
- binTypes
- devices
- wasteClasses
- segregationRules
- disposalEvents
- detections
- aiAnalyses
- alerts
- reviews
- users
- auditLogs
- deviceHeartbeats
- fillLevelReadings
- notifications
- reportJobs
- modelVersions

`aiAnalyses` should include:
- eventId
- provider
- model
- status
- primaryClass
- overallConfidence
- imageQuality
- requiresReview
- rawResponseReference if safely retained
- latencyMs
- errorCode
- createdAt
- completedAt

Do not store secrets.

---

# 35. REAL-TIME CONVEX BEHAVIOR

New event:
- Update KPIs
- Activity feed
- Bin timestamp
- Alert queue
- Analytics
- Notifications

Fill change:
- Update bin immediately

Device offline:
- Update device
- Create alert
- Update facility health

Review:
- Update event
- Update alert
- Update analytics
- Update AI performance
- Update audit history
- Update compliance metrics

---

# 36. OPERATIONAL EVENT CONTROLS

Because physical IoT hardware is outside the prototype scope, provide discreet presentation controls for operational states that do not require image classification, including:
- Bin Capacity Warning
- Device Offline
- Camera Obstruction
- Device Reconnected
- Sensor Fault

For waste classification demonstrations, prefer the real Analyze Waste workflow using an uploaded image and MiniMax M3.

Do not create random fake AI classification results when an image is being analyzed.

If the NVIDIA request fails, show an analysis failure/retry state instead of fabricating a successful detection.

---

# 37. NOTIFICATIONS

Categories:
- Critical Alerts
- Waste Violations
- Capacity Warnings
- Device Warnings
- System Notifications

Actions:
- Mark read
- Mark all read
- Open event
- Open device
- Filter

---

# 38. GLOBAL SEARCH

Search:
- Events
- Bins
- Devices
- Facilities
- Alerts
- Waste classes

Example `GW-12` returns:
- Bin
- Alerts
- Events
- Device

---

# 39. COMMAND PALETTE

Ctrl/Cmd + K

Commands:
- Dashboard
- Analyze Waste
- Critical Alerts
- Search Bin
- Search Device
- Generate Report
- Offline Devices

---

# 40. UX STATES

Implement:
- Skeleton loaders
- Empty states
- Connection errors
- NVIDIA analysis failure
- Invalid image
- Image unavailable
- Device offline
- Sensor error
- Camera unavailable
- Retry actions

Never show blank screens.

---

# 41. RESPONSIVE DESIGN

Primary: desktop/laptop.

Also support:
- Tablet
- Mobile

Mobile:
- Collapsed sidebar
- Stacked KPIs
- Responsive tables
- Critical alerts remain prominent

---

# 42. SEED DATA

Seed Convex with:
- 3 facilities
- 8 departments
- 48 bins
- 48 devices
- 10+ waste classes
- 20+ rules
- 500+ historical events
- 30+ alerts
- Heartbeat history
- Fill history
- Reviews
- Audit logs
- Model metadata

At least 30 days of historical operational data.

Historical seed data is for dashboard presentation and analytics.

Do not label it as simulation data in the UI.

Ensure realistic variation:
- Weekdays
- Departments
- Downtime
- Fill patterns
- Confidence
- Violation frequency

---

# 43. IDENTIFIERS

Use visible IDs:
- EVT-20260717-18472
- ALT-20260717-0412
- BIN-GW-012
- BIN-SH-004
- EDGE-ICU-012
- RULE-SHARP-001
- FAC-001

Use Convex IDs internally.

---

# 44. SECURITY

NVIDIA_API_KEY:
- Server-side only
- Environment variable
- Never returned to frontend
- Never logged
- Never committed

Image handling:
- Validate MIME type
- Validate size
- Restrict access
- Use expiring URLs where applicable
- Record image access where implemented

Application:
- Role-based access
- Audit actions
- Safe error messages

---

# 45. PRIVACY

Design principles:
- Event-based image analysis
- No facial recognition
- No staff identification
- Avoid patient areas
- Avoid badges and readable identifiers
- Configurable image retention
- Metadata may have separate retention
- Role-restricted image access

Do not infer:
- Infection
- Contamination
- Patient identity
- Medical condition
- Chemical composition
- Radioactivity

from visual appearance alone.

---

# 46. MICRO-INTERACTIONS

Use subtle animations for:
- New alerts
- New events
- Status changes
- Progress
- Notifications
- Drawers
- Modals

Do not over-animate.

---

# 47. ACCESSIBILITY

Ensure:
- Good contrast
- Keyboard navigation
- ARIA labels
- Accessible forms
- Visible focus
- Text labels in addition to colors

---

# 48. SETTINGS

Route:
`/settings`

Sections:
- General
- Facilities
- Users
- Roles
- Notifications
- Devices
- AI Integration
- Data Retention
- Security
- Integrations

AI Integration section:
- Provider: NVIDIA
- Model: MiniMax M3
- Connection status
- Last successful analysis
- Average latency
- Analysis failures
- Test connection action

Never display the API key value.

---

# 49. APPLICATION QUALITY

All major controls must work:
- Navigation
- Filters
- Search
- Modals
- Drawers
- Sorting
- Pagination
- Reviews
- Alert acknowledgment
- Bin configuration
- Rule editing
- Device state actions
- Report previews
- Image analysis

Avoid dead buttons.

---

# 50. CODE QUALITY

Use:
- Reusable components
- Feature folders
- Shared utilities
- Central constants
- TypeScript interfaces
- Clean Convex queries/mutations/actions
- Reusable charts
- Status badges
- Tables
- Modals
- Filters

Avoid:
- Massive App.tsx
- Duplicate components
- Repeated hardcoded UI
- Inline styling everywhere
- Exposed secrets

---

# 51. PROJECT STRUCTURE

Suggested:

src/
  components/
    layout/
    dashboard/
    monitoring/
    vision/
    alerts/
    events/
    bins/
    devices/
    analytics/
    reports/
    rules/
    audit/
    shared/
  pages/
  hooks/
  lib/
  utils/
  constants/
  types/

convex/
  schema.ts
  facilities.ts
  bins.ts
  devices.ts
  events.ts
  alerts.ts
  reviews.ts
  analytics.ts
  rules.ts
  audit.ts
  vision.ts
  seed.ts
  lib/
    nvidiaVision.ts
    wasteClassNormalizer.ts
    segregationEngine.ts

---

# 52. IMPLEMENTATION ORDER

1. Vite + React + TypeScript
2. Tailwind
3. Convex setup
4. Schema
5. Seed data
6. App shell
7. Dashboard
8. NVIDIA server-side vision adapter
9. Analyze Waste workflow
10. Rule engine
11. Event persistence
12. Real-time alerts
13. Event detail/review
14. Live monitoring
15. Bins
16. Devices
17. Facilities
18. Rules
19. Analytics
20. AI performance
21. Reports
22. Audit
23. Settings
24. Responsive polish
25. Error handling
26. Security review

---

# 53. PRIMARY DEMONSTRATION FLOW

The strongest flow:

1. User opens dashboard.
2. Hospital operations appear active.
3. User opens Analyze Waste.
4. User selects facility, department, and bin.
5. User uploads a waste-event image.
6. Image is securely submitted.
7. Convex server-side action calls NVIDIA MiniMax M3.
8. MiniMax M3 identifies the visible waste class.
9. Structured output is validated.
10. Rule engine checks the selected bin.
11. A possible syringe in General Waste produces a Critical Violation.
12. Convex saves the event and alert.
13. Real-time dashboard updates.
14. Critical notification appears.
15. User opens Review Event.
16. Event detail shows image, AI class, confidence, rule, and severity.
17. Supervisor confirms or corrects the event.
18. Review is saved.
19. Alert resolves.
20. Compliance metrics update.
21. AI performance metrics update.
22. Audit log records the action.

This flow must be seamless.

---

# 54. SAFETY LANGUAGE

Before review use:
- Possible syringe detected
- Probable segregation violation
- AI confidence
- Requires supervisor review

After review:
- Confirmed segregation violation
- Confirmed by reviewer

Never present uncertain AI output as guaranteed fact.

---

# 55. PRODUCT POSITIONING

Position as:
- AI-powered medical waste intelligence
- Real-time segregation monitoring
- Smart bin infrastructure
- Safety monitoring
- Compliance decision support
- Waste operations intelligence

The system provides:
- Detection
- Monitoring
- Alerts
- Evidence
- Analytics
- Decision support

Humans make final reviewed decisions.

---

# 56. FINAL QUALITY BAR

Before completion verify:
- Commercially polished UI
- Navigation works
- Convex works
- NVIDIA integration is server-side
- API key is protected
- Real image analysis works
- Structured output validation exists
- Rule engine is separate from AI
- AI failures never produce fabricated detections
- Real-time updates work
- Alerts acknowledge
- Reviews work
- Bins update
- Devices update
- Rules edit
- Charts contain meaningful data
- Reports preview
- Search works
- Filters work
- No dead buttons
- No lorem ipsum
- No generic template branding
- No "simulation", "simulated", "fake", "mock", or "dummy" terminology in normal UI
- No claims of regulatory certification
- No claims of guaranteed detection
- No universal hardcoded biomedical waste rules

The finished product must feel like a real AI-powered healthcare waste monitoring platform built with React, Convex, and NVIDIA MiniMax M3 vision analysis.
