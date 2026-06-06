'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { MealHistoryCard } from './meal-history-card'
import type { MealWithIngredients } from '@/hooks/useMealHistory'

interface MealHistoryListProps {
  meals: MealWithIngredients[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onDelete?: (mealId: string) => void
}

export function MealHistoryList({
  meals,
  isLoading,
  hasMore,
  onLoadMore,
  onDelete,
}: MealHistoryListProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  if (meals.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="text-4xl">📸</div>
        <h3 className="text-lg font-semibold text-foreground">No meals yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start by scanning your first meal to see it appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Meal cards */}
      {meals.map((meal) => (
        <MealHistoryCard key={meal.id} meal={meal} onDelete={onDelete} />
      ))}

      {/* Load more observer */}
      <div ref={observerTarget} className="py-4" />

      {/* Loading state */}
      {isLoading && (
        <div className="py-6 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Loading more meals...
          </p>
        </div>
      )}

      {/* End of list */}
      {!hasMore && meals.length > 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You've reached the end of your history
          </p>
        </div>
      )}
    </div>
  )
}
