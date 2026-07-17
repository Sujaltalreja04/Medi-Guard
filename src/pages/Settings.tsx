import { useState } from 'react'
import { Settings as SettingsIcon, Brain, Bell, HardDrive, Activity, Wifi, Server, Database } from 'lucide-react'
import StatusBadge from '../components/shared/StatusBadge'

interface ToggleSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface SliderSetting {
  id: string
  label: string
  description: string
  value: number
  min: number
  max: number
  unit: string
}

export default function Settings() {
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected')
  const [testResult, setTestResult] = useState<string | null>(null)

  const [notifications, setNotifications] = useState<ToggleSetting[]>([
    { id: 'violation-alerts', label: 'Violation Alerts', description: 'Push notifications for waste segregation violations', enabled: true },
    { id: 'capacity-warnings', label: 'Capacity Warnings', description: 'Alerts when bins approach full capacity', enabled: true },
    { id: 'device-offline', label: 'Device Offline', description: 'Notifications when devices go offline', enabled: false },
    { id: 'daily-summary', label: 'Daily Summary', description: 'End-of-day performance summary report', enabled: true },
    { id: 'critical-incidents', label: 'Critical Incidents', description: 'Immediate alerts for critical violations', enabled: true },
  ])

  const [retentionSliders, setRetentionSliders] = useState<SliderSetting[]>([
    { id: 'event-retention', label: 'Disposal Events', description: 'How long to retain disposal event records', value: 90, min: 30, max: 365, unit: 'days' },
    { id: 'alert-retention', label: 'Alerts', description: 'How long to retain resolved alerts', value: 60, min: 7, max: 180, unit: 'days' },
    { id: 'audit-retention', label: 'Audit Logs', description: 'How long to retain audit trail entries', value: 180, min: 30, max: 730, unit: 'days' },
    { id: 'image-retention', label: 'Captured Images', description: 'How long to retain disposal images', value: 30, min: 7, max: 90, unit: 'days' },
  ])

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    )
  }

  const updateSlider = (id: string, value: number) => {
    setRetentionSliders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s)),
    )
  }

  const handleTestConnection = () => {
    setTestResult(null)
    setTimeout(() => setTestResult('Connection successful (200ms)'), 1500)
  }

  const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-gray-50 text-gray-600">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure system preferences and integrations</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <SectionHeader icon={Server} title="General" description="Application information" />
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Application</span>
              <span className="text-sm font-medium text-gray-900">MediGuard</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Version</span>
              <span className="text-sm font-medium text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <SectionHeader icon={Brain} title="AI Integration" description="AI model provider configuration" />
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Provider</span>
              <StatusBadge label="NVIDIA" variant="emerald" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Model</span>
              <span className="text-sm font-medium text-gray-900">MiniMax M3</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Connection Status</span>
              <StatusBadge
                label={connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'testing' ? 'Testing...' : 'Disconnected'}
                variant={connectionStatus === 'connected' ? 'green' : connectionStatus === 'testing' ? 'amber' : 'red'}
                dot
              />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Last Successful Analysis</span>
              <span className="text-sm text-gray-600">2 minutes ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Average Latency</span>
              <span className="text-sm font-medium text-gray-900">245ms</span>
            </div>
            <div className="pt-2">
              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Activity className="w-4 h-4" />
                {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              {testResult && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
                  <Wifi className="w-4 h-4" />
                  {testResult}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <SectionHeader icon={Bell} title="Notifications" description="Configure notification preferences" />
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(n.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    n.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      n.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <SectionHeader icon={HardDrive} title="Data Retention" description="Configure data retention periods" />
          <div className="space-y-6">
            {retentionSliders.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{s.value} {s.unit}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={s.value}
                  onChange={(e) => updateSlider(s.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{s.min} {s.unit}</span>
                  <span>{s.max} {s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
