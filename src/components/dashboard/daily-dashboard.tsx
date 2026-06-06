'use client'

import React from 'react'
import { ProgressRing } from '@/components/ui/progress-ring'
import { CKD_THRESHOLDS } from '@/lib/ckd/thresholds'
import type { CKDStage } from '@/types/ckd'

interface DailyDashboardProps {
  stage: CKDStage
  potassiumToday?: number
  phosphorusToday?: number
  proteinToday?: number
}

export function DailyDashboard({
  stage,
  potassiumToday = 0,
  phosphorusToday = 0,
  proteinToday = 0,
}: DailyDashboardProps) {
  const limits = CKD_THRESHOLDS[stage]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Daily Intake</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your nutrients for today
        </p>
      </div>

      {/* Progress Rings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
        <ProgressRing
          value={potassiumToday}
          max={limits.potassium_mg}
          label="Potassium"
          unit="mg"
          color="green"
          size="lg"
        />

        <ProgressRing
          value={phosphorusToday}
          max={limits.phosphorus_mg}
          label="Phosphorus"
          unit="mg"
          color="amber"
          size="lg"
        />

        <ProgressRing
          value={proteinToday}
          max={limits.protein_g}
          label="Protein"
          unit="g"
          color="blue"
          size="lg"
        />
      </div>

      {/* Info banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
        <p className="text-sm text-foreground">
          CKD Stage {stage === '1-2' ? '1–2' : stage.toUpperCase()} •{' '}
          <span className="font-semibold">
            {limits.potassium_mg.toLocaleString()}mg K
          </span>{' '}
          •{' '}
          <span className="font-semibold">
            {limits.phosphorus_mg.toLocaleString()}mg P
          </span>{' '}
          •{' '}
          <span className="font-semibold">{limits.protein_g}g protein</span> daily
        </p>
      </div>
    </div>
  )
}
