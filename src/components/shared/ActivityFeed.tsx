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

const decisionStyles: Record<string, { border: string; iconBg: string; iconColor: string }> = {
  CORRECT:           { border: 'rgba(34,197,94,0.2)',  iconBg: 'rgba(34,197,94,0.15)',  iconColor: '#4ade80' },
  CRITICAL_VIOLATION:{ border: 'rgba(239,68,68,0.25)', iconBg: 'rgba(239,68,68,0.15)',  iconColor: '#f87171' },
  PROBABLE_VIOLATION:{ border: 'rgba(245,158,11,0.2)', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#fbbf24' },
  AI_ANALYSIS_FAILED:{ border: 'rgba(239,68,68,0.25)', iconBg: 'rgba(239,68,68,0.15)',  iconColor: '#f87171' },
  DEVICE_OFFLINE:    { border: 'rgba(100,116,139,0.2)',iconBg: 'rgba(100,116,139,0.1)', iconColor: '#94a3b8' },
}

const labels: Record<string, string> = {
  CORRECT: 'Correct Disposal',
  CRITICAL_VIOLATION: 'Critical Violation',
  PROBABLE_VIOLATION: 'Probable Violation',
  DEVICE_OFFLINE: 'Device Offline',
  DEVICE_RECONNECTED: 'Device Reconnected',
  BIN_CAPACITY_WARNING: 'Bin Capacity Warning',
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: '#475569' }}>
        No recent events
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const Icon = decisionIcons[event.decision] || AlertTriangle
        const style = decisionStyles[event.decision] || decisionStyles.DEVICE_OFFLINE

        return (
          <div
            key={event._id}
            className="flex items-start gap-3 p-3 rounded-xl transition-all"
            style={{
              background: 'rgba(15, 22, 41, 0.6)',
              border: `1px solid ${style.border}`,
            }}
          >
            <div
              className="p-1.5 rounded-lg shrink-0"
              style={{ background: style.iconBg, color: style.iconColor }}
            >
              <Icon size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                {labels[event.decision] || event.decision}
              </p>
              {event.detectedClass && (
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                  {event.detectedClass.replace(/_/g, ' ')} detected
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: '#475569' }}>
                <span>{event.department}</span>
                <span>·</span>
                <span>{formatRelativeTime(event.createdAt)}</span>
                {event.confidence && (
                  <>
                    <span>·</span>
                    <span className="font-semibold" style={{ color: style.iconColor }}>
                      {Math.round(event.confidence * 100)}%
                    </span>
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
