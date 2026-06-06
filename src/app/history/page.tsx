'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { MealHistoryList } from '@/components/history/meal-history-list'
import { useMealHistory } from '@/hooks/useMealHistory'
import { createClient } from '@/lib/supabase/client'

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Check auth
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
      setAuthLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const { meals, isLoading, hasMore, loadMore, deleteMeal } = useMealHistory({
    userId: userId || undefined,
  })

  if (authLoading) {
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
        <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Meal History</h1>
            <a
              href="/scan"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Scan
            </a>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {meals.length} meal{meals.length !== 1 ? 's' : ''} logged
          </p>
        </div>

        {/* Meals list */}
        <MealHistoryList
          meals={meals}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onDelete={deleteMeal}
        />
        </div>
      </div>
    </AppShell>
  )
}
