'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Meal, MealIngredient } from '@/types/database'

export interface MealWithIngredients extends Meal {
  ingredients?: MealIngredient[]
}

interface UseMealHistoryOptions {
  userId?: string
  pageSize?: number
}

export function useMealHistory({
  userId,
  pageSize = 10,
}: UseMealHistoryOptions = {}) {
  const supabase = createClient()

  const [meals, setMeals] = useState<MealWithIngredients[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetchMeals = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const from = page * pageSize
      const to = from + pageSize - 1

      const { data: mealsData, error: mealsError, count } = await supabase
        .from('meals')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .range(from, to)

      if (mealsError) throw mealsError

      // Fetch ingredients for each meal
      if (mealsData && mealsData.length > 0) {
        const mealIds = mealsData.map((m) => m.id)
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('meal_ingredients')
          .select('*')
          .in('meal_id', mealIds)
          .order('sort_order', { ascending: true })

        if (ingredientsError) {
          console.error('Error fetching ingredients:', ingredientsError)
        }

        // Map ingredients to meals
        const mealsWithIngredients: MealWithIngredients[] = mealsData.map(
          (meal) => ({
            ...meal,
            ingredients: ingredientsData?.filter((ing) => ing.meal_id === meal.id) || [],
          })
        )

        if (page === 0) {
          setMeals(mealsWithIngredients)
        } else {
          setMeals((prev) => [...prev, ...mealsWithIngredients])
        }

        setHasMore((count ?? 0) > (page + 1) * pageSize)
      } else {
        if (page === 0) setMeals([])
        setHasMore(false)
      }
    } catch (err) {
      console.error('Error fetching meals:', err)
      setError('Failed to load meal history')
    } finally {
      setIsLoading(false)
    }
  }, [userId, page, pageSize, supabase])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const deleteMeal = useCallback(
    async (mealId: string) => {
      try {
        const { error } = await supabase.from('meals').delete().eq('id', mealId)

        if (error) throw error

        setMeals((prev) => prev.filter((m) => m.id !== mealId))
      } catch (err) {
        console.error('Error deleting meal:', err)
        setError('Failed to delete meal')
      }
    },
    [supabase]
  )

  return {
    meals,
    isLoading,
    error,
    hasMore,
    loadMore,
    deleteMeal,
  }
}
