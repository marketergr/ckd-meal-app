'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  )
}

export function MealHistoryCardSkeleton() {
  return (
    <div className="bg-card-bg rounded-lg border border-border p-4 flex gap-4">
      {/* Photo */}
      <Skeleton className="w-20 h-20 flex-shrink-0 rounded-lg" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>

      {/* Badge */}
      <Skeleton className="w-16 h-8 flex-shrink-0" />
    </div>
  )
}

export function MealResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Photo */}
      <Skeleton className="w-full aspect-video rounded-lg" />

      {/* Date + Badge */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="w-24 h-10" />
      </div>

      {/* Nutrient cards */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      {/* Ingredients header */}
      <Skeleton className="h-6 w-32" />

      {/* Ingredient items */}
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  )
}
