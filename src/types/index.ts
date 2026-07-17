export type WasteClass =
  | 'SYRINGE'
  | 'NEEDLE_SHARP'
  | 'GLOVES'
  | 'FACE_MASK'
  | 'GAUZE_DRESSING'
  | 'MEDICINE_VIAL'
  | 'AMPOULE'
  | 'PLASTIC_BOTTLE'
  | 'MEDICAL_CONTAINER'
  | 'PAPER_PACKAGING'
  | 'GENERAL_WASTE'
  | 'UNKNOWN_ITEM'

export type BinType = 'GENERAL_WASTE' | 'SHARPS' | 'INFECTIOUS' | 'PHARMACEUTICAL' | 'CHEMICAL' | 'RECYCLABLE'

export type Decision =
  | 'CORRECT'
  | 'PROBABLE_VIOLATION'
  | 'CRITICAL_VIOLATION'
  | 'LOW_CONFIDENCE_REVIEW'
  | 'UNKNOWN_ITEM'
  | 'AI_ANALYSIS_FAILED'
  | 'SENSOR_ERROR'
  | 'BIN_CAPACITY_WARNING'
  | 'DEVICE_OFFLINE'
  | 'CAMERA_OBSTRUCTION'
  | 'DEVICE_RECONNECTED'

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'

export type ReviewDecision =
  | 'CONFIRMED_VIOLATION'
  | 'CORRECT_DISPOSAL'
  | 'UNABLE_TO_DETERMINE'
  | 'FALSE_DETECTION'
  | 'WRONG_CLASSIFICATION'
  | 'TEST_EVENT'

export type DeviceConnection = 'ONLINE' | 'OFFLINE' | 'WARNING'

export type FillLevel = 'EMPTY' | 'NORMAL' | 'ALMOST_FULL' | 'CRITICAL'

export type AIAnalysisStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export type ImageQuality = 'GOOD' | 'FAIR' | 'POOR'

export type RiskIndicator = 'SHARP' | 'INFECTIOUS' | 'PHARMACEUTICAL' | 'CHEMICAL' | 'GENERAL' | 'UNKNOWN'

export type UserRole =
  | 'WASTE_OPERATOR'
  | 'SUPERVISOR'
  | 'COMPLIANCE_OFFICER'
  | 'FACILITY_ADMIN'
  | 'MAINTENANCE_TECH'
  | 'AI_ADMIN'

export interface Detection {
  class: WasteClass
  confidence: number
  visualDescription: string
  riskIndicator: RiskIndicator
  uncertaintyReason: string | null
}

export interface AIAnalysisResult {
  primaryClass: WasteClass
  overallConfidence: number
  imageQuality: ImageQuality
  requiresReview: boolean
  detections: Detection[]
}

export interface AIAnalysisRecord {
  _id: string
  eventId: string
  provider: string
  model: string
  status: AIAnalysisStatus
  primaryClass?: WasteClass
  overallConfidence?: number
  imageQuality?: ImageQuality
  requiresReview?: boolean
  latencyMs?: number
  errorCode?: string
  createdAt: number
  completedAt?: number
}

export interface Facility {
  _id: string
  name: string
  code: string
  location: string
  departments: string[]
  bins: number
  devices: number
  eventsToday: number
  activeAlerts: number
  complianceScore: number
  deviceUptime: number
}

export interface Bin {
  _id: string
  name: string
  binId: string
  facilityId: string
  department: string
  type: BinType
  wasteStream: string
  fillLevel: number
  status: string
  deviceId?: string
  lastCollection?: number
  lastDisposal?: number
  openAlerts: number
  warningThreshold: number
  criticalThreshold: number
}

export interface Device {
  _id: string
  deviceId: string
  binId?: string
  facilityId: string
  department: string
  connection: DeviceConnection
  lastHeartbeat: number
  camera: string
  triggerSensor: string
  fillSensor: string
  storage: string
  softwareVersion: string
  aiIntegrationVersion: string
  queueDepth: number
}

export interface SegregationRule {
  _id: string
  ruleId: string
  facilityId: string
  binType: BinType
  wasteClass: WasteClass
  result: Decision
  severity: Severity
  minimumConfidence: number
  effectiveDate: number
  status: 'ACTIVE' | 'INACTIVE'
}

export interface DisposalEvent {
  _id: string
  eventId: string
  facilityId: string
  department: string
  binId: string
  deviceId?: string
  imageStoragePath?: string
  aiAnalysisId?: string
  decision: Decision
  severity?: Severity
  detectedClass?: WasteClass
  confidence?: number
  reviewedBy?: string
  reviewDecision?: ReviewDecision
  reviewNotes?: string
  correctiveAction?: string
  reviewedAt?: number
  createdAt: number
}

export interface Alert {
  _id: string
  alertId: string
  eventId?: string
  facilityId: string
  department: string
  binId?: string
  deviceId?: string
  severity: Severity
  status: AlertStatus
  title: string
  description: string
  detectedClass?: WasteClass
  confidence?: number
  acknowledgedBy?: string
  acknowledgedAt?: number
  resolvedBy?: string
  resolvedAt?: number
  createdAt: number
}

export interface Review {
  _id: string
  eventId: string
  reviewer: string
  role: UserRole
  decision: ReviewDecision
  correctedClass?: WasteClass
  notes?: string
  correctiveAction?: string
  createdAt: number
}

export interface AuditLog {
  _id: string
  timestamp: number
  actor: string
  role: string
  action: string
  resource: string
  before?: any
  after?: any
  ipAddress?: string
  status: string
}

export interface Notification {
  _id: string
  category: 'CRITICAL_ALERT' | 'WASTE_VIOLATION' | 'CAPACITY_WARNING' | 'DEVICE_WARNING' | 'SYSTEM'
  title: string
  description: string
  read: boolean
  resourceId?: string
  resourceType?: string
  createdAt: number
}
