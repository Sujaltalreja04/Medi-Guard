import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Monitor, ScanSearch, Bell, ClipboardList,
  Trash2, Building2, Cpu, BarChart3, FileText, Scale, Brain,
  ScrollText, Settings, Menu, X, FlaskConical,
} from 'lucide-react'
import { useState } from 'react'

const items = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Monitoring', path: '/monitoring', icon: Monitor },
  { label: 'Analyze Waste', path: '/analyze', icon: ScanSearch },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Disposal Events', path: '/events', icon: ClipboardList },
  { label: 'Bins', path: '/bins', icon: Trash2 },
  { label: 'Facilities', path: '/facilities', icon: Building2 },
  { label: 'Device Health', path: '/devices', icon: Cpu },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Segregation Rules', path: '/rules', icon: Scale },
  { label: 'AI Performance', path: '/ai-performance', icon: Brain },
  { label: 'Audit Logs', path: '/audit', icon: ScrollText },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg border shadow-lg transition-all"
        style={{ background: '#0f1629', borderColor: '#1e2d4a', color: '#94a3b8' }}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex flex-col
          transition-transform duration-300
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0d1528 0%, #0a0f1e 100%)',
          borderRight: '1px solid #1e2d4a',
        }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 16px rgba(16,185,129,0.4)',
              }}
            >
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: '#e2e8f0' }}>MediGuard</div>
              <div className="text-xs" style={{ color: '#64748b' }}>AI Waste Intelligence</div>
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="px-5 py-2.5" style={{ borderBottom: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#10b981' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#10b981' }} />
            </span>
            <span className="text-xs font-medium" style={{ color: '#10b981' }}>System Live</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive ? 'active-nav-item' : 'inactive-nav-item'
                }`
              }
              style={({ isActive }) => isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }
                : {
                    color: '#64748b',
                    border: '1px solid transparent',
                  }
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={17}
                    style={{ color: isActive ? '#10b981' : '#475569' }}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: '#10b981' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
            >
              MG
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: '#94a3b8' }}>MediGuard</div>
              <div className="text-[10px]" style={{ color: '#475569' }}>v1.0.0 · Production</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
