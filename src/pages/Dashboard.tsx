import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import KpiCard from '../components/shared/KpiCard'
import ActivityFeed from '../components/shared/ActivityFeed'
import StatusBadge from '../components/shared/StatusBadge'
import {
  Trash2, Bell, AlertTriangle, CalendarDays, ShieldAlert,
  Building2, Cpu,
} from 'lucide-react'

/* ─── Dark style tokens ─── */
const card = { background: '#0e1525', border: '1px solid #1a2640', borderRadius: '1rem' }
const th   = { color: '#4d6080', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '0.75rem 1.25rem', background: '#0b1120' }

export default function Dashboard() {
  const dashboard = useQuery(api.analytics.dashboard)
  const overview  = useQuery(api.analytics.overview)

  if (dashboard === undefined || overview === undefined) return <DashboardSkeleton />
  if (!dashboard || !overview) return (
    <div className="flex items-center justify-center h-64" style={{ color: '#4d6080' }}>
      Failed to load dashboard data.
    </div>
  )

  const kpiCards = [
    { label: 'Monitored Bins',       value: dashboard.totalBins,           icon: <Trash2 size={22} />,       color: 'emerald' as const },
    { label: 'Active Critical Alerts', value: dashboard.criticalAlerts,    icon: <Bell size={22} />,         color: 'red'     as const },
    { label: 'Bins Near Capacity',   value: dashboard.nearCapacityBins,    icon: <AlertTriangle size={22} />, color: 'amber'  as const },
    { label: 'Events Today',         value: dashboard.eventsToday,         icon: <CalendarDays size={22} />, color: 'blue'    as const },
    { label: 'Confirmed Violations', value: dashboard.confirmedViolations, icon: <ShieldAlert size={22} />, color: 'red'     as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#e8edf5' }}>Good morning, Operations Team</h1>
        <p className="mt-1" style={{ color: '#6677a0' }}>Here's what's happening across your medical waste network.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Department status table */}
        <div className="xl:col-span-2 shadow-sm" style={card}>
          <div className="p-5" style={{ borderBottom: '1px solid #1a2640' }}>
            <h2 className="text-lg font-semibold" style={{ color: '#e8edf5' }}>Department Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th style={th}>Department</th>
                  <th style={th}>Bins</th>
                  <th style={th}>Online Devices</th>
                  <th style={th}>Alerts</th>
                  <th style={th}>Capacity Warnings</th>
                  <th style={th}>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.departmentStats.map((dept, i) => (
                  <tr
                    key={`${dept.department}-${i}`}
                    style={{ borderBottom: '1px solid #131d30' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#131d30')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div className="flex items-center gap-2">
                        <Building2 size={15} style={{ color: '#4d6080' }} className="shrink-0" />
                        <span className="font-medium" style={{ color: '#e8edf5' }}>{dept.department}</span>
                      </div>
                      <span className="text-xs" style={{ color: '#4d6080' }}>{dept.facility}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#8899b4' }}>{dept.bins}</td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div className="flex items-center gap-1.5">
                        <Cpu size={14} style={{ color: '#4d6080' }} />
                        <span style={{ color: '#8899b4' }}>{dept.onlineDevices}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <StatusBadge label={String(dept.alerts)} variant={dept.alerts > 0 ? 'red' : 'green'} dot />
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <StatusBadge label={String(dept.capacityWarnings)} variant={dept.capacityWarnings > 0 ? 'amber' : 'green'} dot />
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-1.5 rounded-full overflow-hidden" style={{ background: '#1a2640' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${dept.compliance}%`,
                              background: dept.compliance >= 90 ? '#10b981' : dept.compliance >= 70 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold" style={{
                          color: dept.compliance >= 90 ? '#10b981' : dept.compliance >= 70 ? '#f59e0b' : '#ef4444',
                        }}>
                          {dept.compliance}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="shadow-sm" style={card}>
          <div className="p-5" style={{ borderBottom: '1px solid #1a2640' }}>
            <h2 className="text-lg font-semibold" style={{ color: '#e8edf5' }}>Recent Activity</h2>
          </div>
          <div className="p-5">
            <ActivityFeed events={dashboard.recentEvents} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  const pulse = { background: '#1a2640', borderRadius: '0.5rem', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div style={{ ...pulse, height: '2rem', width: '20rem' }} />
        <div style={{ ...pulse, height: '1rem', width: '26rem', opacity: 0.6 }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: '#0e1525', border: '1px solid #1a2640' }}>
            <div style={{ ...pulse, height: '0.75rem', width: '6rem', marginBottom: '0.75rem' }} />
            <div style={{ ...pulse, height: '2rem', width: '4rem' }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl p-5" style={{ background: '#0e1525', border: '1px solid #1a2640' }}>
          <div style={{ ...pulse, height: '1.5rem', width: '10rem', marginBottom: '1rem' }} />
          {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ ...pulse, height: '2.5rem', marginBottom: '0.5rem' }} />)}
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#0e1525', border: '1px solid #1a2640' }}>
          <div style={{ ...pulse, height: '1.5rem', width: '8rem', marginBottom: '1rem' }} />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ ...pulse, height: '4rem', marginBottom: '0.5rem' }} />)}
        </div>
      </div>
    </div>
  )
}
