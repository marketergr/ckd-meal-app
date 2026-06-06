'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { AppShell } from '@/components/layout/app-shell'
import { SafetyBadge } from '@/components/results/safety-badge'
import { ProgressRing } from '@/components/ui/progress-ring'
import { createClient } from '@/lib/supabase/client'
import { CKD_THRESHOLDS } from '@/lib/ckd/thresholds'
import type { Meal, MealIngredient } from '@/types/database'
import type { CKDStage } from '@/types/ckd'

interface MealDetail extends Meal {
  ingredients: MealIngredient[]
}

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const mealId = params.mealId as string
  const [meal, setMeal] = useState<MealDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        // Check auth
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Fetch meal
        const { data: mealData, error: mealError } = await supabase
          .from('meals')
          .select('*')
          .eq('id', mealId)
          .eq('user_id', user.id)
          .single()

        if (mealError || !mealData) {
          setError('Meal not found')
          setIsLoading(false)
          return
        }

        // Fetch ingredients
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('meal_ingredients')
          .select('*')
          .eq('meal_id', mealId)
          .order('sort_order', { ascending: true })

        if (ingredientsError) {
          console.error('Error fetching ingredients:', ingredientsError)
        }

        setMeal({
          ...mealData,
          ingredients: ingredientsData || [],
        })
      } catch (err) {
        console.error('Error fetching meal:', err)
        setError('Failed to load meal details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeal()
  }, [router, supabase, mealId])

  const mapVerdictToAssessment = (verdict: string) => {
    if (verdict === 'UNSAFE') return 'dangerous'
    if (verdict === 'CAUTION') return 'caution'
    return 'safe'
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

  if (error || !meal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="text-2xl font-bold text-foreground">Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Meal not found'}</p>
          <button
            onClick={() => router.push('/history')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            ← Back to History
          </button>
        </div>
      </div>
    )
  }

  const limits = CKD_THRESHOLDS[meal.ckd_stage_at_scan as CKDStage]
  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium"
        >
          ← Back
        </button>

        {/* Photo */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={meal.photo_url}
            alt="Meal"
            fill
            className="object-cover"
          />
        </div>

        {/* Safety badge + date */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(meal.scanned_at)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              CKD Stage {meal.ckd_stage_at_scan === '1-2' ? '1–2' : meal.ckd_stage_at_scan?.toUpperCase()}
            </p>
          </div>
          <SafetyBadge
            assessment={mapVerdictToAssessment(meal.overall_verdict)}
            size="lg"
          />
        </div>

        {/* Nutrient summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-safe/5 border border-safe/20 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Potassium
            </div>
            <div className="text-2xl font-bold text-safe mt-1">
              {Math.round(meal.total_potassium_mg)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              / {limits.potassium_mg.toLocaleString()}mg
            </div>
          </div>

          <div className="bg-caution/5 border border-caution/20 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Phosphorus
            </div>
            <div className="text-2xl font-bold text-caution mt-1">
              {Math.round(meal.total_phosphorus_mg)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              / {limits.phosphorus_mg.toLocaleString()}mg
            </div>
          </div>

          <div className="bg-fluid/5 border border-fluid/20 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Protein
            </div>
            <div className="text-2xl font-bold text-fluid mt-1">
              {meal.total_protein_g.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              / {limits.protein_g}g
            </div>
          </div>
        </div>

        {/* Ingredient breakdown */}
        {meal.ingredients.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Ingredients</h2>
            <div className="space-y-2">
              {meal.ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="bg-card-bg rounded-lg border border-border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {ingredient.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {ingredient.portion_estimate}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ingredient.confidence === 'high'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : ingredient.confidence === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {ingredient.confidence}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-gray-600 dark:text-gray-400">
                      K: <span className="font-semibold text-foreground">{Math.round(ingredient.potassium_mg)}mg</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      P: <span className="font-semibold text-foreground">{Math.round(ingredient.phosphorus_mg)}mg</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Protein: <span className="font-semibold text-foreground">{ingredient.protein_g.toFixed(1)}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => router.push('/scan')}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium"
          >
            Scan Another Meal
          </button>
          <button
            onClick={() => router.push('/history')}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-foreground rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium"
          >
            Back to History
          </button>
        </div>
        </div>
      </div>
    </AppShell>
  )
}
