import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Brain, CheckCircle, XCircle, Eye, Target, Loader2 } from 'lucide-react'
import StatusBadge from '../components/shared/StatusBadge'
import KpiCard from '../components/shared/KpiCard'
import { formatConfidence } from '../lib/utils'


export default function AiPerformance() {
  const overview = useQuery(api.analytics.overview)
  const dashboard = useQuery(api.analytics.dashboard)

  if (!overview || !dashboard) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const totalAnalyses = overview.totalEvents
  const successfulAnalyses = dashboard.recentEvents.filter(
    (e) => e.decision !== 'AI_ANALYSIS_FAILED' && e.decision !== 'SENSOR_ERROR',
  ).length
  const failedAnalyses = totalAnalyses - successfulAnalyses
  const avgConfidence = dashboard.recentEvents.reduce((sum, e) => sum + (e.confidence || 0), 0) / (dashboard.recentEvents.length || 1)
  const reviewedEvents = dashboard.recentEvents.filter((e) => e.reviewedAt).length
  const confirmedDetections = dashboard.confirmedViolations

  const classMetrics = dashboard.recentEvents.reduce<Record<string, { count: number; confidenceSum: number; reviewed: number }>>((acc, e) => {
    const cls = e.detectedClass || 'UNKNOWN_ITEM'
    if (!acc[cls]) acc[cls] = { count: 0, confidenceSum: 0, reviewed: 0 }
    acc[cls].count++
    acc[cls].confidenceSum += e.confidence || 0
    if (e.reviewedAt) acc[cls].reviewed++
    return acc
  }, {})

  const classMetricsArray = Object.entries(classMetrics).map(([cls, data]) => ({
    class: cls,
    count: data.count,
    avgConfidence: data.confidenceSum / data.count,
    reviewRate: data.reviewed / data.count,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Performance</h1>
          <p className="text-sm text-gray-500 mt-1">AI model performance metrics and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Model Information</h2>
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
              <span className="text-sm text-gray-500">Model Identifier</span>
              <span className="text-sm font-mono text-gray-600">minimaxai/minimax-m3</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Status</span>
              <StatusBadge label="Active" variant="green" dot />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <KpiCard label="Total Analyses" value={totalAnalyses} icon={<Brain className="w-5 h-5" />} color="purple" />
          <KpiCard label="Successful" value={successfulAnalyses} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
          <KpiCard label="Failed" value={failedAnalyses} icon={<XCircle className="w-5 h-5" />} color="red" />
          <KpiCard label="Avg Confidence" value={formatConfidence(avgConfidence)} icon={<Target className="w-5 h-5" />} color="blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Review & Detection Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Reviewed Events</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{reviewedEvents}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Confirmed Detections</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{confirmedDetections}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Class Metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Class</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Count</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Avg Confidence</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Review Rate</th>
                </tr>
              </thead>
              <tbody>
                {classMetricsArray.map((m) => (
                  <tr key={m.class} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-900 font-medium">{m.class.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-2 text-right text-gray-900">{m.count}</td>
                    <td className="py-2 px-2 text-right">
                      <StatusBadge
                        label={formatConfidence(m.avgConfidence)}
                        variant={m.avgConfidence >= 0.85 ? 'green' : m.avgConfidence >= 0.65 ? 'amber' : 'red'}
                      />
                    </td>
                    <td className="py-2 px-2 text-right">{Math.round(m.reviewRate * 100)}%</td>
                  </tr>
                ))}
                {classMetricsArray.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">No class metrics available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
