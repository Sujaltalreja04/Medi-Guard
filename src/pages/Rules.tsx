import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Scale, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import StatusBadge from '../components/shared/StatusBadge'
import { WASTE_CLASSES, BIN_TYPES, DECISION_COLORS } from '../constants'
import type { SegregationRule, Decision } from '../types'
import { formatWasteClass } from '../lib/utils'

const CELL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CORRECT: { bg: 'bg-green-100 hover:bg-green-200', text: 'text-green-800', label: 'Allowed' },
  PROBABLE_VIOLATION: { bg: 'bg-amber-100 hover:bg-amber-200', text: 'text-amber-800', label: 'Warning' },
  CRITICAL_VIOLATION: { bg: 'bg-red-100 hover:bg-red-200', text: 'text-red-800', label: 'Critical' },
  LOW_CONFIDENCE_REVIEW: { bg: 'bg-yellow-100 hover:bg-yellow-200', text: 'text-yellow-800', label: 'Review' },
  UNKNOWN_ITEM: { bg: 'bg-gray-100 hover:bg-gray-200', text: 'text-gray-800', label: 'Unknown' },
}

const NEXT_STATE: Record<string, Decision | null> = {
  CORRECT: 'PROBABLE_VIOLATION',
  PROBABLE_VIOLATION: 'CRITICAL_VIOLATION',
  CRITICAL_VIOLATION: 'LOW_CONFIDENCE_REVIEW',
  LOW_CONFIDENCE_REVIEW: 'UNKNOWN_ITEM',
  UNKNOWN_ITEM: null,
}

const SENTINEL = '__no_rule__'

export default function Rules() {
  const rules = useQuery(api.rules.list)
  const [editing, setEditing] = useState<{ wasteClass: string; binType: string } | null>(null)
  const [localRules, setLocalRules] = useState<Record<string, SegregationRule>>({})

  if (!rules) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  const ruleMap: Record<string, SegregationRule> = { ...localRules }
  rules.forEach((r) => {
    const key = `${r.wasteClass}:${r.binType}`
    if (!localRules[key]) {
      ruleMap[key] = r
    }
  })

  const getCell = (wasteClass: string, binType: string) => {
    const key = `${wasteClass}:${binType}`
    return ruleMap[key]
  }

  const handleCellClick = (wasteClass: string, binType: string) => {
    setEditing({ wasteClass, binType })
  }

  const handleStateChange = (wasteClass: string, binType: string, newResult: Decision | null) => {
    const key = `${wasteClass}:${binType}`
    if (newResult === null) {
      setLocalRules((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } else {
      const existing = ruleMap[key]
      setLocalRules((prev) => ({
        ...prev,
        [key]: {
          ...existing,
          wasteClass: wasteClass as any,
          binType: binType as any,
          result: newResult,
          status: 'ACTIVE',
        } as SegregationRule,
      }))
    }
    setEditing(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segregation Rules Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Define allowed waste-bin combinations and violation thresholds</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 text-left py-3 px-4 text-gray-500 font-medium border-b border-r border-gray-200 min-w-[160px]">
                Waste Class
              </th>
              {BIN_TYPES.map((bt) => (
                <th key={bt} className="text-center py-3 px-3 text-gray-500 font-medium border-b border-gray-200 min-w-[120px]">
                  {bt.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WASTE_CLASSES.map((wc) => (
              <tr key={wc}>
                <td className="sticky left-0 bg-white z-10 py-2.5 px-4 text-gray-900 font-medium border-b border-r border-gray-200">
                  {formatWasteClass(wc)}
                </td>
                {BIN_TYPES.map((bt) => {
                  const cell = getCell(wc, bt)
                  const isEditing = editing?.wasteClass === wc && editing?.binType === bt
                  const style = cell ? CELL_STYLES[cell.result] : null
                  const nextResult = cell ? NEXT_STATE[cell.result] : 'CORRECT'

                  return (
                    <td key={bt} className="border-b border-gray-100 p-1.5 text-center">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          {nextResult && (
                            <button
                              onClick={() => handleStateChange(wc, bt, nextResult as Decision)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                CELL_STYLES[nextResult]?.bg || 'bg-gray-100'
                              } ${CELL_STYLES[nextResult]?.text || 'text-gray-800'}`}
                            >
                              {CELL_STYLES[nextResult]?.label || nextResult}
                            </button>
                          )}
                          <button
                            onClick={() => handleStateChange(wc, bt, null)}
                            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-2 py-1 rounded text-xs font-medium bg-white border border-gray-200 text-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCellClick(wc, bt)}
                          className={`w-full px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                            style ? `${style.bg} ${style.text}` : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {style ? style.label : '—'}
                          {cell && (
                            <div className="mt-1">
                              <StatusBadge
                                label={cell.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                variant={cell.status === 'ACTIVE' ? 'green' : 'gray'}
                              />
                            </div>
                          )}
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100" /> Allowed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100" /> Warning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100" /> Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-50 border border-gray-200" /> No rule
        </span>
        <span className="ml-auto text-gray-400">Click any cell to edit the rule state</span>
      </div>
    </div>
  )
}
