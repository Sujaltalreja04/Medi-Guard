interface StatusBadgeProps {
  label: string
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'orange' | 'emerald'
  dot?: boolean
}

const variants = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  amber: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
  orange: 'bg-orange-100 text-orange-800',
  emerald: 'bg-emerald-100 text-emerald-800',
}

const dotColors = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
  orange: 'bg-orange-500',
  emerald: 'bg-emerald-500',
}

export default function StatusBadge({ label, variant = 'gray', dot }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {label}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { label: string; variant: 'red' | 'orange' | 'amber' | 'blue' | 'gray' }> = {
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
  const map: Record<string, { label: string; variant: 'green' | 'red' | 'amber' }> = {
    ONLINE: { label: 'Online', variant: 'green' },
    OFFLINE: { label: 'Offline', variant: 'red' },
    WARNING: { label: 'Warning', variant: 'amber' },
  }
  const m = map[connection] || { label: connection, variant: 'amber' as const }
  return <StatusBadge label={m.label} variant={m.variant} dot />
}

export function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, { label: string; variant: 'green' | 'red' | 'amber' | 'yellow' | 'gray' | 'orange' }> = {
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
  return <StatusBadge label={m.label} variant={m.variant as any} dot />
}
