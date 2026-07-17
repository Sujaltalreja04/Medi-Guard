import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('auditLogs').order('desc').take(200)
  },
})

export const create = mutation({
  args: {
    actor: v.string(),
    role: v.string(),
    action: v.string(),
    resource: v.string(),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('auditLogs', { ...args, timestamp: Date.now() })
  },
})
