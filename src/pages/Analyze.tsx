import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useAction } from 'convex/react'
import { Upload, Scan, Camera, AlertTriangle, CheckCircle2, ChevronRight, Building2, Layers, X, RefreshCw, FlaskConical } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { DecisionBadge, SeverityBadge } from '../components/shared/StatusBadge'
import { formatWasteClass, formatConfidence } from '../lib/utils'

/* ─── Dark style tokens ─── */
const card   = { background: '#0e1525', border: '1px solid #1a2640', borderRadius: '1rem' }
const inputS = { background: '#0b1120', border: '1px solid #1a2640', color: '#e8edf5', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', width: '100%', outline: 'none' }
const labelS = { color: '#6677a0', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }

const stages = [
  { key: 'received',   label: 'Event received' },
  { key: 'analysis',  label: 'Image analysis' },
  { key: 'identified',label: 'Object identified' },
  { key: 'evaluated', label: 'Rules evaluated' },
  { key: 'decision',  label: 'Decision generated' },
]

export default function Analyze() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const facilities = useQuery(api.facilities.list)
  const bins = useQuery(api.bins.list)
  const analyzeWasteImage = useAction(api.vision.analyzeWasteImage)

  const [facilityId, setFacilityId]   = useState('')
  const [department, setDepartment]   = useState('')
  const [binId, setBinId]             = useState('')
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError]             = useState('')
  const [imageError, setImageError]   = useState('')
  const [state, setState]             = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle')
  const [currentStage, setCurrentStage] = useState(0)
  const [result, setResult]           = useState<Awaited<ReturnType<typeof analyzeWasteImage>> | null>(null)

  const selectedFacility = facilities?.find(f => f._id === facilityId)
  const filteredBins = bins?.filter(b => b.facilityId === facilityId) ?? []

  useEffect(() => {
    if (state !== 'analyzing') return
    if (currentStage >= stages.length) return
    const timer = setTimeout(() => setCurrentStage(c => c + 1), 800)
    return () => clearTimeout(timer)
  }, [state, currentStage])

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false); setImageError('')
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
    else setImageError('Please drop a valid image file.')
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError('Invalid file type. Please select an image.'); return }
    if (file.size > 10 * 1024 * 1024) { setImageError('Image too large. Maximum 10 MB.'); return }
    setImageFile(file); setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null); setImagePreview(null); setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    setError('')
    if (!facilityId) { setError('Please select a facility.'); return }
    if (!department) { setError('Please select a department.'); return }
    if (!binId)      { setError('Please select a bin.'); return }
    if (!imageFile)  { setError('Please upload an image to analyze.'); return }

    setState('analyzing'); setCurrentStage(0); setResult(null)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => { const d = reader.result as string; const c = d.indexOf(','); resolve(c >= 0 ? d.slice(c + 1) : d) }
        reader.onerror = () => reject(new Error('Failed to read image file'))
        reader.readAsDataURL(imageFile)
      })
      const res = await analyzeWasteImage({ imageBase64: base64, mimeType: imageFile.type, facilityId: facilityId as any, department, binId: binId as any })
      setResult(res as any); setState('success')
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please try again.'); setState('error')
    }
  }

  const resetForm = () => {
    setFacilityId(''); setDepartment(''); setBinId(''); clearImage()
    setError(''); setState('idle'); setCurrentStage(0); setResult(null); setImageError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#e8edf5' }}>Analyze Waste</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6677a0' }}>Upload an image to classify waste and check segregation compliance</p>
        </div>
      </div>

      {/* Success banner */}
      {state === 'success' && result && (
        <div className="rounded-xl p-4 mb-5 flex items-start gap-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: '#10b981' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#34d399' }}>Analysis Complete</p>
            <p className="text-xs mt-0.5" style={{ color: '#6ee7b7' }}>Event {result.eventId} has been recorded.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => navigate(`/events/${result.eventId}`)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{ background: '#10b981', color: '#fff' }}>
              View Event
            </button>
            <button onClick={resetForm}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
              New Analysis
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && state !== 'analyzing' && (
        <div className="rounded-xl p-3 mb-4 flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto" style={{ color: '#f87171' }}><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Location card */}
          <div className="p-4 shadow-sm" style={card}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8edf5' }}>
              <Building2 size={16} style={{ color: '#4d6080' }} />
              Location Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label style={labelS}>Facility</label>
                <select value={facilityId} onChange={(e) => { setFacilityId(e.target.value); setDepartment(''); setBinId('') }} style={inputS} disabled={state === 'analyzing'}>
                  <option value="">Select facility</option>
                  {facilities?.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ ...inputS, opacity: !selectedFacility || state === 'analyzing' ? 0.5 : 1 }} disabled={!selectedFacility || state === 'analyzing'}>
                  <option value="">Select department</option>
                  {selectedFacility?.departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>Bin</label>
                <select value={binId} onChange={(e) => setBinId(e.target.value)} style={{ ...inputS, opacity: !facilityId || state === 'analyzing' ? 0.5 : 1 }} disabled={!facilityId || state === 'analyzing'}>
                  <option value="">Select bin</option>
                  {filteredBins.map(b => <option key={b._id} value={b._id}>{b.name} ({b.binId})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Image card */}
          <div className="p-4 shadow-sm" style={card}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8edf5' }}>
              <Camera size={16} style={{ color: '#4d6080' }} />
              Waste Image
            </h2>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Waste preview" className="w-full h-56 object-contain rounded-xl" style={{ background: '#0b1120', border: '1px solid #1a2640' }} />
                <button onClick={clearImage} disabled={state === 'analyzing'}
                  className="absolute top-2 right-2 p-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(14,21,37,0.85)', border: '1px solid #1a2640', color: '#8899b4' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleImageDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                style={{
                  background: isDragging ? 'rgba(16,185,129,0.06)' : '#0b1120',
                  borderColor: isDragging ? 'rgba(16,185,129,0.5)' : '#1a2640',
                }}
              >
                <div className="flex flex-col items-center gap-2" style={{ color: '#4d6080' }}>
                  <Upload size={28} />
                  <div className="text-sm font-medium" style={{ color: '#8899b4' }}>Drag &amp; drop or click to upload</div>
                  <div className="text-xs">Supports JPG, PNG, WebP · Max 10 MB</div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </div>
            )}
            {imageError && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#f87171' }}>
                <AlertTriangle size={12} />{imageError}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={state === 'analyzing'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            style={state === 'analyzing'
              ? { background: '#131d30', color: '#4d6080', cursor: 'not-allowed' }
              : { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}
          >
            {state === 'analyzing' ? (
              <><div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4d6080', borderTopColor: '#10b981' }} /> Analyzing...</>
            ) : (
              <><Scan size={16} /> Analyze Waste</>
            )}
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Processing stages */}
          <div className="p-4 shadow-sm" style={card}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8edf5' }}>
              <Layers size={16} style={{ color: '#4d6080' }} />
              Processing Stages
            </h2>
            <div>
              {stages.map((stage, i) => {
                const done   = state === 'success' || (state === 'analyzing' && i < currentStage)
                const active = state === 'analyzing' && i <= currentStage && !done
                const failed = state === 'error' && i === currentStage - 1

                return (
                  <div key={stage.key} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < stages.length - 1 ? '1px solid #1a2640' : 'none' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: done ? 'rgba(16,185,129,0.15)' : failed ? 'rgba(239,68,68,0.15)' : active ? 'rgba(16,185,129,0.1)' : '#131d30',
                        color: done ? '#10b981' : failed ? '#ef4444' : active ? '#10b981' : '#4d6080',
                      }}>
                      {done   ? <CheckCircle2 size={14} /> :
                       failed ? <X size={14} /> :
                       <div className="w-2 h-2 rounded-full" style={{ background: active ? '#10b981' : '#243352', animation: active ? 'pulse 1.5s infinite' : 'none' }} />}
                    </div>
                    <span className="text-sm" style={{ color: done ? '#e8edf5' : failed ? '#f87171' : active ? '#b0c0d8' : '#4d6080', fontWeight: done || active ? 500 : 400 }}>
                      {stage.label}
                    </span>
                    {i < stages.length - 1 && (
                      <ChevronRight size={12} className="ml-auto shrink-0" style={{ color: done || active ? '#10b981' : '#243352' }} />
                    )}
                  </div>
                )
              })}
            </div>
            {state === 'analyzing' && currentStage >= stages.length && (
              <div className="flex items-center justify-center gap-2 mt-3 text-xs" style={{ color: '#10b981' }}>
                <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(16,185,129,0.3)', borderTopColor: '#10b981' }} />
                Finalizing results...
              </div>
            )}
          </div>

          {/* Analysis result */}
          {state === 'success' && result && (
            <div className="p-4 shadow-sm" style={card}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8edf5' }}>
                <FlaskConical size={16} style={{ color: '#10b981' }} />
                Analysis Result
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Detected Object',  val: formatWasteClass(result.analysis.primaryClass) },
                  { label: 'Confidence',        val: formatConfidence(result.analysis.overallConfidence) },
                  { label: 'Image Quality',     val: result.analysis.imageQuality.toLowerCase() },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: '#6677a0' }}>{label}</span>
                    <span className="font-semibold capitalize" style={{ color: '#e8edf5' }}>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #1a2640', paddingTop: '0.75rem' }} />
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#6677a0' }}>Rule Result</span>
                  <DecisionBadge decision={result.ruleResult.decision} />
                </div>
                {result.ruleResult.severity && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#6677a0' }}>Severity</span>
                    <SeverityBadge severity={result.ruleResult.severity} />
                  </div>
                )}
                {result.analysis.requiresReview && (
                  <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>This result requires manual review.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="p-4 shadow-sm" style={{ ...card, border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <AlertTriangle size={20} style={{ color: '#f87171' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#e8edf5' }}>Analysis Failed</p>
                <p className="text-xs" style={{ color: '#6677a0' }}>{error}</p>
                <button onClick={handleSubmit} className="flex items-center gap-1.5 mt-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <RefreshCw size={14} /> Retry Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
