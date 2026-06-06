import { z } from 'zod'

export const FoodItemSchema = z.object({
  name: z.string().min(1),
  weight_g: z.number().positive(),
})

export const GPTResponseSchema = z.object({
  food_items: z.array(FoodItemSchema).min(1).max(20),
  estimated_potassium_mg: z.number().nonnegative(),
  estimated_phosphorus_mg: z.number().nonnegative(),
  estimated_protein_g: z.number().nonnegative(),
  reasoning: z.string(),
  alternatives: z.array(z.string()).default([]),
})

export const AnalyzeMealRequestSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
  ckdStage: z.enum(['1-2', '3a', '3b', '4', '5', 'dialysis']),
})

export const MealAnalysisResponseSchema = z.object({
  food_items: z.array(FoodItemSchema),
  estimated_potassium_mg: z.number(),
  estimated_phosphorus_mg: z.number(),
  estimated_protein_g: z.number(),
  safety_assessment: z.enum(['safe', 'caution', 'dangerous']),
  reasoning: z.string(),
  alternatives: z.array(z.string()),
})

export type FoodItem = z.infer<typeof FoodItemSchema>
export type GPTResponse = z.infer<typeof GPTResponseSchema>
export type AnalyzeMealRequest = z.infer<typeof AnalyzeMealRequestSchema>
export type MealAnalysisResponse = z.infer<typeof MealAnalysisResponseSchema>
