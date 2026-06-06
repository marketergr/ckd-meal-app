import type { CKDStage, NutrientTotals, Verdict } from '@/types/ckd'
import { CKD_THRESHOLDS } from './thresholds'

export interface RemainingAllowance {
  potassium_mg: number
  phosphorus_mg: number
  protein_g: number
}

export function calculateRemainingAllowance(
  stage: CKDStage,
  consumedToday: NutrientTotals
): RemainingAllowance {
  const limits = CKD_THRESHOLDS[stage]

  return {
    potassium_mg: Math.max(0, limits.potassium_mg - consumedToday.potassium_mg),
    phosphorus_mg: Math.max(
      0,
      limits.phosphorus_mg - consumedToday.phosphorus_mg
    ),
    protein_g: Math.max(0, limits.protein_g - consumedToday.protein_g),
  }
}

function assessSafetyWithRemaining(
  mealTotal: number,
  dailyLimit: number,
  consumedSoFar: number
): Verdict {
  const remaining = dailyLimit - consumedSoFar
  const pct = mealTotal / remaining

  if (pct <= 0.33) return 'SAFE'
  if (pct <= 0.6) return 'CAUTION'
  return 'UNSAFE'
}

export function calculateVerdictWithRemaining(
  mealNutrients: NutrientTotals,
  stage: CKDStage,
  consumedToday: NutrientTotals
): Verdict {
  const limits = CKD_THRESHOLDS[stage]

  const potassium = assessSafetyWithRemaining(
    mealNutrients.potassium_mg,
    limits.potassium_mg,
    consumedToday.potassium_mg
  )
  const phosphorus = assessSafetyWithRemaining(
    mealNutrients.phosphorus_mg,
    limits.phosphorus_mg,
    consumedToday.phosphorus_mg
  )
  const protein = assessSafetyWithRemaining(
    mealNutrients.protein_g,
    limits.protein_g,
    consumedToday.protein_g
  )

  const verdicts = [potassium, phosphorus, protein]
  return verdicts.includes('UNSAFE')
    ? 'UNSAFE'
    : verdicts.includes('CAUTION')
      ? 'CAUTION'
      : 'SAFE'
}
