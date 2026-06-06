'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { PhotoUploader } from '@/components/scanner/photo-uploader'
import { MealAnalysisResults } from '@/components/results/meal-analysis-results'
import { DailyDashboard } from '@/components/dashboard/daily-dashboard'
import { createClient } from '@/lib/supabase/client'
import type { CKDStage } from '@/types/ckd'
import type { MealAnalysisResponse } from '@/types/analysis'

export default function ScanPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [ckdStage, setCkdStage] = useState<CKDStage>('3b')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [analysisResult, setAnalysisResult] = useState<{
    analysis: MealAnalysisResponse
    photoUrl: string
    photoPath: string
  } | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Check auth and load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)

        // Fetch profile to get CKD stage
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('ckd_stage, onboarded')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setError('Failed to load profile')
          return
        }

        if (!profile?.onboarded) {
          router.push('/onboarding')
          return
        }

        setCkdStage(profile.ckd_stage as CKDStage)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load your profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleAnalysisComplete = (result: {
    analysis: MealAnalysisResponse
    photoUrl: string
    photoPath: string
  }) => {
    setAnalysisResult(result)
    setShowResults(true)
  }

  const handleSaveMeal = async () => {
    if (!analysisResult || !userId) return

    setIsSaving(true)
    try {
      // Call API to save meal
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl: analysisResult.photoUrl,
          photoPath: analysisResult.photoPath,
          analysis: analysisResult.analysis,
          ckdStage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save meal')
      }

      const { mealId } = await response.json()

      // Close modal and redirect to results
      setShowResults(false)
      router.push(`/results/${mealId}`)
    } catch (err) {
      console.error('Error saving meal:', err)
      setError('Failed to save meal')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
    <AppShell>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
        {/* Dashboard */}
        <DailyDashboard stage={ckdStage} />

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Scanner Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Scan Your Meal</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a photo of your meal to see nutritional information
          </p>

          {error && (
            <div className="p-4 bg-unsafe/10 border border-unsafe/30 rounded-lg">
              <p className="text-sm text-unsafe font-medium">{error}</p>
            </div>
          )}

          {userId && (
            <PhotoUploader
              userId={userId}
              ckdStage={ckdStage}
              onAnalysisComplete={handleAnalysisComplete}
              onError={setError}
            />
          )}
        </div>

        {/* Results Modal */}
        {analysisResult && (
          <MealAnalysisResults
            isOpen={showResults}
            analysis={analysisResult.analysis}
            photoUrl={analysisResult.photoUrl}
            onClose={() => setShowResults(false)}
            onSave={handleSaveMeal}
            isSaving={isSaving}
          />
        )}
        </div>
      </div>
    </AppShell>
  )
}
