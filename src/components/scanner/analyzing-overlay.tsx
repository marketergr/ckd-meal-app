'use client'

import React, { useEffect, useState } from 'react'

interface AnalyzingOverlayProps {
  isVisible: boolean
  stage?: 'uploading' | 'analyzing'
  uploadProgress?: number
}

const analyzingStages = [
  'Analyzing potassium levels...',
  'Calculating phosphorus density...',
  'Estimating protein content...',
  'Assessing food composition...',
  'Computing nutrient totals...',
]

export function AnalyzingOverlay({
  isVisible,
  stage = 'analyzing',
  uploadProgress = 0,
}: AnalyzingOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % analyzingStages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-card-bg rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="space-y-6">
          {/* Animated kidney icon */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <svg
                className="w-full h-full text-primary animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c-3.31 0-6 2.69-6 6 0 1.49.55 2.86 1.46 3.93C6.55 13.15 6 14.33 6 15.5 6 18.59 8.69 21 12 21s6-2.41 6-5.5c0-1.17-.55-2.35-1.46-3.57C17.45 10.86 18 9.49 18 8c0-3.31-2.69-6-6-6zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
          </div>

          {/* Stage title */}
          <div className="text-center space-y-2">
            {stage === 'uploading' ? (
              <>
                <h3 className="text-lg font-semibold text-foreground">
                  Uploading photo...
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(uploadProgress)}%
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground">
                  Analyzing your meal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 h-5 min-h-[1.25rem]">
                  {analyzingStages[currentStage]}
                </p>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            {stage === 'uploading' ? (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-full animate-pulse" />
              </div>
            )}
          </div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
