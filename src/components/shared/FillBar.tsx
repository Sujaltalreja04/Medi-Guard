interface FillBarProps {
  level: number
  showLabel?: boolean
  height?: string
}

export default function FillBar({ level, showLabel = true, height = 'h-2' }: FillBarProps) {
  const color = level >= 90 ? 'bg-red-500' : level >= 70 ? 'bg-amber-500' : level >= 20 ? 'bg-blue-500' : 'bg-green-500'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, level))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${level >= 90 ? 'text-red-600' : level >= 70 ? 'text-amber-600' : 'text-gray-600'}`}>
          {Math.round(level)}%
        </span>
      )}
    </div>
  )
}
