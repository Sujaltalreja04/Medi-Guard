import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  color?: string
}

const colorConfig: Record<string, { bg: string; iconBg: string; iconColor: string; glow: string }> = {
  emerald: {
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))',
    iconBg: 'rgba(16,185,129,0.15)',
    iconColor: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
  },
  red: {
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.03))',
    iconBg: 'rgba(239,68,68,0.15)',
    iconColor: '#ef4444',
    glow: 'rgba(239,68,68,0.12)',
  },
  amber: {
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
  },
  blue: {
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))',
    iconBg: 'rgba(59,130,246,0.15)',
    iconColor: '#3b82f6',
    glow: 'rgba(59,130,246,0.12)',
  },
  gray: {
    bg: 'linear-gradient(135deg, rgba(100,116,139,0.08), rgba(100,116,139,0.03))',
    iconBg: 'rgba(100,116,139,0.15)',
    iconColor: '#64748b',
    glow: 'rgba(100,116,139,0.08)',
  },
}

export default function KpiCard({ label, value, icon, trend, color = 'emerald' }: KpiCardProps) {
  const cfg = colorConfig[color] || colorConfig.emerald

  return (
    <div
      className="rounded-2xl p-4 lg:p-5 transition-all duration-200 hover:translate-y-[-2px] cursor-default"
      style={{
        background: cfg.bg,
        border: '1px solid #1e2d4a',
        boxShadow: `0 4px 24px ${cfg.glow}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</p>
          <p className="text-2xl lg:text-3xl font-bold mt-2" style={{ color: '#e2e8f0' }}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium`} style={{ color: trend.positive ? '#10b981' : '#ef4444' }}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-xl shrink-0"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
