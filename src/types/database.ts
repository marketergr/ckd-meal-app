import type { CKDStage } from './ckd'

export interface Profile {
  id: string
  email: string
  ckd_stage: CKDStage
  onboarded: boolean
  created_at: string
  updated_at: string
}

export interface Meal {
  id: string
  user_id: string
  photo_url: string
  photo_path: string
  overall_verdict: 'SAFE' | 'CAUTION' | 'UNSAFE'
  total_potassium_mg: number
  total_phosphorus_mg: number
  total_protein_g: number
  potassium_verdict: 'SAFE' | 'CAUTION' | 'UNSAFE'
  phosphorus_verdict: 'SAFE' | 'CAUTION' | 'UNSAFE'
  protein_verdict: 'SAFE' | 'CAUTION' | 'UNSAFE'
  ckd_stage_at_scan: CKDStage
  notes: string | null
  scanned_at: string
  created_at: string
}

export interface MealIngredient {
  id: string
  meal_id: string
  name: string
  portion_estimate: string
  confidence: 'high' | 'medium' | 'low'
  potassium_mg: number
  phosphorus_mg: number
  protein_g: number
  sort_order: number
  created_at: string
}

export interface CKDStageThreshold {
  stage: CKDStage
  stage_label: string
  stage_description: string
  potassium_limit_mg: number
  phosphorus_limit_mg: number
  protein_limit_g: number
  fluid_limit_ml: number | null
  created_at: string
}

export interface SMSSettings {
  id: string
  user_id: string
  phone_number: string | null
  phone_verified: boolean
  sms_enabled: boolean
  meal_log_reminders_enabled: boolean
  hydration_reminders_enabled: boolean
  reminder_times: string[]
  timezone: string
  created_at: string
  updated_at: string
}
