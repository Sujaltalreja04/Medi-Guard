import { useQuery } from 'convex/react'
import { Monitor, Thermometer, Wifi, WifiOff, AlertTriangle, Trash2, Building2, HardDrive, ScanLine, BrainCircuit } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import FillBar from '../components/shared/FillBar'
import { ConnectionBadge } from '../components/shared/StatusBadge'
import { formatRelativeTime } from '../lib/utils'

interface BinDoc {
  _id: string
  _creationTime: number
  name: string
  binId: string
  facilityId: string
  department: string
  type: string
  wasteStream: string
  fillLevel: number
  status: string
  deviceId?: string
  lastCollection?: number
  lastDisposal?: number
  openAlerts: number
  warningThreshold: number
  criticalThreshold: number
}

interface DeviceDoc {
  _id: string
  _creationTime: number
  deviceId: string
  binId?: string
  facilityId: string
  department: string
  connection: string
  lastHeartbeat: number
  camera: string
  triggerSensor: string
  fillSensor: string
  storage: string
  softwareVersion: string
  aiIntegrationVersion: string
  queueDepth: number
}

export default function Monitoring() {
  const bins = useQuery(api.bins.list)
  const devices = useQuery(api.devices.list)

  if (bins === undefined || devices === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm">Loading monitoring data...</span>
        </div>
      </div>
    )
  }

  if (bins.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
          <Trash2 size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No waste stations found</p>
        <p className="text-gray-400 text-xs mt-1">Add bins to start monitoring fill levels and device health.</p>
      </div>
    )
  }

  const deviceMap = new Map<string, DeviceDoc>()
  for (const d of devices) {
    if (d.binId) deviceMap.set(d.binId, d)
  }

  const wasteStreamIcon: Record<string, any> = {
    SHARPS: ScanLine,
    INFECTIOUS: AlertTriangle,
    PHARMACEUTICAL: Thermometer,
    CHEMICAL: AlertTriangle,
    RECYCLABLE: Trash2,
    GENERAL_WASTE: Trash2,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Live Monitoring</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bins.length} station{bins.length !== 1 ? 's' : ''} · {devices.filter(d => d.connection === 'ONLINE').length} online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {bins.map((bin) => {
          const device = deviceMap.get(bin._id)
          const StreamIcon = wasteStreamIcon[bin.wasteStream] || Trash2
          const lastDetection = bin.lastDisposal

          return (
            <div
              key={bin._id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{bin.name}</h3>
                    {device?.connection === 'ONLINE' ? (
                      <Wifi size={14} className="text-green-500 shrink-0" />
                    ) : device?.connection === 'WARNING' ? (
                      <Wifi size={14} className="text-amber-500 shrink-0" />
                    ) : (
                      <WifiOff size={14} className="text-red-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{bin.binId}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{bin.type.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Building2 size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{bin.department}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <StreamIcon size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{bin.wasteStream.replace(/_/g, ' ')}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">Fill Level</span>
                    <span className={bin.fillLevel >= 90 ? 'text-red-600 font-semibold' : bin.fillLevel >= 70 ? 'text-amber-600' : 'text-gray-500'}>
                      {Math.round(bin.fillLevel)}%
                    </span>
                  </div>
                  <FillBar level={bin.fillLevel} showLabel={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={13} className="text-gray-400 shrink-0" />
                    {device ? (
                      <ConnectionBadge connection={device.connection} />
                    ) : (
                      <span className="text-xs text-gray-400">No device</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <BrainCircuit size={12} />
                    <span>Active</span>
                  </div>
                </div>

                {lastDetection ? (
                  <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-2 mt-1">
                    Last detection: {formatRelativeTime(lastDetection)}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-300 border-t border-gray-100 pt-2 mt-1">
                    No recent detections
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
