'use client'

import React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SafetyBadge } from './safety-badge'
import type { MealAnalysisResponse } from '@/types/analysis'

interface MealAnalysisResultsProps {
  isOpen: boolean
  analysis: MealAnalysisResponse | null
  photoUrl?: string
  onClose: () => void
  onSave?: () => void | Promise<void>
  isSaving?: boolean
}

export function MealAnalysisResults({
  isOpen,
  analysis,
  photoUrl,
  onClose,
  onSave,
  isSaving = false,
}: MealAnalysisResultsProps) {
  if (!analysis) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meal Analysis Results</DialogTitle>
          <DialogDescription>
            Review your meal nutrients and safety assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo */}
          {photoUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={photoUrl}
                alt="Meal photo"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Safety Badge */}
          <div className="flex justify-center">
            <SafetyBadge
              assessment={analysis.safety_assessment}
              size="lg"
              showLabel={true}
            />
          </div>

          {/* Reasoning */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-foreground">{analysis.reasoning}</p>
          </div>

          {/* Food Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Identified Foods</h3>
            <div className="space-y-2">
              {analysis.food_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.weight_g}g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrients Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-safe/5 border border-safe/20 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Potassium
              </div>
              <div className="text-2xl font-bold text-safe">
                {Math.round(analysis.estimated_potassium_mg)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">mg</div>
            </div>

            <div className="bg-caution/5 border border-caution/20 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Phosphorus
              </div>
              <div className="text-2xl font-bold text-caution">
                {Math.round(analysis.estimated_phosphorus_mg)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">mg</div>
            </div>

            <div className="bg-fluid/5 border border-fluid/20 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Protein
              </div>
              <div className="text-2xl font-bold text-fluid">
                {analysis.estimated_protein_g.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">g</div>
            </div>
          </div>

          {/* Alternatives */}
          {analysis.alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Lower-K Alternatives</h3>
              <div className="space-y-2">
                {analysis.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <span className="text-lg">💡</span>
                    <span className="text-sm text-foreground">{alt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            {onSave && (
              <Button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                {isSaving ? 'Saving...' : 'Save to History'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
