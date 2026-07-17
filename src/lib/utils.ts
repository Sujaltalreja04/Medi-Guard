export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(ts: number): string {
  return `${formatDate(ts)} ${formatTime(ts)}`
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(ts)
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 0.85) return 'text-green-600'
  if (confidence >= 0.65) return 'text-amber-600'
  if (confidence >= 0.4) return 'text-orange-600'
  return 'text-red-600'
}

export function confidenceBg(confidence: number): string {
  if (confidence >= 0.85) return 'bg-green-100'
  if (confidence >= 0.65) return 'bg-amber-100'
  if (confidence >= 0.4) return 'bg-orange-100'
  return 'bg-red-100'
}

export function fillLevelColor(level: number): string {
  if (level >= 90) return 'text-red-600'
  if (level >= 70) return 'text-amber-600'
  if (level >= 20) return 'text-blue-600'
  return 'text-green-600'
}

export function fillLevelBg(level: number): string {
  if (level >= 90) return 'bg-red-500'
  if (level >= 70) return 'bg-amber-500'
  if (level >= 20) return 'bg-blue-500'
  return 'bg-green-500'
}

export function formatConfidence(val: number): string {
  return `${Math.round(val * 100)}%`
}

export function formatFillLevel(val: number): string {
  return `${Math.round(val)}%`
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatWasteClass(cls: string): string {
  return cls.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
