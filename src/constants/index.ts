export const WASTE_CLASSES = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK',
  'GAUZE_DRESSING', 'MEDICINE_VIAL', 'AMPOULE',
  'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER', 'PAPER_PACKAGING',
  'GENERAL_WASTE', 'UNKNOWN_ITEM',
] as const

export const BIN_TYPES = [
  'GENERAL_WASTE', 'SHARPS', 'INFECTIOUS', 'PHARMACEUTICAL', 'CHEMICAL', 'RECYCLABLE',
] as const

export const DEPARTMENTS = [
  'Emergency', 'ICU', 'Surgery', 'Pathology Lab',
  'General Ward', 'Radiology', 'Pharmacy', 'Outpatient Department',
] as const

export const FACILITIES = [
  { name: 'City General Hospital', code: 'CGH' },
  { name: 'St. Mary\'s Medical Center', code: 'SMM' },
  { name: 'Northside Health Institute', code: 'NHI' },
] as const

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.65,
  LOW: 0.40,
} as const

export const FILL_THRESHOLDS = {
  EMPTY: 20,
  NORMAL: 70,
  ALMOST_FULL: 90,
} as const

export const SEVERITY_COLORS = {
  CRITICAL: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  LOW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  INFO: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' },
} as const

export const DECISION_COLORS = {
  CORRECT: { badge: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
  PROBABLE_VIOLATION: { badge: 'bg-amber-100 text-amber-800', icon: 'AlertTriangle' },
  CRITICAL_VIOLATION: { badge: 'bg-red-100 text-red-800', icon: 'AlertCircle' },
  LOW_CONFIDENCE_REVIEW: { badge: 'bg-yellow-100 text-yellow-800', icon: 'HelpCircle' },
  UNKNOWN_ITEM: { badge: 'bg-gray-100 text-gray-800', icon: 'HelpCircle' },
  AI_ANALYSIS_FAILED: { badge: 'bg-red-100 text-red-800', icon: 'XCircle' },
  SENSOR_ERROR: { badge: 'bg-orange-100 text-orange-800', icon: 'AlertTriangle' },
  BIN_CAPACITY_WARNING: { badge: 'bg-amber-100 text-amber-800', icon: 'TriangleAlert' },
  DEVICE_OFFLINE: { badge: 'bg-gray-100 text-gray-800', icon: 'WifiOff' },
  CAMERA_OBSTRUCTION: { badge: 'bg-orange-100 text-orange-800', icon: 'CameraOff' },
  DEVICE_RECONNECTED: { badge: 'bg-green-100 text-green-800', icon: 'Wifi' },
} as const

export const SIDEBAR_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Live Monitoring', path: '/monitoring', icon: 'Monitor' },
  { label: 'Analyze Waste', path: '/analyze', icon: 'ScanSearch' },
  { label: 'Alerts', path: '/alerts', icon: 'Bell' },
  { label: 'Disposal Events', path: '/events', icon: 'ClipboardList' },
  { label: 'Bins', path: '/bins', icon: 'Trash2' },
  { label: 'Facilities', path: '/facilities', icon: 'Building2' },
  { label: 'Device Health', path: '/devices', icon: 'Cpu' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Reports', path: '/reports', icon: 'FileText' },
  { label: 'Segregation Rules', path: '/rules', icon: 'Scale' },
  { label: 'AI Performance', path: '/ai-performance', icon: 'Brain' },
  { label: 'Audit Logs', path: '/audit', icon: 'ScrollText' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
] as const
