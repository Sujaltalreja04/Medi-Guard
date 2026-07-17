import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('facilities').collect()
  },
})

export const getById = query({
  args: { id: v.id('facilities') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})
