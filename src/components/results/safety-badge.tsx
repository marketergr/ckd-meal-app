'use client'

import React from 'react'
import type { SafetyAssessment } from '@/types/analysis'

interface SafetyBadgeProps {
  assessment: SafetyAssessment
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const assessmentConfig = {
  safe: {
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    text: 'text-safe',
    label: 'Safe',
    icon: '✓',
    description: 'Safe for this CKD stage',
  },
  caution: {
    bg: 'bg-caution/10',
    border: 'border-caution/30',
    text: 'text-caution',
    label: 'Caution',
    icon: '⚠',
    description: 'Approaches daily limits',
  },
  dangerous: {
    bg: 'bg-unsafe/10',
    border: 'border-unsafe/30',
    text: 'text-unsafe',
    label: 'Dangerous',
    icon: '⛔',
    description: 'Exceeds safe limits',
  },
}

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
}

export function SafetyBadge({
  assessment,
  size = 'md',
  showLabel = true,
}: SafetyBadgeProps) {
  const config = assessmentConfig[assessment]
  const sizeClass = sizeConfig[size]

  return (
    <div
      className={`
        rounded-lg border ${config.bg} ${config.border} ${config.text}
        font-semibold flex items-center gap-2 ${sizeClass}
      `}
    >
      <span className="text-lg">{config.icon}</span>
      <div className="flex flex-col gap-0">
        <span>{config.label}</span>
        {size === 'lg' && (
          <span className="text-xs opacity-75">{config.description}</span>
        )}
      </div>
    </div>
  )
}
