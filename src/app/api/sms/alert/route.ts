import { NextRequest, NextResponse } from 'next/server'
import { sendMealAlertSMS } from '@/lib/sms/alerts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SendAlertSchema = z.object({
  mealDescription: z.string(),
  assessment: z.enum(['safe', 'caution', 'dangerous']),
  potassium_mg: z.number(),
  phosphorus_mg: z.number(),
  protein_g: z.number(),
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
    const validation = SendAlertSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    // Get user's SMS settings
    const { data: smsSettings, error: smsError } = await supabase
      .from('sms_settings')
      .select('phone_number, sms_enabled, meal_log_reminders_enabled')
      .eq('user_id', user.id)
      .single()

    if (smsError || !smsSettings) {
      return NextResponse.json(
        { error: 'SMS settings not found' },
        { status: 404 }
      )
    }

    if (
      !smsSettings.sms_enabled ||
      !smsSettings.meal_log_reminders_enabled ||
      !smsSettings.phone_number
    ) {
      return NextResponse.json(
        {
          message:
            'SMS alerts disabled or no phone number configured',
          sent: false,
        },
        { status: 200 }
      )
    }

    // Send SMS alert
    const { data } = validation

    const result = await sendMealAlertSMS(
      smsSettings.phone_number,
      data.mealDescription,
      data.assessment,
      {
        potassium_mg: data.potassium_mg,
        phosphorus_mg: data.phosphorus_mg,
        protein_g: data.protein_g,
      }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send SMS' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sent: true }, { status: 200 })
  } catch (error) {
    console.error('SMS alert error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
