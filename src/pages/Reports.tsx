import { useState } from 'react'
import {
  FileText, Sun, ClipboardCheck, ShieldAlert, Kanban, Clock, Brain, ScrollText,
  Download, Loader2,
} from 'lucide-react'

const REPORT_TYPES = [
  {
    id: 'daily-operations',
    title: 'Daily Operations Summary',
    description: 'Overview of daily waste disposal operations, volumes, and key metrics',
    icon: Sun,
  },
  {
    id: 'weekly-compliance',
    title: 'Weekly Compliance Summary',
    description: 'Weekly compliance scores, violation trends, and department performance',
    icon: ClipboardCheck,
  },
  {
    id: 'waste-segregation',
    title: 'Waste Segregation Report',
    description: 'Detailed breakdown of waste segregation accuracy and classification performance',
    icon: Kanban,
  },
  {
    id: 'critical-incident',
    title: 'Critical Incident Report',
    description: 'Report of critical violations, high-severity alerts, and required actions',
    icon: ShieldAlert,
  },
  {
    id: 'bin-capacity',
    title: 'Bin Capacity Report',
    description: 'Bin fill level trends, capacity warnings, and collection scheduling insights',
    icon: Clock,
  },
  {
    id: 'device-uptime',
    title: 'Device Uptime Report',
    description: 'Device connectivity, uptime statistics, and maintenance recommendations',
    icon: FileText,
  },
  {
    id: 'ai-performance',
    title: 'AI Performance Report',
    description: 'AI analysis accuracy, confidence trends, and model performance metrics',
    icon: Brain,
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail Report',
    description: 'Complete audit log of all system actions, changes, and user activities',
    icon: ScrollText,
  },
]

export default function Reports() {
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const handleGenerate = (id: string) => {
    setGeneratingId(id)
    setTimeout(() => setGeneratingId(null), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download system reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-600 w-fit mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{report.title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex-1">{report.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerate(report.id)}
                  disabled={generatingId === report.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {generatingId === report.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {generatingId === report.id ? 'Generating...' : 'Generate'}
                </button>
                <button className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
