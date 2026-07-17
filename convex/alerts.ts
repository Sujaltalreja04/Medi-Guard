import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('alerts').order('desc').collect()
  },
})

export const getById = query({
  args: { id: v.id('alerts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    alertId: v.string(),
    eventId: v.optional(v.id('disposalEvents')),
    facilityId: v.id('facilities'),
    department: v.string(),
    binId: v.optional(v.id('bins')),
    deviceId: v.optional(v.id('devices')),
    severity: v.union(v.literal('CRITICAL'), v.literal('HIGH'), v.literal('MEDIUM'), v.literal('LOW'), v.literal('INFO')),
    title: v.string(),
    description: v.string(),
    detectedClass: v.optional(v.union(
      v.literal('SYRINGE'), v.literal('NEEDLE_SHARP'), v.literal('GLOVES'),
      v.literal('FACE_MASK'), v.literal('GAUZE_DRESSING'), v.literal('MEDICINE_VIAL'),
      v.literal('AMPOULE'), v.literal('PLASTIC_BOTTLE'), v.literal('MEDICAL_CONTAINER'),
      v.literal('PAPER_PACKAGING'), v.literal('GENERAL_WASTE'), v.literal('UNKNOWN_ITEM'),
    )),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('alerts', { ...args, status: 'OPEN', createdAt: Date.now() })
  },
})

export const acknowledge = mutation({
  args: { id: v.id('alerts'), acknowledgedBy: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'ACKNOWLEDGED', acknowledgedBy: args.acknowledgedBy, acknowledgedAt: Date.now() })
  },
})

export const resolve = mutation({
  args: { id: v.id('alerts'), resolvedBy: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'RESOLVED', resolvedBy: args.resolvedBy, resolvedAt: Date.now() })
  },
})
