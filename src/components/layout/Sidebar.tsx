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
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-900 text-white flex flex-col
        transition-transform duration-200
        ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base">MediGuard</div>
              <div className="text-xs text-gray-400">AI-Powered Waste Intelligence</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          MediGuard v1.0.0
        </div>
      </aside>
    </>
  )
}
