import type { CKDStage } from '@/types/ckd'

export interface DailyThresholds {
  potassium_mg: number
  phosphorus_mg: number
  protein_g: number
}

export const CKD_THRESHOLDS: Record<CKDStage, DailyThresholds> = {
  '1-2': { potassium_mg: 3500, phosphorus_mg: 1000, protein_g: 60 },
  '3a': { potassium_mg: 3000, phosphorus_mg: 900, protein_g: 50 },
  '3b': { potassium_mg: 2500, phosphorus_mg: 800, protein_g: 45 },
  '4': { potassium_mg: 2000, phosphorus_mg: 750, protein_g: 40 },
  '5': { potassium_mg: 1500, phosphorus_mg: 700, protein_g: 35 },
  dialysis: { potassium_mg: 2500, phosphorus_mg: 1000, protein_g: 70 },
}

export const CKD_STAGE_INFO: Record<
  CKDStage,
  { label: string; description: string }
> = {
  '1-2': {
    label: 'Stage 1–2',
    description: 'Early CKD — standard nutrient restrictions',
  },
  '3a': {
    label: 'Stage 3a',
    description: 'Mild to moderate CKD — increased nutrient management',
  },
  '3b': {
    label: 'Stage 3b',
    description: 'Moderate CKD — closer nutrient monitoring',
  },
  '4': {
    label: 'Stage 4',
    description: 'Advanced CKD — tight nutrient control',
  },
  '5': {
    label: 'Stage 5',
    description: 'End-stage renal disease — strict restrictions',
  },
  dialysis: {
    label: 'Dialysis',
    description: 'On dialysis — adjusted nutrient needs',
  },
}
