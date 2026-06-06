import { sendSMS } from '@/lib/twilio/client'
import type { SafetyAssessment } from '@/types/analysis'

export async function sendMealAlertSMS(
  phoneNumber: string,
  mealDescription: string,
  assessment: SafetyAssessment,
  nutrients: {
    potassium_mg: number
    phosphorus_mg: number
    protein_g: number
  }
): Promise<{ success: boolean; error?: string }> {
  if (assessment === 'safe') {
    // No alert needed for safe meals
    return { success: true }
  }

  if (!phoneNumber) {
    return {
      success: false,
      error: 'No phone number on file',
    }
  }

  const severity = assessment === 'dangerous' ? '⚠️ HIGH' : '⚠️'
  const message =
    assessment === 'dangerous'
      ? `${severity} ALERT: ${mealDescription} exceeds CKD limits.\nK: ${Math.round(nutrients.potassium_mg)}mg | P: ${Math.round(nutrients.phosphorus_mg)}mg | Protein: ${nutrients.protein_g.toFixed(1)}g\nConsider the alternatives. Reply STOP to opt out.`
      : `⚠️ CAUTION: ${mealDescription} approaches limits.\nK: ${Math.round(nutrients.potassium_mg)}mg | P: ${Math.round(nutrients.phosphorus_mg)}mg | Protein: ${nutrients.protein_g.toFixed(1)}g\nReview alternatives. Reply STOP to opt out.`

  return sendSMS(phoneNumber, message)
}

export async function sendMealReminderSMS(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!phoneNumber) {
    return {
      success: false,
      error: 'No phone number on file',
    }
  }

  const reminderMessage = `${message}\n\nReply STOP to opt out.`
  return sendSMS(phoneNumber, reminderMessage)
}

export function buildMealAlertMessage(
  mealName: string,
  assessment: SafetyAssessment,
  potassiumMg: number,
  phosphorusMg: number,
  proteinG: number
): string {
  if (assessment === 'safe') {
    return ''
  }

  const badge = assessment === 'dangerous' ? '🚨' : '⚠️'
  return `${badge} ${assessment.toUpperCase()}: ${mealName}\nK: ${Math.round(potassiumMg)}mg | P: ${Math.round(phosphorusMg)}mg | Protein: ${proteinG.toFixed(1)}g`
}
