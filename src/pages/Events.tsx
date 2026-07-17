import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { DecisionBadge } from '../components/shared/StatusBadge'
import { formatRelativeTime, formatConfidence } from '../lib/utils'

const decisionOptions = [
  'CORRECT', 'PROBABLE_VIOLATION', 'CRITICAL_VIOLATION', 'LOW_CONFIDENCE_REVIEW',
  'UNKNOWN_ITEM', 'AI_ANALYSIS_FAILED', 'SENSOR_ERROR', 'BIN_CAPACITY_WARNING',
  'DEVICE_OFFLINE', 'CAMERA_OBSTRUCTION', 'DEVICE_RECONNECTED',
]
const wasteClassOptions = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK', 'GAUZE_DRESSING',
  'MEDICINE_VIAL', 'AMPOULE', 'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER',
  'PAPER_PACKAGING', 'GENERAL_WASTE', 'UNKNOWN_ITEM',
]

export default function Events() {
  const events = useQuery(api.events.list)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [facility, setFacility] = useState('')
  const [department, setDepartment] = useState('')
  const [bin, setBin] = useState('')
  const [decision, setDecision] = useState('')
  const [wasteClass, setWasteClass] = useState('')
  const [reviewStatus, setReviewStatus] = useState('')

  const filtered = useMemo(() => {
    if (!events) return []
    return events.filter((e) => {
      if (dateFrom && e.createdAt < new Date(dateFrom).getTime()) return false
      if (dateTo && e.createdAt > new Date(dateTo).setHours(23, 59, 59, 999)) return false
      if (facility && e.facilityId !== facility) return false
      if (department && e.department !== department) return false
      if (bin && e.binId !== bin) return false
      if (decision && e.decision !== decision) return false
      if (wasteClass && e.detectedClass !== wasteClass) return false
      if (reviewStatus === 'PENDING' && e.reviewedAt) return false
      if (reviewStatus === 'REVIEWED' && !e.reviewedAt) return false
      return true
    })
  }, [events, dateFrom, dateTo, facility, department, bin, decision, wasteClass, reviewStatus])

  const uniqueFacilities = useMemo(() => {
    if (!events) return []
    return [...new Set(events.map((e) => e.facilityId))]
  }, [events])

  const uniqueDepartments = useMemo(() => {
    if (!events) return []
    return [...new Set(events.map((e) => e.department))]
  }, [events])

  const uniqueBins = useMemo(() => {
    if (!events) return []
    return [...new Set(events.map((e) => e.binId))]
  }, [events])

  if (events === undefined) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Disposal Events</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            />
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
              value={bin}
              onChange={(e) => setBin(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Bins</option>
              {uniqueBins.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Decisions</option>
              {decisionOptions.map((d) => (
                <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={wasteClass}
              onChange={(e) => setWasteClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Waste Classes</option>
              {wasteClassOptions.map((w) => (
                <option key={w} value={w}>{w.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Review Status</option>
              <option value="PENDING">Pending Review</option>
              <option value="REVIEWED">Reviewed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detected Object</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Decision</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/events/${event._id}`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                      {event.eventId.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatRelativeTime(event.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {event.facilityId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {event.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {event.binId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {event.detectedClass ? event.detectedClass.replace(/_/g, ' ') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {event.confidence != null ? formatConfidence(event.confidence) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <DecisionBadge decision={event.decision} />
                    </td>
                    <td className="px-4 py-3">
                      {event.reviewedAt ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
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
