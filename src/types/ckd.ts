export type CKDStage = '1-2' | '3a' | '3b' | '4' | '5' | 'dialysis'

export type Verdict = 'SAFE' | 'CAUTION' | 'UNSAFE'

export interface NutrientTotals {
  potassium_mg: number
  phosphorus_mg: number
  protein_g: number
}

export interface VerdictResult {
  potassium: Verdict
  phosphorus: Verdict
  protein: Verdict
  overall: Verdict
}

export interface AnalysisResult {
  ingredients: Array<{
    name: string
    portion_estimate: string
    confidence: 'high' | 'medium' | 'low'
    potassium_mg: number
    phosphorus_mg: number
    protein_g: number
  }>
  totals: NutrientTotals
  verdicts: VerdictResult
  thresholds: {
    potassium_mg: number
    phosphorus_mg: number
    protein_g: number
  }
}
