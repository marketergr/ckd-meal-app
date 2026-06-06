'use client'

import React from 'react'
import type { Toast } from '@/hooks/useToast'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const toastConfig = {
  success: {
    bg: 'bg-safe/10 border-safe/30',
    text: 'text-safe',
    icon: '✓',
  },
  error: {
    bg: 'bg-unsafe/10 border-unsafe/30',
    text: 'text-unsafe',
    icon: '✕',
  },
  info: {
    bg: 'bg-primary/10 border-primary/30',
    text: 'text-primary',
    icon: 'ℹ',
  },
  warning: {
    bg: 'bg-caution/10 border-caution/30',
    text: 'text-caution',
    icon: '⚠',
  },
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type]
        return (
          <div
            key={toast.id}
            className={`${config.bg} border rounded-lg p-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className="flex items-start gap-3">
              <span className={`${config.text} font-bold text-lg flex-shrink-0`}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`${config.text} text-sm font-medium`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className={`${config.text} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
              >
                ×
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
