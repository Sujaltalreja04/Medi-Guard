import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import FillBar from '../components/shared/FillBar'
import StatusBadge from '../components/shared/StatusBadge'
import { Search, Filter, ChevronDown, Trash2 } from 'lucide-react'

const binTypeLabels: Record<string, string> = {
  GENERAL_WASTE: 'General Waste',
  SHARPS: 'Sharps',
  INFECTIOUS: 'Infectious',
  PHARMACEUTICAL: 'Pharmaceutical',
  CHEMICAL: 'Chemical',
  RECYCLABLE: 'Recyclable',
}

const statusVariants: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'gray'> = {
  ACTIVE: 'green',
  FULL: 'red',
  NEAR_CAPACITY: 'amber',
  INACTIVE: 'gray',
  MAINTENANCE: 'blue',
}

export default function Bins() {
  const bins = useQuery(api.bins.list)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const departments = useMemo(() => {
    if (!bins) return []
    return [...new Set(bins.map((b) => b.department))].sort()
  }, [bins])

  const filtered = useMemo(() => {
    if (!bins) return []
    return bins.filter((b) => {
      if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.binId.toLowerCase().includes(search.toLowerCase())) return false
      if (filterDept && b.department !== filterDept) return false
      if (filterType && b.type !== filterType) return false
      if (filterStatus && b.status !== filterStatus) return false
      return true
    })
  }, [bins, search, filterDept, filterType, filterStatus])

  if (bins === undefined) {
    return <BinsSkeleton />
  }

  if (bins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Trash2 size={48} className="mb-3 text-gray-300" />
        <p className="text-lg font-medium">No bins found</p>
        <p className="text-sm">Bins will appear here once they are added to the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bins</h1>
        <p className="text-gray-500 mt-1">Monitor and manage all waste bins across your facilities.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {Object.entries(binTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="FULL">Full</option>
            <option value="NEAR_CAPACITY">Near Capacity</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Waste Stream</th>
                <th className="px-5 py-3">Fill Level</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Open Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((bin) => (
                <tr
                  key={bin._id}
                  onClick={() => navigate(`/bins/${bin._id}`)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-gray-900">{bin.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{bin.binId}</td>
                  <td className="px-5 py-3.5 text-gray-700">{bin.department}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={binTypeLabels[bin.type] || bin.type} variant="blue" />
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{bin.wasteStream}</td>
                  <td className="px-5 py-3.5 min-w-[140px]">
                    <FillBar level={bin.fillLevel} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={bin.status} variant={statusVariants[bin.status] || 'gray'} dot />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      label={String(bin.openAlerts)}
                      variant={bin.openAlerts > 0 ? 'red' : 'green'}
                      dot
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No bins match the current filters.
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {bins.length} bins
      </p>
    </div>
  )
}

function BinsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      <div className="h-4 w-64 bg-gray-100 rounded" />
      <div className="flex gap-3">
        <div className="h-10 w-60 bg-gray-100 rounded-lg" />
        <div className="h-10 w-40 bg-gray-100 rounded-lg" />
        <div className="h-10 w-40 bg-gray-100 rounded-lg" />
        <div className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
