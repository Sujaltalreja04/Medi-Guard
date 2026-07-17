import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('devices').collect()
  },
})

export const getById = query({
  args: { id: v.id('devices') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const updateConnection = mutation({
  args: { id: v.id('devices'), connection: v.union(v.literal('ONLINE'), v.literal('OFFLINE'), v.literal('WARNING')) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { connection: args.connection, lastHeartbeat: Date.now() })
  },
})
