import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { DecisionBadge, SeverityBadge } from '../components/shared/StatusBadge'
import { formatDateTime, formatConfidence, formatWasteClass } from '../lib/utils'

const reviewDecisions = [
  'CONFIRMED_VIOLATION',
  'CORRECT_DISPOSAL',
  'UNABLE_TO_DETERMINE',
  'FALSE_DETECTION',
  'WRONG_CLASSIFICATION',
  'TEST_EVENT',
] as const

const classOptions = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK', 'GAUZE_DRESSING',
  'MEDICINE_VIAL', 'AMPOULE', 'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER',
  'PAPER_PACKAGING', 'GENERAL_WASTE', 'UNKNOWN_ITEM',
] as const

const decisionColors: Record<string, string> = {
  CONFIRMED_VIOLATION: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  CORRECT_DISPOSAL: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  UNABLE_TO_DETERMINE: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  FALSE_DETECTION: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  WRONG_CLASSIFICATION: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
  TEST_EVENT: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
}

export default function EventDetail() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const event = useQuery(api.events.getById, { id: eventId as any })
  const updateReview = useMutation(api.events.updateReview)

  const [selectedDecision, setSelectedDecision] = useState<string>('')
  const [correctedClass, setCorrectedClass] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [correctiveAction, setCorrectiveAction] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (event === undefined) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-96 bg-gray-100 rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded w-3/4" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (event === null) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <p className="text-2xl font-bold text-gray-400 mb-2">Event Not Found</p>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!selectedDecision) return
    setSubmitting(true)
    try {
      await updateReview({
        id: event._id,
        reviewDecision: selectedDecision as any,
        reviewedBy: 'Reviewer',
        reviewNotes: reviewNotes || undefined,
        correctiveAction: correctiveAction || undefined,
      })
      setSelectedDecision('')
      setCorrectedClass('')
      setReviewNotes('')
      setCorrectiveAction('')
    } finally {
      setSubmitting(false)
    }
  }

  const wasteStream = event.detectedClass
    ? {
        SYRINGE: 'Infectious / Sharps',
        NEEDLE_SHARP: 'Infectious / Sharps',
        GLOVES: 'Infectious Waste',
        FACE_MASK: 'Infectious Waste',
        GAUZE_DRESSING: 'Infectious Waste',
        MEDICINE_VIAL: 'Pharmaceutical Waste',
        AMPOULE: 'Pharmaceutical Waste',
        PLASTIC_BOTTLE: 'Recyclable Waste',
        MEDICAL_CONTAINER: 'Infectious Waste',
        PAPER_PACKAGING: 'General Waste',
        GENERAL_WASTE: 'General Waste',
        UNKNOWN_ITEM: 'Requires Review',
      }[event.detectedClass] || 'Unknown'
    : 'Unknown'

  const aiStatus = event.decision === 'AI_ANALYSIS_FAILED' ? 'Failed'
    : event.decision === 'SENSOR_ERROR' ? 'Sensor Error'
    : event.decision === 'DEVICE_OFFLINE' ? 'Device Offline'
    : event.decision === 'CAMERA_OBSTRUCTION' ? 'Camera Obstructed'
    : 'Completed'

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/events')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
        <span className="text-sm font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          {event.eventId}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center">
              {event.imageStoragePath ? (
                <img
                  src={event.imageStoragePath}
                  alt="Disposal event"
                  className="w-full h-full object-cover rounded-t-xl"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Review</h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {reviewDecisions.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDecision(d)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    selectedDecision === d
                      ? 'ring-2 ring-offset-2 ring-blue-500 ' + (decisionColors[d] || '')
                      : decisionColors[d] || 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {selectedDecision === 'WRONG_CLASSIFICATION' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Classification</label>
                <select
                  value={correctedClass}
                  onChange={(e) => setCorrectedClass(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white w-full max-w-xs"
                >
                  <option value="">Select class...</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white resize-none"
                  placeholder="Add notes about this review..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corrective Action</label>
                <textarea
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white resize-none"
                  placeholder="Any corrective actions taken..."
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedDecision || submitting}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            {event.reviewedAt && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Previous Review</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Decision:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {event.reviewDecision?.replace(/_/g, ' ')}
                  </span>
                </div>
                {event.reviewNotes && (
                  <p className="text-sm text-gray-600 mb-1"><span className="text-gray-500">Notes:</span> {event.reviewNotes}</p>
                )}
                {event.correctiveAction && (
                  <p className="text-sm text-gray-600 mb-1"><span className="text-gray-500">Action:</span> {event.correctiveAction}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(event.reviewedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Detection Info</h2>
            <DetailRow label="Detection" value={event.detectedClass ? formatWasteClass(event.detectedClass) : '-'} />
            <DetailRow label="AI Confidence" value={event.confidence != null ? formatConfidence(event.confidence) : '-'} />
            <DetailRow label="Timestamp" value={formatDateTime(event.createdAt)} />
            <DetailRow label="Detected Class" value={event.detectedClass ? formatWasteClass(event.detectedClass) : '-'} />
            <DetailRow label="Expected Waste Stream" value={wasteStream} />
            <DetailRow label="AI Analysis Status" value={aiStatus} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Disposal Info</h2>
            <DetailRow label="Bin" value={event.binId} />
            <DetailRow label="Department" value={event.department} />
            <DetailRow label="Facility" value={event.facilityId} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AI Decision</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Decision</span>
              <DecisionBadge decision={event.decision} />
            </div>
            {event.severity && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Severity</span>
                <SeverityBadge severity={event.severity} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Rule Applied</span>
              <span className="text-sm font-medium text-gray-900">{event.decision.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}
