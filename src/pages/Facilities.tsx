import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import StatusBadge from '../components/shared/StatusBadge'
import {
  Building2, MapPin,
  Bell, ShieldCheck, Layers,
} from 'lucide-react'

export default function Facilities() {
  const facilities = useQuery(api.facilities.list)

  const complianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-amber-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const complianceBg = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 70) return 'bg-amber-500'
    if (score >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (facilities === undefined) {
    return <FacilitiesSkeleton />
  }

  if (facilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Building2 size={48} className="mb-3 text-gray-300" />
        <p className="text-lg font-medium">No facilities found</p>
        <p className="text-sm">Facilities will appear here once they are added to the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
        <p className="text-gray-500 mt-1">Overview of all facilities in the network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <div
            key={facility._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <MapPin size={14} className="shrink-0" />
                    <span>{facility.location}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <Building2 size={20} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <Layers size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500">
                  {facility.departments.length} department{facility.departments.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{facility.bins}</p>
                  <p className="text-xs text-gray-500">Bins</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{facility.devices}</p>
                  <p className="text-xs text-gray-500">Devices</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{facility.eventsToday}</p>
                  <p className="text-xs text-gray-500">Events</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Bell size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Active Alerts</span>
                </div>
                <StatusBadge
                  label={String(facility.activeAlerts)}
                  variant={facility.activeAlerts > 0 ? 'red' : 'green'}
                  dot
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Compliance Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${complianceBg(facility.complianceScore)}`}
                      style={{ width: `${facility.complianceScore}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${complianceColor(facility.complianceScore)}`}>
                    {Math.round(facility.complianceScore)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FacilitiesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded" />
      <div className="h-4 w-64 bg-gray-100 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
            <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
