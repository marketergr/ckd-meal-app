import type { CKDStage, Verdict, NutrientTotals, VerdictResult } from '@/types/ckd'
import { CKD_THRESHOLDS } from './thresholds'

function scoreNutrient(value: number, dailyLimit: number): Verdict {
  const pct = value / dailyLimit
  if (pct <= 0.33) return 'SAFE'
  if (pct <= 0.6) return 'CAUTION'
  return 'UNSAFE'
}

export function calculateVerdicts(
  totals: NutrientTotals,
  stage: CKDStage
): VerdictResult {
  const limits = CKD_THRESHOLDS[stage]

  const potassium = scoreNutrient(totals.potassium_mg, limits.potassium_mg)
  const phosphorus = scoreNutrient(totals.phosphorus_mg, limits.phosphorus_mg)
  const protein = scoreNutrient(totals.protein_g, limits.protein_g)

  const verdicts = [potassium, phosphorus, protein]
  const overall = verdicts.includes('UNSAFE')
    ? 'UNSAFE'
    : verdicts.includes('CAUTION')
      ? 'CAUTION'
      : 'SAFE'

  return { potassium, phosphorus, protein, overall }
}

export function getVerdictColor(verdict: Verdict): string {
  const colors: Record<Verdict, string> = {
    SAFE: '#10b981',
    CAUTION: '#f59e0b',
    UNSAFE: '#ef4444',
  }
  return colors[verdict]
}

export function getVerdictBgClass(verdict: Verdict): string {
  const classes: Record<Verdict, string> = {
    SAFE: 'bg-safe/10 text-safe',
    CAUTION: 'bg-caution/10 text-caution',
    UNSAFE: 'bg-unsafe/10 text-unsafe',
  }
  return classes[verdict]
}
