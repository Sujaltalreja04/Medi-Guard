const ALLOWED_CLASSES = [
  'SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK',
  'GAUZE_DRESSING', 'MEDICINE_VIAL', 'AMPOULE',
  'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER', 'PAPER_PACKAGING',
  'GENERAL_WASTE', 'UNKNOWN_ITEM',
]

export function normalizeWasteClass(cls: string): string {
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

export function isAllowedClass(cls: string): boolean {
  return ALLOWED_CLASSES.includes(cls)
}
