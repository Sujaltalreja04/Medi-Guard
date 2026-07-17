import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { SeverityBadge } from '../components/shared/StatusBadge'
import StatusBadge from '../components/shared/StatusBadge'
import { formatRelativeTime, formatConfidence } from '../lib/utils'

const statusVariant: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'gray'> = {
  OPEN: 'red',
  ACKNOWLEDGED: 'amber',
  RESOLVED: 'green',
}

const detectionClasses = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK', 'GAUZE_DRESSING',
  'MEDICINE_VIAL', 'AMPOULE', 'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER',
  'PAPER_PACKAGING', 'GENERAL_WASTE', 'UNKNOWN_ITEM',
]

function isToday(ts: number | undefined) {
  if (!ts) return false
  const today = new Date().setHours(0, 0, 0, 0)
  return ts >= today
}

export default function Alerts() {
  const alerts = useQuery(api.alerts.list)
  const dashboard = useQuery(api.analytics.dashboard)
  const acknowledge = useMutation(api.alerts.acknowledge)

  const [facility, setFacility] = useState('')
  const [department, setDepartment] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    if (!alerts) return null
    const all = alerts
    return {
      critical: all.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length,
      high: all.filter((a) => a.severity === 'HIGH' && a.status === 'OPEN').length,
      medium: all.filter((a) => a.severity === 'MEDIUM' && a.status === 'OPEN').length,
      low: all.filter((a) => a.severity === 'LOW' && a.status === 'OPEN').length,
      unreviewed: all.filter((a) => a.status === 'OPEN').length,
      resolvedToday: all.filter((a) => a.status === 'RESOLVED' && isToday(a.resolvedAt)).length,
    }
  }, [alerts])

  const filtered = useMemo(() => {
    if (!alerts) return []
    return alerts.filter((a) => {
      if (facility && a.facilityId !== facility) return false
      if (department && a.department !== department) return false
      if (severity && a.severity !== severity) return false
      if (status && a.status !== status) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !a.title.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q) &&
          !a.department.toLowerCase().includes(q) &&
          !(a.detectedClass || '').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [alerts, facility, department, severity, status, search])

  const handleAcknowledge = async (id: string) => {
    await acknowledge({ id: id as any, acknowledgedBy: 'Operator' })
  }

  if (alerts === undefined || dashboard === undefined) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  const facilities = dashboard.departmentStats.map((d) => d.facility)
  const uniqueFacilities = [...new Set(facilities)]
  const departments = dashboard.departmentStats.map((d) => d.department)
  const uniqueDepartments = [...new Set(departments)]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Critical" value={stats.critical} color="red" />
          <StatCard label="High" value={stats.high} color="orange" />
          <StatCard label="Medium" value={stats.medium} color="amber" />
          <StatCard label="Low" value={stats.low} color="blue" />
          <StatCard label="Unreviewed" value={stats.unreviewed} color="gray" />
          <StatCard label="Resolved Today" value={stats.resolvedToday} color="emerald" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-3">
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Facilities</option>
              {uniqueFacilities.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[200px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No alerts found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detected Object</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((alert) => (
                  <tr key={alert._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatRelativeTime(alert.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {alert.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {alert.binId || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {alert.detectedClass ? alert.detectedClass.replace(/_/g, ' ') : alert.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {alert.confidence != null ? formatConfidence(alert.confidence) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={alert.status} variant={statusVariant[alert.status] || 'gray'} dot />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {alert.status === 'OPEN' && (
                          <button
                            onClick={() => handleAcknowledge(alert._id)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        {alert.eventId && (
                          <Link
                            to={`/events/${alert.eventId}`}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.gray}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
