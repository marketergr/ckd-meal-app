'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SafetyBadge } from '@/components/results/safety-badge'
import type { Meal } from '@/types/database'

interface MealHistoryCardProps {
  meal: Meal
  onDelete?: (mealId: string) => void
}

export function MealHistoryCard({ meal, onDelete }: MealHistoryCardProps) {
  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const mapVerdictToAssessment = (verdict: string) => {
    if (verdict === 'UNSAFE') return 'dangerous'
    if (verdict === 'CAUTION') return 'caution'
    return 'safe'
  }

  return (
    <Link href={`/results/${meal.id}`}>
      <div className="bg-card-bg rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Photo thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={meal.photo_url}
              alt="Meal"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Date */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatDate(meal.scanned_at)}
            </div>

            {/* Nutrients summary */}
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">K: </span>
                  <span className="font-semibold text-foreground">
                    {Math.round(meal.total_potassium_mg)}mg
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">P: </span>
                  <span className="font-semibold text-foreground">
                    {Math.round(meal.total_phosphorus_mg)}mg
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Protein: </span>
                  <span className="font-semibold text-foreground">
                    {meal.total_protein_g.toFixed(1)}g
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety badge + delete */}
          <div className="flex flex-col items-end justify-between gap-2">
            <SafetyBadge
              assessment={mapVerdictToAssessment(meal.overall_verdict)}
              size="sm"
            />

            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm('Delete this meal?')) {
                    onDelete(meal.id)
                  }
                }}
                className="p-1 text-gray-400 hover:text-unsafe transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
