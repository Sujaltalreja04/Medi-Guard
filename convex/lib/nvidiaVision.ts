const INVOKE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const MODEL = 'microsoft/phi-3.5-vision-instruct'

const ALLOWED_CLASSES = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK',
  'GAUZE_DRESSING', 'MEDICINE_VIAL', 'AMPOULE',
  'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER', 'PAPER_PACKAGING',
  'GENERAL_WASTE', 'UNKNOWN_ITEM',
]

const SYSTEM_PROMPT = `You are the visual classification component of a medical waste monitoring system.

Analyze only what is visually observable in the provided image.

Identify medical or general waste objects visible near the waste-bin disposal area.

Do not infer infection, contamination, chemical composition, radioactivity, patient identity, or medical history from appearance.

Return only valid JSON.

Use only the allowed waste classes supplied by the application.

If the object cannot be identified reliably, classify it as UNKNOWN_ITEM.

If multiple objects are visible, return each object separately.

For each detection provide:
- class
- confidence
- visual_description
- risk_indicator
- uncertainty_reason

Also provide:
- primary_class
- overall_confidence
- image_quality
- requires_review

Never decide whether the disposal is correct or incorrect. The application rule engine handles segregation decisions.

Allowed classes: ${ALLOWED_CLASSES.join(', ')}

Risk indicators: SHARP, INFECTIOUS, PHARMACEUTICAL, CHEMICAL, GENERAL, UNKNOWN

Image quality: GOOD, FAIR, POOR

Response format:
{
  "primaryClass": "SYRINGE",
  "overallConfidence": 0.93,
  "imageQuality": "GOOD",
  "requiresReview": false,
  "detections": [
    {
      "class": "SYRINGE",
      "confidence": 0.93,
      "visualDescription": "Disposable syringe-like object",
      "riskIndicator": "SHARP",
      "uncertaintyReason": null
    }
  ]
}`

interface DetectionInput {
  class: string
  confidence: number
  visual_description?: string
  visualDescription?: string
  risk_indicator?: string
  riskIndicator?: string
  uncertainty_reason?: string | null
  uncertaintyReason?: string | null
}

interface RawResponse {
  primaryClass?: string
  primary_class?: string
  overallConfidence?: number
  overall_confidence?: number
  imageQuality?: string
  image_quality?: string
  requiresReview?: boolean
  requires_review?: boolean
  detections?: DetectionInput[]
}

function normalizeWasteClass(cls: string): string {
  const upper = cls.toUpperCase().replace(/[\s_-]+/g, '_')
  if (ALLOWED_CLASSES.includes(upper)) return upper
  if (upper.includes('SYRING')) return 'SYRINGE'
  if (upper.includes('NEEDLE') || upper.includes('SHARP')) return 'NEEDLE_SHARP'
  if (upper.includes('GLOVE')) return 'GLOVES'
  if (upper.includes('MASK')) return 'FACE_MASK'
  if (upper.includes('GAUZE') || upper.includes('DRESSING') || upper.includes('BANDAGE') || upper.includes('COTTON')) return 'GAUZE_DRESSING'
  if (upper.includes('VIAL') || upper.includes('MEDICINE')) return 'MEDICINE_VIAL'
  if (upper.includes('AMPOULE') || upper.includes('AMPUL')) return 'AMPOULE'
  if (upper.includes('BOTTLE') || upper.includes('PLASTIC')) return 'PLASTIC_BOTTLE'
  if (upper.includes('CONTAINER')) return 'MEDICAL_CONTAINER'
  if (upper.includes('PAPER') || upper.includes('PACKAG') || upper.includes('CARDBOARD')) return 'PAPER_PACKAGING'
  if (upper.includes('GENERAL') || upper.includes('WASTE') || upper.includes('TRASH')) return 'GENERAL_WASTE'
  return 'UNKNOWN_ITEM'
}

function normalizeRiskIndicator(ri: string): string {
  const upper = ri.toUpperCase()
  if (upper.includes('SHARP')) return 'SHARP'
  if (upper.includes('INFECT')) return 'INFECTIOUS'
  if (upper.includes('PHARMA')) return 'PHARMACEUTICAL'
  if (upper.includes('CHEM')) return 'CHEMICAL'
  if (upper.includes('GENERAL')) return 'GENERAL'
  return 'UNKNOWN'
}

function parseResponse(raw: string): RawResponse {
  try {
    const cleaned = raw
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]) } catch {}
    }
    throw new Error('Failed to parse model response')
  }
}

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
): Promise<{
  primaryClass: string
  overallConfidence: number
  imageQuality: string
  requiresReview: boolean
  detections: { class: string; confidence: number; visualDescription: string; riskIndicator: string; uncertaintyReason: string | null }[]
}> {
  // Note: AbortSignal.timeout is NOT available in Convex's runtime — omit it entirely
  const response = await fetch(INVOKE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this medical waste image and return ONLY valid JSON with the structure described in the system prompt.',
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`NVIDIA API error ${response.status}: ${errorText.slice(0, 300)}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    // Return a safe fallback rather than crashing
    return {
      primaryClass: 'UNKNOWN_ITEM',
      overallConfidence: 0,
      imageQuality: 'POOR',
      requiresReview: true,
      detections: [],
    }
  }

  const raw = parseResponse(content)

  const primaryClass = normalizeWasteClass(raw.primaryClass || raw.primary_class || 'UNKNOWN_ITEM')
  const overallConfidence = Math.min(1, Math.max(0, raw.overallConfidence ?? raw.overall_confidence ?? 0))
  const imageQuality = ['GOOD', 'FAIR', 'POOR'].includes(raw.imageQuality || raw.image_quality || '') ? (raw.imageQuality || raw.image_quality || 'FAIR') : 'FAIR'
  const requiresReview = raw.requiresReview ?? raw.requires_review ?? (overallConfidence < 0.65)

  const detections = (raw.detections || []).map((d: DetectionInput) => ({
    class: normalizeWasteClass(d.class || 'UNKNOWN_ITEM'),
    confidence: Math.min(1, Math.max(0, d.confidence ?? 0)),
    visualDescription: d.visual_description || d.visualDescription || '',
    riskIndicator: normalizeRiskIndicator(d.risk_indicator || d.riskIndicator || 'UNKNOWN'),
    uncertaintyReason: d.uncertainty_reason || d.uncertaintyReason || null,
  }))

  return { primaryClass, overallConfidence, imageQuality, requiresReview, detections }
}
