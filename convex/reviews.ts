import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('reviews').order('desc').collect()
  },
})

export const create = mutation({
  args: {
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
    correctedClass: v.optional(v.string()),
    notes: v.optional(v.string()),
    correctiveAction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('reviews', { ...args as any, createdAt: Date.now() })
  },
})
