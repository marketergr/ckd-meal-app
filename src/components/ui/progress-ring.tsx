'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number
  max: number
  label: string
  unit: string
  color: 'green' | 'amber' | 'red' | 'blue'
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  green: { bg: 'from-safe', text: 'text-safe', circle: '#10b981' },
  amber: { bg: 'from-caution', text: 'text-caution', circle: '#f59e0b' },
  red: { bg: 'from-unsafe', text: 'text-unsafe', circle: '#ef4444' },
  blue: { bg: 'from-fluid', text: 'text-fluid', circle: '#3b82f6' },
}

const sizeMap = {
  sm: { radius: 30, circumference: 188.4, textSize: 'text-sm' },
  md: { radius: 45, circumference: 282.6, textSize: 'text-base' },
  lg: { radius: 60, circumference: 376.8, textSize: 'text-lg' },
}

export function ProgressRing({
  value,
  max,
  label,
  unit,
  color,
  size = 'md',
}: ProgressRingProps) {
  const config = sizeMap[size]
  const percent = Math.min((value / max) * 100, 100)
  const strokeDashoffset = config.circumference - (percent / 100) * config.circumference
  const colorConfig = colorMap[color]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg
          width={config.radius * 2 + 20}
          height={config.radius * 2 + 20}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke={colorConfig.circle}
            strokeWidth="3"
            strokeDasharray={config.circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('font-semibold', config.textSize, colorConfig.text)}>
            {value.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{unit}</div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {percent.toFixed(0)}% of {max.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
