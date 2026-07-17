import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import KpiCard from '../components/shared/KpiCard'
import { ConnectionBadge } from '../components/shared/StatusBadge'
import { formatRelativeTime } from '../lib/utils'
import {
  Cpu, Wifi, WifiOff, AlertTriangle, Camera, Radio, HardDrive,
} from 'lucide-react'

export default function Devices() {
  const devices = useQuery(api.devices.list)

  const kpis = useMemo(() => {
    if (!devices) return null
    const total = devices.length
    const online = devices.filter((d) => d.connection === 'ONLINE').length
    const offline = devices.filter((d) => d.connection === 'OFFLINE').length
    const warnings = devices.filter((d) => d.connection === 'WARNING').length
    const cameraIssues = devices.filter((d) => d.camera !== 'GOOD').length
    const sensorIssues = devices.filter((d) => d.triggerSensor !== 'GOOD' || d.fillSensor !== 'GOOD').length
    return { total, online, offline, warnings, cameraIssues, sensorIssues }
  }, [devices])

  const statusColor = (status: string) => {
    if (status === 'GOOD') return 'text-green-600'
    if (status === 'WARNING') return 'text-amber-600'
    if (status === 'ERROR' || status === 'FAILED') return 'text-red-600'
    return 'text-gray-600'
  }

  if (devices === undefined) {
    return <DevicesSkeleton />
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Cpu size={48} className="mb-3 text-gray-300" />
        <p className="text-lg font-medium">No devices found</p>
        <p className="text-sm">Devices will appear here once they are registered.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Device Health</h1>
        <p className="text-gray-500 mt-1">Monitor the status and health of all connected devices.</p>
      </div>

      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard label="Total Devices" value={kpis.total} icon={<Cpu size={22} />} color="blue" />
          <KpiCard label="Online" value={kpis.online} icon={<Wifi size={22} />} color="emerald" />
          <KpiCard label="Offline" value={kpis.offline} icon={<WifiOff size={22} />} color="gray" />
          <KpiCard label="Warnings" value={kpis.warnings} icon={<AlertTriangle size={22} />} color="amber" />
          <KpiCard label="Camera Issues" value={kpis.cameraIssues} icon={<Camera size={22} />} color="red" />
          <KpiCard label="Sensor Issues" value={kpis.sensorIssues} icon={<Radio size={22} />} color="red" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Device ID</th>
                <th className="px-5 py-3">Bin</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Connection</th>
                <th className="px-5 py-3">Last Heartbeat</th>
                <th className="px-5 py-3">Camera</th>
                <th className="px-5 py-3">Sensors</th>
                <th className="px-5 py-3">Storage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {devices.map((device) => (
                <tr key={device._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Cpu size={15} className="text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900 font-mono text-xs">{device.deviceId}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{device.binId || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-700">{device.department}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ConnectionBadge connection={device.connection} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {formatRelativeTime(device.lastHeartbeat)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={statusColor(device.camera)}>
                      {device.camera}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-700 text-xs">
                      {device.triggerSensor}, {device.fillSensor}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={statusColor(device.storage)}>
                      {device.storage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DevicesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded" />
      <div className="h-4 w-72 bg-gray-100 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="h-4 w-20 bg-gray-100 rounded mb-3" />
            <div className="h-8 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
