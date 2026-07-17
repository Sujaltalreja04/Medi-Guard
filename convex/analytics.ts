import { query } from './_generated/server'

export const dashboard = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('disposalEvents').collect()
    const alerts = await ctx.db.query('alerts').collect()
    const bins = await ctx.db.query('bins').collect()
    const facilities = await ctx.db.query('facilities').collect()
    const devices = await ctx.db.query('devices').collect()

    const now = Date.now()
    const today = new Date(now).setHours(0, 0, 0, 0)

    const eventsToday = events.filter((e) => e.createdAt >= today).length
    const activeAlerts = alerts.filter((a) => a.status === 'OPEN').length
    const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length
    const nearCapacityBins = bins.filter((b) => b.fillLevel >= b.warningThreshold).length
    const confirmedViolations = events.filter((e) => e.reviewDecision === 'CONFIRMED_VIOLATION').length
    const onlineDevices = devices.filter((d) => d.connection === 'ONLINE').length
    const offlineDevices = devices.filter((d) => d.connection === 'OFFLINE').length
    const totalBins = bins.length
    const totalDevices = devices.length

    const binsNearCritical = bins.filter((b) => b.fillLevel >= b.criticalThreshold).length

    const departmentStats = facilities.flatMap((f) =>
      f.departments.map((dept) => {
        const deptEvents = events.filter((e) => e.department === dept && e.facilityId === f._id)
        const deptAlerts = alerts.filter((a) => a.department === dept && a.facilityId === f._id)
        const deptBins = bins.filter((b) => b.department === dept && b.facilityId === f._id)
        const deptDevices = devices.filter((d) => d.department === dept && d.facilityId === f._id)
        return {
          department: dept,
          facility: f.name,
          bins: deptBins.length,
          onlineDevices: deptDevices.filter((d) => d.connection === 'ONLINE').length,
          alerts: deptAlerts.filter((a) => a.status === 'OPEN').length,
          capacityWarnings: deptBins.filter((b) => b.fillLevel >= b.warningThreshold).length,
          compliance: deptEvents.length > 0
            ? Math.round((deptEvents.filter((e) => e.reviewDecision === 'CORRECT_DISPOSAL' || e.decision === 'CORRECT').length / deptEvents.length) * 100)
            : 100,
        }
      }),
    )

    const recentEvents = events.slice(-20).reverse()

    return {
      totalBins,
      totalDevices,
      onlineDevices,
      offlineDevices,
      activeAlerts,
      criticalAlerts,
      eventsToday,
      nearCapacityBins,
      binsNearCritical,
      confirmedViolations,
      totalFacilities: facilities.length,
      departmentStats,
      recentEvents,
    }
  },
})

export const overview = query({
  handler: async (ctx) => {
    const events = await ctx.db.query('disposalEvents').collect()
    const bins = await ctx.db.query('bins').collect()
    const devices = await ctx.db.query('devices').collect()
    const alerts = await ctx.db.query('alerts').collect()

    const now = Date.now()

    const violations = events.filter((e) =>
      e.decision === 'CRITICAL_VIOLATION' || e.decision === 'PROBABLE_VIOLATION' || e.reviewDecision === 'CONFIRMED_VIOLATION'
    )

    const violationsByDept: Record<string, number> = {}
    violations.forEach((v) => {
      violationsByDept[v.department] = (violationsByDept[v.department] || 0) + 1
    })

    const eventsByDay: Record<string, number> = {}
    const last30 = now - 30 * 24 * 60 * 60 * 1000
    events.filter((e) => e.createdAt >= last30).forEach((e) => {
      const day = new Date(e.createdAt).toISOString().slice(0, 10)
      eventsByDay[day] = (eventsByDay[day] || 0) + 1
    })

    return {
      totalEvents: events.length,
      violations: violations.length,
      violationsByDept,
      eventsByDay,
      binsByType: bins.reduce((acc: Record<string, number>, b) => {
        acc[b.type] = (acc[b.type] || 0) + 1
        return acc
      }, {}),
      devicesByStatus: {
        online: devices.filter((d) => d.connection === 'ONLINE').length,
        offline: devices.filter((d) => d.connection === 'OFFLINE').length,
        warning: devices.filter((d) => d.connection === 'WARNING').length,
      },
      alertsBySeverity: {
        critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
        high: alerts.filter((a) => a.severity === 'HIGH').length,
        medium: alerts.filter((a) => a.severity === 'MEDIUM').length,
        low: alerts.filter((a) => a.severity === 'LOW').length,
      },
    }
  },
})
