'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CKDStageSelector } from '@/components/onboarding/ckd-stage-selector'
import { createClient } from '@/lib/supabase/client'
import type { CKDStage } from '@/types/ckd'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [selectedStage, setSelectedStage] = useState<CKDStage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      // Check if already onboarded
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', user.id)
        .single()

      if (profile?.onboarded) {
        router.push('/scan')
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleConfirm = async () => {
    if (!userId || !selectedStage) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ckd_stage: selectedStage,
          onboarded: true,
        })
        .eq('id', userId)

      if (updateError) {
        setError('Failed to save your CKD stage')
        setIsLoading(false)
        return
      }

      // Redirect to scan page
      router.push('/scan')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c-3.31 0-6 2.69-6 6 0 1.49.55 2.86 1.46 3.93C6.55 13.15 6 14.33 6 15.5 6 18.59 8.69 21 12 21s6-2.41 6-5.5c0-1.17-.55-2.35-1.46-3.57C17.45 10.86 18 9.49 18 8c0-3.31-2.69-6-6-6zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's set up your kidney-safe meal tracking
          </p>
        </div>

        {/* Selector */}
        <div className="bg-card-bg rounded-lg border border-border p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-unsafe/10 border border-unsafe/30 rounded-lg">
              <p className="text-sm text-unsafe font-medium">{error}</p>
            </div>
          )}

          <CKDStageSelector
            selected={selectedStage}
            onChange={setSelectedStage}
            onConfirm={handleConfirm}
            isLoading={isLoading}
          />
        </div>

        {/* Info section */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-foreground">Why we ask about CKD stage:</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <li className="flex gap-2">
              <span>💊</span>
              <span>
                Each CKD stage has different restrictions on potassium, phosphorus, and protein
              </span>
            </li>
            <li className="flex gap-2">
              <span>📊</span>
              <span>
                We'll tailor your daily limits based on your stage
              </span>
            </li>
            <li className="flex gap-2">
              <span>🔒</span>
              <span>
                Your CKD stage helps us provide safe recommendations for your condition
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
