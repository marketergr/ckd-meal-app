export type SafetyAssessment = 'safe' | 'caution' | 'dangerous'

export interface FoodItem {
  name: string
  weight_g: number
  potassium_mg?: number
  phosphorus_mg?: number
  protein_g?: number
}

export interface MealAnalysisResponse {
  food_items: FoodItem[]
  estimated_potassium_mg: number
  estimated_phosphorus_mg: number
  estimated_protein_g: number
  safety_assessment: SafetyAssessment
  reasoning: string
  alternatives: string[]
}

export interface AnalyzeRequest {
  imageUrl: string
  imageBase64?: string
  ckdStage: string
}
