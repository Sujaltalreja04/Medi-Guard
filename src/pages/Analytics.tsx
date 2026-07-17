import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
import { Calendar, Loader2 } from 'lucide-react'
import StatusBadge from '../components/shared/StatusBadge'

const FILTERS = ['Today', '7 Days', '30 Days', '90 Days'] as const

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']


export default function Analytics() {
  const [range, setRange] = useState<string>('30 Days')
  const overview = useQuery(api.analytics.overview)

  if (!overview) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const eventsByDay = Object.entries(overview.eventsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))

  const violationsByDept = Object.entries(overview.violationsByDept)
    .map(([department, violations]) => ({ department, violations }))

  const wasteDistribution = Object.entries(overview.binsByType)
    .map(([name, value]) => ({ name, value }))

  const binTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    'General Waste': 30 + Math.round(Math.random() * 40),
    'Recyclable': 20 + Math.round(Math.random() * 30),
    'Infectious': 15 + Math.round(Math.random() * 25),
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track disposal patterns and compliance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          <Calendar className="w-4 h-4 text-gray-400 ml-2" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setRange(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                range === f ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Disposal Events Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Violations by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationsByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="violations" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Waste Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              >
                {wasteDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Bin Fill Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={binTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="General Waste" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="Recyclable" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="Infectious" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Device Status Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(overview.devicesByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <StatusBadge
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                variant={status === 'online' ? 'green' : status === 'offline' ? 'red' : 'amber'}
                dot
              />
              <span className="text-lg font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
