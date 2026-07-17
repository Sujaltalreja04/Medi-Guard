import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('bins').collect()
  },
})

export const getById = query({
  args: { id: v.id('bins') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const listByFacility = query({
  args: { facilityId: v.id('facilities') },
  handler: async (ctx, args) => {
    return await ctx.db.query('bins').filter((q) => q.eq(q.field('facilityId'), args.facilityId)).collect()
  },
})

export const updateFillLevel = mutation({
  args: { id: v.id('bins'), fillLevel: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { fillLevel: args.fillLevel })
  },
})
