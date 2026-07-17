import { AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff, Trash2 } from 'lucide-react'
import { formatRelativeTime } from '../../lib/utils'

interface ActivityEvent {
  _id: string
  decision: string
  detectedClass?: string
  confidence?: number
  department: string
  createdAt: number
}

interface ActivityFeedProps {
  events: ActivityEvent[]
}

const decisionIcons: Record<string, any> = {
  CORRECT: CheckCircle,
  CRITICAL_VIOLATION: AlertTriangle,
  PROBABLE_VIOLATION: AlertTriangle,
  AI_ANALYSIS_FAILED: XCircle,
  DEVICE_OFFLINE: WifiOff,
  DEVICE_RECONNECTED: Wifi,
  BIN_CAPACITY_WARNING: Trash2,
}

const decisionColors: Record<string, string> = {
  CORRECT: 'text-green-600 bg-green-50 border-green-200',
  CRITICAL_VIOLATION: 'text-red-600 bg-red-50 border-red-200',
  PROBABLE_VIOLATION: 'text-amber-600 bg-amber-50 border-amber-200',
  AI_ANALYSIS_FAILED: 'text-red-600 bg-red-50 border-red-200',
  DEVICE_OFFLINE: 'text-gray-600 bg-gray-50 border-gray-200',
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No recent events
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const Icon = decisionIcons[event.decision] || AlertTriangle
        const borderColor = decisionColors[event.decision] || 'text-gray-600 bg-gray-50 border-gray-200'

        return (
          <div
            key={event._id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${borderColor}`}
          >
            <div className="p-1.5 rounded-full bg-white shrink-0">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {event.decision === 'CORRECT' && 'Correct Disposal'}
                {event.decision === 'CRITICAL_VIOLATION' && 'Critical Violation'}
                {event.decision === 'PROBABLE_VIOLATION' && 'Probable Violation'}
                {event.decision === 'DEVICE_OFFLINE' && 'Device Offline'}
                {event.decision === 'DEVICE_RECONNECTED' && 'Device Reconnected'}
                {event.decision === 'BIN_CAPACITY_WARNING' && 'Bin Capacity Warning'}
                {![
                  'CORRECT', 'CRITICAL_VIOLATION', 'PROBABLE_VIOLATION',
                  'DEVICE_OFFLINE', 'DEVICE_RECONNECTED', 'BIN_CAPACITY_WARNING',
                ].includes(event.decision) && event.decision}
              </p>
              {event.detectedClass && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {event.detectedClass.replace(/_/g, ' ')} detected
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{event.department}</span>
                <span>·</span>
                <span>{formatRelativeTime(event.createdAt)}</span>
                {event.confidence && (
                  <>
                    <span>·</span>
                    <span className="font-medium">{Math.round(event.confidence * 100)}%</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
