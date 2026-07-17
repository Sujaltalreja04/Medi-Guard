import { Search, Bell, ChevronDown } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useState } from 'react'

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const dashboard = useQuery(api.analytics.dashboard)

  const openAlerts = dashboard?.activeAlerts ?? 0
  const criticalAlerts = dashboard?.criticalAlerts ?? 0

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30"
      style={{
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e2d4a',
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1">
        <div className="relative hidden sm:block flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search bins, devices, events..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
            style={{
              background: '#0f1629',
              border: '1px solid #1e2d4a',
              color: '#94a3b8',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(16,185,129,0.5)'
              e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'
              setSearchOpen(true)
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1e2d4a'
              e.target.style.boxShadow = 'none'
              setTimeout(() => setSearchOpen(false), 200)
            }}
          />
          {searchOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-xl p-3 text-sm"
              style={{
                background: '#0f1629',
                border: '1px solid #1e2d4a',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                color: '#475569',
              }}
            >
              Type to search events, bins, or devices…
            </div>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Facility selector */}
        <select
          className="text-sm rounded-xl px-3 py-2 hidden md:block outline-none cursor-pointer transition-all"
          style={{
            background: '#0f1629',
            border: '1px solid #1e2d4a',
            color: '#94a3b8',
          }}
        >
          <option>All Facilities</option>
          <option>City General Hospital</option>
          <option>St. Mary's Medical Center</option>
          <option>Northside Health Institute</option>
        </select>

        {/* Bell */}
        <button
          className="relative p-2.5 rounded-xl transition-all"
          style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#64748b' }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {openAlerts > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
            >
              {criticalAlerts}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-7 mx-1" style={{ background: '#1e2d4a' }} />

        {/* User profile */}
        <button
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.1))',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            AC
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>Alex Chen</div>
            <div className="text-xs" style={{ color: '#475569' }}>Supervisor</div>
          </div>
          <ChevronDown size={14} style={{ color: '#475569' }} />
        </button>
      </div>
    </header>
  )
}
