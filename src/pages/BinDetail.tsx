import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import FillBar from '../components/shared/FillBar'
import StatusBadge from '../components/shared/StatusBadge'
import ActivityFeed from '../components/shared/ActivityFeed'
import { formatFillLevel } from '../lib/utils'
import {
  ArrowLeft, Trash2, Cpu, Building2, AlertTriangle,
  Gauge, CalendarClock, Hash, Thermometer,
} from 'lucide-react'

const binTypeLabels: Record<string, string> = {
  GENERAL_WASTE: 'General Waste',
  SHARPS: 'Sharps',
  INFECTIOUS: 'Infectious',
  PHARMACEUTICAL: 'Pharmaceutical',
  CHEMICAL: 'Chemical',
  RECYCLABLE: 'Recyclable',
}

const statusVariants: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'gray'> = {
  ACTIVE: 'green',
  FULL: 'red',
  NEAR_CAPACITY: 'amber',
  INACTIVE: 'gray',
  MAINTENANCE: 'blue',
}

export default function BinDetail() {
  const { binId } = useParams<{ binId: string }>()
  const navigate = useNavigate()
  const bin = useQuery(api.bins.getById, { id: binId! as any })
  const allEvents = useQuery(api.events.list)

  const binEvents = useMemo(() => {
    if (!allEvents || !bin) return []
    return allEvents
      .filter((e) => e.binId === bin._id)
      .slice(0, 10)
  }, [allEvents, bin])

  const decisionCounts = useMemo(() => {
    if (!binEvents.length) return null
    const counts: Record<string, number> = {}
    let total = 0
    for (const e of binEvents) {
      counts[e.decision] = (counts[e.decision] || 0) + 1
      total++
    }
    return { counts, total }
  }, [binEvents])

  if (bin === undefined) {
    return <BinDetailSkeleton />
  }

  if (!bin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Trash2 size={48} className="mb-3 text-gray-300" />
        <p className="text-lg font-medium">Bin not found</p>
        <p className="text-sm">The bin you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/bins')}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to bins
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/bins')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to bins
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{bin.name}</h1>
            <StatusBadge label={bin.status} variant={statusVariants[bin.status] || 'gray'} dot />
          </div>
          <p className="text-gray-500 mt-1 font-mono text-sm">{bin.binId}</p>
        </div>
        <StatusBadge label={binTypeLabels[bin.type] || bin.type} variant="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gauge size={18} className="text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Current Fill Level</h2>
            </div>
            <div className="mb-2">
              <FillBar level={bin.fillLevel} height="h-4" />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
              <span>Warning: {formatFillLevel(bin.warningThreshold)}</span>
              <span>Critical: {formatFillLevel(bin.criticalThreshold)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
            </div>
            <div className="p-5">
              <ActivityFeed events={binEvents} />
            </div>
          </div>

          {decisionCounts && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Waste Distribution</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(decisionCounts.counts).map(([decision, count]) => (
                  <div key={decision} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-40 capitalize">
                      {decision.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${(count / decisionCounts.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-10 text-right">
                      {Math.round((count / decisionCounts.total) * 100)}%
                    </span>
                    <span className="text-sm text-gray-700 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bin Info</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-900">{bin.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Waste Stream</p>
                  <p className="text-sm font-medium text-gray-900">{bin.wasteStream}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Thermometer size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{binTypeLabels[bin.type] || bin.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Open Alerts</p>
                  <p className={`text-sm font-medium ${bin.openAlerts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {bin.openAlerts}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarClock size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Warning Threshold</p>
                  <p className="text-sm font-medium text-gray-900">{formatFillLevel(bin.warningThreshold)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarClock size={16} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Critical Threshold</p>
                  <p className="text-sm font-medium text-gray-900">{formatFillLevel(bin.criticalThreshold)}</p>
                </div>
              </div>
              {bin.lastCollection && (
                <div className="flex items-start gap-3">
                  <CalendarClock size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Last Collection</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(bin.lastCollection).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {bin.deviceId && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Device</h2>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Device</p>
                  <Link
                    to={`/devices`}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {bin.deviceId} →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BinDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-100 rounded-full" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
