import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useAction } from 'convex/react'
import { Upload, Scan, Camera, AlertTriangle, CheckCircle2, ChevronRight, Building2, Layers, X, RefreshCw, FlaskConical } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { DecisionBadge, SeverityBadge } from '../components/shared/StatusBadge'
import { formatWasteClass, formatConfidence } from '../lib/utils'


const stages = [
  { key: 'received', label: 'Event received' },
  { key: 'analysis', label: 'Image analysis' },
  { key: 'identified', label: 'Object identified' },
  { key: 'evaluated', label: 'Rules evaluated' },
  { key: 'decision', label: 'Decision generated' },
]

export default function Analyze() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const facilities = useQuery(api.facilities.list)
  const bins = useQuery(api.bins.list)
  const analyzeWasteImage = useAction(api.vision.analyzeWasteImage)

  const [facilityId, setFacilityId] = useState('')
  const [department, setDepartment] = useState('')
  const [binId, setBinId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')

  const [state, setState] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle')
  const [currentStage, setCurrentStage] = useState(0)
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeWasteImage>> | null>(null)

  const selectedFacility = facilities?.find(f => f._id === facilityId)
  const filteredBins = bins?.filter(b => b.facilityId === facilityId) ?? []

  useEffect(() => {
    if (state !== 'analyzing') return
    if (currentStage >= stages.length) return
    const timer = setTimeout(() => setCurrentStage(c => c + 1), 800)
    return () => clearTimeout(timer)
  }, [state, currentStage])

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setImageError('')
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImageError('Please drop a valid image file.')
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Invalid file type. Please select an image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image too large. Maximum 10 MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    setError('')

    if (!facilityId) { setError('Please select a facility.'); return }
    if (!department) { setError('Please select a department.'); return }
    if (!binId) { setError('Please select a bin.'); return }
    if (!imageFile) { setError('Please upload an image to analyze.'); return }

    setState('analyzing')
    setCurrentStage(0)
    setResult(null)

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const comma = dataUrl.indexOf(',')
          resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl)
        }
        reader.onerror = () => reject(new Error('Failed to read image file'))
        reader.readAsDataURL(imageFile)
      })

      const res = await analyzeWasteImage({
        imageBase64: base64,
        mimeType: imageFile.type,
        facilityId: facilityId as any,
        department,
        binId: binId as any,
      })

      setResult(res as any)
      setState('success')
    } catch (err: any) {
      setError(err?.message || 'Analysis failed. Please try again.')
      setState('error')
    }
  }

  const resetForm = () => {
    setFacilityId('')
    setDepartment('')
    setBinId('')
    clearImage()
    setError('')
    setState('idle')
    setCurrentStage(0)
    setResult(null)
    setImageError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analyze Waste</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload an image to classify waste and check segregation compliance</p>
        </div>
      </div>

      {state === 'success' && result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800">Analysis Complete</p>
            <p className="text-xs text-emerald-700 mt-0.5">Event {result.eventId} has been recorded.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate(`/events/${result.eventId}`)}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Event
            </button>
            <button
              onClick={resetForm}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      )}

      {error && state !== 'analyzing' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              Location Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Facility</label>
                <select
                  value={facilityId}
                  onChange={(e) => { setFacilityId(e.target.value); setDepartment(''); setBinId('') }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  disabled={state === 'analyzing'}
                >
                  <option value="">Select facility</option>
                  {facilities?.map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
                {!facilities && (
                  <p className="text-xs text-gray-400 mt-1">Loading facilities...</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                  disabled={!selectedFacility || state === 'analyzing'}
                >
                  <option value="">Select department</option>
                  {selectedFacility?.departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bin</label>
                <select
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                  disabled={!facilityId || state === 'analyzing'}
                >
                  <option value="">Select bin</option>
                  {filteredBins.map(b => (
                    <option key={b._id} value={b._id}>{b.name} ({b.binId})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Camera size={16} className="text-gray-400" />
              Waste Image
            </h2>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Waste preview"
                  className="w-full h-56 object-contain rounded-lg border border-gray-200 bg-gray-50"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  disabled={state === 'analyzing'}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleImageDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <div className="text-sm font-medium">Drag & drop or click to upload</div>
                  <div className="text-xs">Supports JPG, PNG, WebP · Max 10 MB</div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            )}
            {imageError && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                {imageError}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={state === 'analyzing'}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              state === 'analyzing'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            {state === 'analyzing' ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan size={16} />
                Analyze Waste
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Layers size={16} className="text-gray-400" />
              Processing Stages
            </h2>
            <div className="space-y-0">
              {stages.map((stage, i) => {
                const active = state === 'analyzing' && i <= currentStage
                const done = state === 'success' || (state === 'analyzing' && i < currentStage)
                const failed = state === 'error' && i === currentStage - 1

                return (
                  <div key={stage.key} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-emerald-100 text-emerald-600' :
                      failed ? 'bg-red-100 text-red-600' :
                      active ? 'bg-emerald-100 text-emerald-600' :
                      'bg-gray-100 text-gray-300'
                    }`}>
                      {done ? (
                        <CheckCircle2 size={14} />
                      ) : failed ? (
                        <X size={14} />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                      )}
                    </div>
                    <span className={`text-sm ${
                      done ? 'text-gray-900 font-medium' :
                      failed ? 'text-red-600 font-medium' :
                      active ? 'text-gray-900' :
                      'text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                    {i < stages.length - 1 && (
                      <ChevronRight size={12} className={`shrink-0 ml-auto ${
                        done || active ? 'text-emerald-400' : 'text-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            {state === 'analyzing' && currentStage >= stages.length && (
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-emerald-600">
                <div className="w-3 h-3 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                Finalizing results...
              </div>
            )}
          </div>

          {state === 'success' && result && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FlaskConical size={16} className="text-gray-400" />
                Analysis Result
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Detected Object</span>
                  <span className="font-semibold text-gray-900">{formatWasteClass(result.analysis.primaryClass)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-semibold">{formatConfidence(result.analysis.overallConfidence)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Image Quality</span>
                  <span className="font-semibold text-gray-900 capitalize">{result.analysis.imageQuality.toLowerCase()}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rule Result</span>
                  <DecisionBadge decision={result.ruleResult.decision} />
                </div>
                {result.ruleResult.severity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Severity</span>
                    <SeverityBadge severity={result.ruleResult.severity} />
                  </div>
                )}
                {result.analysis.requiresReview && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>This result requires manual review.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Analysis Failed</p>
                <p className="text-xs text-gray-500">{error}</p>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 mt-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <RefreshCw size={14} />
                  Retry Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
