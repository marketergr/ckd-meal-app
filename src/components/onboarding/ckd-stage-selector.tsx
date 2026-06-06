'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { CKD_STAGE_INFO } from '@/lib/ckd/thresholds'
import type { CKDStage } from '@/types/ckd'

interface CKDStageSelectorProps {
  selected: CKDStage | null
  onChange: (stage: CKDStage) => void
  onConfirm: () => void
  isLoading?: boolean
}

const stages: CKDStage[] = ['1-2', '3a', '3b', '4', '5', 'dialysis']

export function CKDStageSelector({
  selected,
  onChange,
  onConfirm,
  isLoading = false,
}: CKDStageSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your CKD Stage</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your Chronic Kidney Disease stage. Your daily nutrient limits
          will be customized based on this.
        </p>
      </div>

      {/* Stage selector grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {stages.map((stage) => {
          const info = CKD_STAGE_INFO[stage]
          const isSelected = selected === stage

          return (
            <button
              key={stage}
              onClick={() => onChange(stage)}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isSelected && <span className="text-white text-sm">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{info.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {info.description}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info banner */}
      {selected && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Daily Nutrient Limits for {CKD_STAGE_INFO[selected].label}:
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Potassium: &lt; 2,500 mg (varies by stage)</li>
            <li>• Phosphorus: &lt; 800 mg (varies by stage)</li>
            <li>• Protein: Adjust based on body weight</li>
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <Button
        onClick={onConfirm}
        disabled={isLoading || selected === null}
        className="w-full bg-primary hover:bg-primary-dark text-white"
      >
        {isLoading ? 'Saving...' : 'Continue'}
      </Button>
    </div>
  )
}
