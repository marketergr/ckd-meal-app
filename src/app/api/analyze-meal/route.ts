import { NextRequest, NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai/client'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/openai/prompts'
import {
  AnalyzeMealRequestSchema,
  GPTResponseSchema,
  MealAnalysisResponseSchema,
} from '@/lib/validation/meal-analysis'
import { CKD_THRESHOLDS } from '@/lib/ckd/thresholds'
import type { SafetyAssessment } from '@/types/analysis'
import type { CKDStage } from '@/types/ckd'

function mapVerdictToAssessment(verdict: string): SafetyAssessment {
  if (verdict === 'UNSAFE') return 'dangerous'
  if (verdict === 'CAUTION') return 'caution'
  return 'safe'
}

function calculateSafetyAssessment(
  totals: { potassium_mg: number; phosphorus_mg: number; protein_g: number },
  stage: CKDStage
): SafetyAssessment {
  const limits = CKD_THRESHOLDS[stage]

  const potassiumPct = totals.potassium_mg / limits.potassium_mg
  const phosphorusPct = totals.phosphorus_mg / limits.phosphorus_mg
  const proteinPct = totals.protein_g / limits.protein_g

  const maxPct = Math.max(potassiumPct, phosphorusPct, proteinPct)

  if (maxPct > 0.6) return 'dangerous'
  if (maxPct > 0.33) return 'caution'
  return 'safe'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = AnalyzeMealRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { imageUrl, imageBase64, ckdStage } = validation.data

    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { error: 'Either imageUrl or imageBase64 must be provided' },
        { status: 400 }
      )
    }

    // Call GPT-4o vision
    const openai = getOpenAIClient()

    const imageContent = imageUrl
      ? {
          type: 'image_url' as const,
          image_url: {
            url: imageUrl,
            detail: 'high' as const,
          },
        }
      : {
          type: 'image_url' as const,
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`,
            detail: 'high' as const,
          },
        }

    const response = await openai.chat.completions.create(
      {
        model: 'gpt-4o',
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [imageContent, { type: 'text', text: buildUserPrompt() }],
          },
        ],
      },
      { timeout: 15000 }
    )

    if (!response.choices[0].message.content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 502 }
      )
    }

    // Parse and validate GPT response
    let gptData
    try {
      gptData = JSON.parse(response.choices[0].message.content)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON from AI analysis' },
        { status: 502 }
      )
    }

    const gptValidation = GPTResponseSchema.safeParse(gptData)
    if (!gptValidation.success) {
      return NextResponse.json(
        { error: 'AI response did not match expected schema' },
        { status: 502 }
      )
    }

    const gpt = gptValidation.data

    // Calculate safety assessment based on daily limits
    const totals = {
      potassium_mg: gpt.estimated_potassium_mg,
      phosphorus_mg: gpt.estimated_phosphorus_mg,
      protein_g: gpt.estimated_protein_g,
    }

    const safetyAssessment = calculateSafetyAssessment(
      totals,
      ckdStage as CKDStage
    )

    // Build reasoning based on assessment
    const limits = CKD_THRESHOLDS[ckdStage as CKDStage]
    const potassiumPct = Math.round(
      (totals.potassium_mg / limits.potassium_mg) * 100
    )
    const phosphorusPct = Math.round(
      (totals.phosphorus_mg / limits.phosphorus_mg) * 100
    )
    const proteinPct = Math.round((totals.protein_g / limits.protein_g) * 100)

    const reasoning =
      safetyAssessment === 'dangerous'
        ? `This meal exceeds safe limits for CKD Stage ${ckdStage}. Potassium: ${potassiumPct}% of daily limit, Phosphorus: ${phosphorusPct}%, Protein: ${proteinPct}%. ${gpt.reasoning}`
        : safetyAssessment === 'caution'
          ? `This meal approaches caution levels for CKD Stage ${ckdStage}. Potassium: ${potassiumPct}%, Phosphorus: ${phosphorusPct}%, Protein: ${proteinPct}%. Consider the alternatives provided. ${gpt.reasoning}`
          : `This meal is safe for CKD Stage ${ckdStage}. Potassium: ${potassiumPct}% of daily limit, Phosphorus: ${phosphorusPct}%, Protein: ${proteinPct}%. ${gpt.reasoning}`

    // Build final response
    const apiResponse = {
      food_items: gpt.food_items,
      estimated_potassium_mg: gpt.estimated_potassium_mg,
      estimated_phosphorus_mg: gpt.estimated_phosphorus_mg,
      estimated_protein_g: gpt.estimated_protein_g,
      safety_assessment: safetyAssessment,
      reasoning,
      alternatives: gpt.alternatives,
    }

    const finalValidation = MealAnalysisResponseSchema.safeParse(apiResponse)
    if (!finalValidation.success) {
      return NextResponse.json(
        { error: 'Internal response validation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(finalValidation.data, { status: 200 })
  } catch (error) {
    console.error('Meal analysis error:', error)

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'AI analysis timed out. Please try again.' },
          { status: 504 }
        )
      }
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'AI service authentication failed' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during meal analysis' },
      { status: 500 }
    )
  }
}
