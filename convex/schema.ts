import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  facilities: defineTable({
    name: v.string(),
    code: v.string(),
    location: v.string(),
    departments: v.array(v.string()),
    bins: v.number(),
    devices: v.number(),
    eventsToday: v.number(),
    activeAlerts: v.number(),
    complianceScore: v.number(),
    deviceUptime: v.number(),
  }),

  bins: defineTable({
    name: v.string(),
    binId: v.string(),
    facilityId: v.id('facilities'),
    department: v.string(),
    type: v.union(
      v.literal('GENERAL_WASTE'), v.literal('SHARPS'), v.literal('INFECTIOUS'),
      v.literal('PHARMACEUTICAL'), v.literal('CHEMICAL'), v.literal('RECYCLABLE'),
    ),
    wasteStream: v.string(),
    fillLevel: v.number(),
    status: v.string(),
    deviceId: v.optional(v.string()),
    lastCollection: v.optional(v.number()),
    lastDisposal: v.optional(v.number()),
    openAlerts: v.number(),
    warningThreshold: v.number(),
    criticalThreshold: v.number(),
  }),

  devices: defineTable({
    deviceId: v.string(),
    binId: v.optional(v.id('bins')),
    facilityId: v.id('facilities'),
    department: v.string(),
    connection: v.union(v.literal('ONLINE'), v.literal('OFFLINE'), v.literal('WARNING')),
    lastHeartbeat: v.number(),
    camera: v.string(),
    triggerSensor: v.string(),
    fillSensor: v.string(),
    storage: v.string(),
    softwareVersion: v.string(),
    aiIntegrationVersion: v.string(),
    queueDepth: v.number(),
  }),

  wasteClasses: defineTable({
    name: v.string(),
    category: v.string(),
    riskIndicator: v.string(),
    requiresReview: v.boolean(),
  }),

  segregationRules: defineTable({
    ruleId: v.string(),
    facilityId: v.id('facilities'),
    binType: v.union(
      v.literal('GENERAL_WASTE'), v.literal('SHARPS'), v.literal('INFECTIOUS'),
      v.literal('PHARMACEUTICAL'), v.literal('CHEMICAL'), v.literal('RECYCLABLE'),
    ),
    wasteClass: v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    ),
    result: v.union(
      v.literal('CORRECT'), v.literal('PROBABLE_VIOLATION'), v.literal('CRITICAL_VIOLATION'),
      v.literal('LOW_CONFIDENCE_REVIEW'), v.literal('UNKNOWN_ITEM'),
    ),
    severity: v.union(
      v.literal('CRITICAL'), v.literal('HIGH'), v.literal('MEDIUM'), v.literal('LOW'), v.literal('INFO'),
    ),
    minimumConfidence: v.number(),
    effectiveDate: v.number(),
    status: v.union(v.literal('ACTIVE'), v.literal('INACTIVE')),
  }),

  disposalEvents: defineTable({
    eventId: v.string(),
    facilityId: v.id('facilities'),
    department: v.string(),
    binId: v.id('bins'),
    deviceId: v.optional(v.id('devices')),
    imageStoragePath: v.optional(v.string()),
    aiAnalysisId: v.optional(v.id('aiAnalyses')),
    decision: v.union(
      v.literal('CORRECT'), v.literal('PROBABLE_VIOLATION'), v.literal('CRITICAL_VIOLATION'),
      v.literal('LOW_CONFIDENCE_REVIEW'), v.literal('UNKNOWN_ITEM'), v.literal('AI_ANALYSIS_FAILED'),
      v.literal('SENSOR_ERROR'), v.literal('BIN_CAPACITY_WARNING'), v.literal('DEVICE_OFFLINE'),
      v.literal('CAMERA_OBSTRUCTION'), v.literal('DEVICE_RECONNECTED'),
    ),
    severity: v.optional(v.union(
      v.literal('CRITICAL'), v.literal('HIGH'), v.literal('MEDIUM'), v.literal('LOW'), v.literal('INFO'),
    )),
    detectedClass: v.optional(v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    )),
    confidence: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    reviewDecision: v.optional(v.union(
      v.literal('CONFIRMED_VIOLATION'), v.literal('CORRECT_DISPOSAL'),
      v.literal('UNABLE_TO_DETERMINE'), v.literal('FALSE_DETECTION'),
      v.literal('WRONG_CLASSIFICATION'), v.literal('TEST_EVENT'),
    )),
    reviewNotes: v.optional(v.string()),
    correctiveAction: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  aiAnalyses: defineTable({
    eventId: v.id('disposalEvents'),
    provider: v.string(),
    model: v.string(),
    status: v.union(v.literal('PENDING'), v.literal('IN_PROGRESS'), v.literal('COMPLETED'), v.literal('FAILED')),
    primaryClass: v.optional(v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    )),
    overallConfidence: v.optional(v.number()),
    imageQuality: v.optional(v.union(v.literal('GOOD'), v.literal('FAIR'), v.literal('POOR'))),
    requiresReview: v.optional(v.boolean()),
    latencyMs: v.optional(v.number()),
    errorCode: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),

  alerts: defineTable({
    alertId: v.string(),
    eventId: v.optional(v.id('disposalEvents')),
    facilityId: v.id('facilities'),
    department: v.string(),
    binId: v.optional(v.id('bins')),
    deviceId: v.optional(v.id('devices')),
    severity: v.union(
      v.literal('CRITICAL'), v.literal('HIGH'), v.literal('MEDIUM'), v.literal('LOW'), v.literal('INFO'),
    ),
    status: v.union(v.literal('OPEN'), v.literal('ACKNOWLEDGED'), v.literal('RESOLVED')),
    title: v.string(),
    description: v.string(),
    detectedClass: v.optional(v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    )),
    confidence: v.optional(v.number()),
    acknowledgedBy: v.optional(v.string()),
    acknowledgedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  reviews: defineTable({
    eventId: v.id('disposalEvents'),
    reviewer: v.string(),
    role: v.union(
      v.literal('WASTE_OPERATOR'), v.literal('SUPERVISOR'), v.literal('COMPLIANCE_OFFICER'),
      v.literal('FACILITY_ADMIN'), v.literal('MAINTENANCE_TECH'), v.literal('AI_ADMIN'),
    ),
    decision: v.union(
      v.literal('CONFIRMED_VIOLATION'), v.literal('CORRECT_DISPOSAL'),
      v.literal('UNABLE_TO_DETERMINE'), v.literal('FALSE_DETECTION'),
      v.literal('WRONG_CLASSIFICATION'), v.literal('TEST_EVENT'),
    ),
    correctedClass: v.optional(v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    )),
    notes: v.optional(v.string()),
    correctiveAction: v.optional(v.string()),
    createdAt: v.number(),
  }),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal('WASTE_OPERATOR'), v.literal('SUPERVISOR'), v.literal('COMPLIANCE_OFFICER'),
      v.literal('FACILITY_ADMIN'), v.literal('MAINTENANCE_TECH'), v.literal('AI_ADMIN'),
    ),
    facilityId: v.optional(v.id('facilities')),
    avatar: v.optional(v.string()),
  }),

  auditLogs: defineTable({
    timestamp: v.number(),
    actor: v.string(),
    role: v.string(),
    action: v.string(),
    resource: v.string(),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    status: v.string(),
  }),

  deviceHeartbeats: defineTable({
    deviceId: v.id('devices'),
    timestamp: v.number(),
    connection: v.union(v.literal('ONLINE'), v.literal('OFFLINE'), v.literal('WARNING')),
  }),

  fillLevelReadings: defineTable({
    binId: v.id('bins'),
    timestamp: v.number(),
    fillLevel: v.number(),
  }),

  notifications: defineTable({
    category: v.union(
      v.literal('CRITICAL_ALERT'), v.literal('WASTE_VIOLATION'),
      v.literal('CAPACITY_WARNING'), v.literal('DEVICE_WARNING'), v.literal('SYSTEM'),
    ),
    title: v.string(),
    description: v.string(),
    read: v.boolean(),
    resourceId: v.optional(v.string()),
    resourceType: v.optional(v.string()),
    createdAt: v.number(),
  }),

  reportJobs: defineTable({
    type: v.string(),
    status: v.union(v.literal('PENDING'), v.literal('GENERATING'), v.literal('COMPLETED'), v.literal('FAILED')),
    parameters: v.any(),
    resultPath: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),

  modelVersions: defineTable({
    provider: v.string(),
    model: v.string(),
    version: v.string(),
    deployedAt: v.number(),
    status: v.union(v.literal('ACTIVE'), v.literal('INACTIVE'), v.literal('DEPRECATED')),
  }),
})
