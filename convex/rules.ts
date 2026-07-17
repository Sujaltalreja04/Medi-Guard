import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('segregationRules').collect()
  },
})

export const update = mutation({
  args: {
    id: v.id('segregationRules'),
    result: v.optional(v.union(
      v.literal('CORRECT'), v.literal('PROBABLE_VIOLATION'), v.literal('CRITICAL_VIOLATION'),
      v.literal('LOW_CONFIDENCE_REVIEW'), v.literal('UNKNOWN_ITEM'),
    )),
    severity: v.optional(v.union(
      v.literal('CRITICAL'), v.literal('HIGH'), v.literal('MEDIUM'), v.literal('LOW'), v.literal('INFO'),
    )),
    minimumConfidence: v.optional(v.number()),
    status: v.optional(v.union(v.literal('ACTIVE'), v.literal('INACTIVE'))),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  },
})
