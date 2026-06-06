import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SaveMealSchema = z.object({
  photoUrl: z.string().url(),
  photoPath: z.string(),
  analysis: z.object({
    food_items: z.array(z.any()),
    estimated_potassium_mg: z.number(),
    estimated_phosphorus_mg: z.number(),
    estimated_protein_g: z.number(),
    safety_assessment: z.enum(['safe', 'caution', 'dangerous']),
  }),
  ckdStage: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = SaveMealSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { photoUrl, photoPath, analysis, ckdStage } = validation.data

    // Map safety_assessment to verdict format
    const verdictMap: Record<string, string> = {
      safe: 'SAFE',
      caution: 'CAUTION',
      dangerous: 'UNSAFE',
    }

    // Insert meal
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: user.id,
        photo_url: photoUrl,
        photo_path: photoPath,
        overall_verdict: verdictMap[analysis.safety_assessment],
        total_potassium_mg: analysis.estimated_potassium_mg,
        total_phosphorus_mg: analysis.estimated_phosphorus_mg,
        total_protein_g: analysis.estimated_protein_g,
        potassium_verdict: 'SAFE', // TODO: calculate per-nutrient verdicts
        phosphorus_verdict: 'SAFE',
        protein_verdict: 'SAFE',
        ckd_stage_at_scan: ckdStage,
      })
      .select()
      .single()

    if (mealError) {
      console.error('Meal insert error:', mealError)
      return NextResponse.json(
        { error: 'Failed to save meal' },
        { status: 500 }
      )
    }

    // Insert meal ingredients
    if (analysis.food_items.length > 0) {
      const ingredientsToInsert = analysis.food_items.map(
        (item: any, idx: number) => ({
          meal_id: meal.id,
          name: item.name,
          portion_estimate: `${item.weight_g}g`,
          confidence: 'high',
          potassium_mg: item.potassium_mg || 0,
          phosphorus_mg: item.phosphorus_mg || 0,
          protein_g: item.protein_g || 0,
          sort_order: idx,
        })
      )

      const { error: ingredientsError } = await supabase
        .from('meal_ingredients')
        .insert(ingredientsToInsert)

      if (ingredientsError) {
        console.error('Ingredients insert error:', ingredientsError)
        // Don't fail the whole request, just log
      }
    }

    return NextResponse.json({ mealId: meal.id }, { status: 201 })
  } catch (error) {
    console.error('Meals endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
