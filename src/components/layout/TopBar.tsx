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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 lg:gap-4 flex-1">
        <div className="relative hidden sm:block flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bins, devices, events..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm text-gray-500">
              Type to search events, bins, or devices...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hidden md:block">
          <option>All Facilities</option>
          <option>City General Hospital</option>
          <option>St. Mary's Medical Center</option>
          <option>Northside Health Institute</option>
        </select>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Notifications">
          <Bell size={20} className="text-gray-600" />
          {openAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {criticalAlerts}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
            AC
          </div>
          <div className="hidden md:block text-sm">
            <div className="font-medium text-gray-900">Alex Chen</div>
            <div className="text-xs text-gray-500">Supervisor</div>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
