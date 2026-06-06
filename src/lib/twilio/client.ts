import twilio from 'twilio'

let client: ReturnType<typeof twilio> | null = null

export function getTwilioClient() {
  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }
  return client
}

export async function sendSMS(
  toPhoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      return {
        success: false,
        error: 'TWILIO_PHONE_NUMBER not configured',
      }
    }

    const twilio_client = getTwilioClient()
    await twilio_client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
