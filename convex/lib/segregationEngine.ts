import type { Doc } from '../_generated/dataModel'

interface RuleInput {
  binType: string
  wasteClass: string
  confidence: number
  rules: Doc<'segregationRules'>[]
}

interface EngineResult {
  decision: string
  severity: string
  matchedRule: string | null
}

export function evaluateSegregation(input: RuleInput): EngineResult {
  const { binType, wasteClass, confidence, rules } = input

  if (confidence < 0.4) {
    return { decision: 'LOW_CONFIDENCE_REVIEW', severity: 'MEDIUM', matchedRule: null }
  }

  const applicableRules = rules.filter(
    (r) => r.binType === binType && r.wasteClass === wasteClass && r.status === 'ACTIVE',
  )

  if (applicableRules.length === 0) {
    return { decision: 'UNKNOWN_ITEM', severity: 'LOW', matchedRule: null }
  }

  applicableRules.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 }
    return (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  })

  const matched = applicableRules[0]

  if (confidence < matched.minimumConfidence) {
    return { decision: 'LOW_CONFIDENCE_REVIEW', severity: 'MEDIUM', matchedRule: matched.ruleId }
  }

  return { decision: matched.result, severity: matched.severity, matchedRule: matched.ruleId }
}
