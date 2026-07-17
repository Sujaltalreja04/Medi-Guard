import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import KpiCard from '../components/shared/KpiCard'
import ActivityFeed from '../components/shared/ActivityFeed'
import StatusBadge from '../components/shared/StatusBadge'
import {
  Trash2, Bell, AlertTriangle, CalendarDays, ShieldAlert,
  Building2, Cpu, Activity, CheckCircle2,
} from 'lucide-react'

export default function Dashboard() {
  const dashboard = useQuery(api.analytics.dashboard)
  const overview = useQuery(api.analytics.overview)

  if (dashboard === undefined || overview === undefined) {
    return <DashboardSkeleton />
  }

  if (!dashboard || !overview) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Failed to load dashboard data.
      </div>
    )
  }

  const kpiCards = [
    {
      label: 'Monitored Bins',
      value: dashboard.totalBins,
      icon: <Trash2 size={22} />,
      color: 'emerald' as const,
    },
    {
      label: 'Active Critical Alerts',
      value: dashboard.criticalAlerts,
      icon: <Bell size={22} />,
      color: 'red' as const,
    },
    {
      label: 'Bins Near Capacity',
      value: dashboard.nearCapacityBins,
      icon: <AlertTriangle size={22} />,
      color: 'amber' as const,
    },
    {
      label: 'Events Today',
      value: dashboard.eventsToday,
      icon: <CalendarDays size={22} />,
      color: 'blue' as const,
    },
    {
      label: 'Confirmed Violations',
      value: dashboard.confirmedViolations,
      icon: <ShieldAlert size={22} />,
      color: 'red' as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Operations Team</h1>
        <p className="text-gray-500 mt-1">Here's what's happening across your medical waste network.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Department Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Bins</th>
                  <th className="px-5 py-3">Online Devices</th>
                  <th className="px-5 py-3">Alerts</th>
                  <th className="px-5 py-3">Capacity Warnings</th>
                  <th className="px-5 py-3">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboard.departmentStats.map((dept, i) => (
                  <tr key={`${dept.department}-${i}`} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className="text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-900">{dept.department}</span>
                      </div>
                      <span className="text-xs text-gray-400">{dept.facility}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{dept.bins}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Cpu size={14} className="text-gray-400" />
                        <span className="text-gray-700">{dept.onlineDevices}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        label={String(dept.alerts)}
                        variant={dept.alerts > 0 ? 'red' : 'green'}
                        dot
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        label={String(dept.capacityWarnings)}
                        variant={dept.capacityWarnings > 0 ? 'amber' : 'green'}
                        dot
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px]">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                dept.compliance >= 90
                                  ? 'bg-green-500'
                                  : dept.compliance >= 70
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${dept.compliance}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${
                          dept.compliance >= 90
                            ? 'text-green-600'
                            : dept.compliance >= 70
                              ? 'text-amber-600'
                              : 'text-red-600'
                        }`}>
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
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
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-80 bg-gray-200 rounded" />
        <div className="h-4 w-96 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
