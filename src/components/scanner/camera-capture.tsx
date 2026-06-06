'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'

interface CameraCaptureProps {
  onFileSelected: (file: File) => void
  isLoading?: boolean
}

export function CameraCapture({ onFileSelected, isLoading = false }: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      <Button
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        size="lg"
        className="w-full gap-2 bg-primary hover:bg-primary-dark text-white"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {isLoading ? 'Processing...' : 'Take Photo'}
      </Button>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Point camera at your meal
      </p>
    </div>
  )
}
