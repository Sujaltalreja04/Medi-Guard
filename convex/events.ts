import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('disposalEvents').order('desc').collect()
  },
})

export const getById = query({
  args: { id: v.id('disposalEvents') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getByEventId = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('disposalEvents').filter((q) => q.eq(q.field('eventId'), args.eventId)).first()
  },
})

export const create = mutation({
  args: {
    eventId: v.string(),
    facilityId: v.id('facilities'),
    department: v.string(),
    binId: v.id('bins'),
    deviceId: v.optional(v.id('devices')),
    imageStoragePath: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('disposalEvents', { ...args, createdAt: Date.now() })
  },
})

export const updateReview = mutation({
  args: {
    id: v.id('disposalEvents'),
    reviewDecision: v.union(
      v.literal('CONFIRMED_VIOLATION'), v.literal('CORRECT_DISPOSAL'),
      v.literal('UNABLE_TO_DETERMINE'), v.literal('FALSE_DETECTION'),
      v.literal('WRONG_CLASSIFICATION'), v.literal('TEST_EVENT'),
    ),
    reviewedBy: v.string(),
    reviewNotes: v.optional(v.string()),
    correctiveAction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, { ...data, reviewedAt: Date.now() })
  },
})
