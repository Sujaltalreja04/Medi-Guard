import { v } from 'convex/values'
import { action, mutation } from './_generated/server'
import { analyzeImage } from './lib/nvidiaVision'
import { evaluateSegregation } from './lib/segregationEngine'

export const analyzeWasteImage = action({
  args: {
    imageBase64: v.string(),
    mimeType: v.string(),
    facilityId: v.id('facilities'),
    department: v.string(),
    binId: v.id('bins'),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) throw new Error('NVIDIA_API_KEY not configured — set it in the Convex dashboard under Settings > Environment Variables')

    const bin = await ctx.runQuery(('bins:getById' as any), { id: args.binId })
    if (!bin) throw new Error('Bin not found')

    const rules = await ctx.runQuery(('rules:list' as any), {})
    if (!rules) throw new Error('No segregation rules found')

    const analysis = await analyzeImage(args.imageBase64, args.mimeType, apiKey)

    const ruleResult = evaluateSegregation({
      binType: bin.type,
      wasteClass: analysis.primaryClass,
      confidence: analysis.overallConfidence,
      rules,
    })

    const eventId = `EVT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*90000)+10000)}`

    const eventDbId = await ctx.runMutation(('events:create' as any), {
      eventId,
      facilityId: args.facilityId,
      department: args.department,
      binId: args.binId,
      decision: ruleResult.decision,
      severity: ruleResult.severity as any,
      detectedClass: analysis.primaryClass as any,
      confidence: analysis.overallConfidence,
    })

    if (ruleResult.decision === 'CRITICAL_VIOLATION' || ruleResult.decision === 'PROBABLE_VIOLATION') {
      const alertId = `ALT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*9000)+1000)}`
      const alertTitle = ruleResult.decision === 'CRITICAL_VIOLATION'
        ? 'Critical Segregation Violation'
        : 'Probable Segregation Violation'
      const alertDesc = `Possible ${analysis.primaryClass.toLowerCase().replace(/_/g, ' ')} detected in ${bin.name} (${bin.type.replace(/_/g, ' ')})`

      await ctx.runMutation(('alerts:create' as any), {
        alertId,
        eventId: eventDbId,
        facilityId: args.facilityId,
        department: args.department,
        binId: args.binId,
        severity: ruleResult.severity,
        title: alertTitle,
        description: alertDesc,
        detectedClass: analysis.primaryClass,
        confidence: analysis.overallConfidence,
      })
    }

    await ctx.runMutation(('vision:storeAiAnalysis' as any), {
      eventId: eventDbId,
      provider: 'NVIDIA',
      model: 'minimaxai/minimax-m3',
      status: 'COMPLETED',
      primaryClass: analysis.primaryClass,
      overallConfidence: analysis.overallConfidence,
      imageQuality: analysis.imageQuality,
      requiresReview: analysis.requiresReview || ruleResult.decision === 'LOW_CONFIDENCE_REVIEW',
      latencyMs: 0,
    })

    return {
      eventId,
      eventDbId,
      analysis,
      ruleResult,
    }
  },
})

export const storeAiAnalysis = mutation({
  args: {
    eventId: v.id('disposalEvents'),
    provider: v.string(),
    model: v.string(),
    status: v.union(v.literal('PENDING'), v.literal('IN_PROGRESS'), v.literal('COMPLETED'), v.literal('FAILED')),
    primaryClass: v.optional(v.string()),
    overallConfidence: v.optional(v.number()),
    imageQuality: v.optional(v.string()),
    requiresReview: v.optional(v.boolean()),
    latencyMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('aiAnalyses', { ...args, createdAt: Date.now() } as any)
  },
})
