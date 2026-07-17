import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ScrollText, Loader2, Clock } from 'lucide-react'
import StatusBadge from '../components/shared/StatusBadge'
import { formatDateTime } from '../lib/utils'

export default function Audit() {
  const logs = useQuery(api.audit.list)

  if (!logs) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  const statusVariant = (status: string): 'green' | 'red' | 'amber' | 'blue' | 'gray' => {
    const map: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'gray'> = {
      SUCCESS: 'green',
      FAILURE: 'red',
      PENDING: 'amber',
      INFO: 'blue',
    }
    return map[status] || 'gray'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
          <ScrollText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">System-wide audit trail of all actions and changes</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ScrollText className="w-12 h-12 mb-3" />
            <p className="text-sm font-medium">No audit logs found</p>
            <p className="text-xs mt-1">Audit entries will appear as system actions are performed</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actor</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Action</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Resource</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log) => (
                <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium whitespace-nowrap">{log.actor}</td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{log.role}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{log.action}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{log.resource}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge label={log.status} variant={statusVariant(log.status)} dot />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Showing {sorted.length} log entries in reverse chronological order
      </p>
    </div>
  )
}
