interface StatusBadgeProps {
  label: string
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'orange' | 'emerald' | 'yellow'
  dot?: boolean
}

const variants: Record<string, { bg: string; color: string; dot: string }> = {
  green:   { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', dot: '#22c55e' },
  red:     { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', dot: '#ef4444' },
  amber:   { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', dot: '#f59e0b' },
  blue:    { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', dot: '#3b82f6' },
  gray:    { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', dot: '#64748b' },
  orange:  { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', dot: '#f97316' },
  emerald: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', dot: '#10b981' },
  yellow:  { bg: 'rgba(234,179,8,0.12)',  color: '#facc15', dot: '#eab308' },
}

export default function StatusBadge({ label, variant = 'gray', dot }: StatusBadgeProps) {
  const cfg = variants[variant] || variants.gray
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: cfg.dot }}
        />
      )}
      {label}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    CRITICAL: { label: 'Critical', variant: 'red' },
    HIGH: { label: 'High', variant: 'orange' },
    MEDIUM: { label: 'Medium', variant: 'amber' },
    LOW: { label: 'Low', variant: 'blue' },
    INFO: { label: 'Info', variant: 'gray' },
  }
  const m = map[severity] || { label: severity, variant: 'gray' as const }
  return <StatusBadge label={m.label} variant={m.variant} dot />
}

export function ConnectionBadge({ connection }: { connection: string }) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    ONLINE: { label: 'Online', variant: 'green' },
    OFFLINE: { label: 'Offline', variant: 'red' },
    WARNING: { label: 'Warning', variant: 'amber' },
  }
  const m = map[connection] || { label: connection, variant: 'amber' as const }
  return <StatusBadge label={m.label} variant={m.variant} dot />
}

export function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, { label: string; variant: StatusBadgeProps['variant'] }> = {
    CORRECT: { label: 'Correct', variant: 'green' },
    PROBABLE_VIOLATION: { label: 'Probable Violation', variant: 'amber' },
    CRITICAL_VIOLATION: { label: 'Critical Violation', variant: 'red' },
    LOW_CONFIDENCE_REVIEW: { label: 'Low Confidence', variant: 'yellow' },
    UNKNOWN_ITEM: { label: 'Unknown', variant: 'gray' },
    AI_ANALYSIS_FAILED: { label: 'Analysis Failed', variant: 'red' },
    SENSOR_ERROR: { label: 'Sensor Error', variant: 'orange' },
    DEVICE_OFFLINE: { label: 'Device Offline', variant: 'gray' },
  }
  const m = map[decision] || { label: decision, variant: 'gray' as const }
  return <StatusBadge label={m.label} variant={m.variant} dot />
}
