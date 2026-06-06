'use client'

import React, { useState } from 'react'
import { CameraCapture } from './camera-capture'
import { DropZone } from './drop-zone'
import { AnalyzingOverlay } from './analyzing-overlay'
import { uploadMealPhoto } from '@/lib/storage/upload'
import type { SafetyAssessment, MealAnalysisResponse } from '@/types/analysis'

interface PhotoUploaderProps {
  userId: string
  ckdStage: string
  onAnalysisComplete: (result: {
    analysis: MealAnalysisResponse
    photoUrl: string
    photoPath: string
  }) => void
  onError?: (error: string) => void
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'

export function PhotoUploader({
  userId,
  ckdStage,
  onAnalysisComplete,
  onError,
}: PhotoUploaderProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)

  React.useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    setIsMobileView(isMobile)
  }, [])

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file)
    setState('uploading')

    try {
      // Upload to Supabase Storage
      const { url: photoUrl, path: photoPath } = await uploadMealPhoto(
        file,
        userId
      )

      // Move to analyzing state
      setState('analyzing')

      // Call API to analyze meal
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: photoUrl,
          ckdStage,
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `Analysis failed (${response.status})`
        )
      }

      const analysis: MealAnalysisResponse = await response.json()

      setState('done')
      onAnalysisComplete({
        analysis,
        photoUrl,
        photoPath,
      })
    } catch (error) {
      setState('error')
      const message =
        error instanceof Error ? error.message : 'Analysis failed'
      onError?.(message)
      console.error('Photo upload error:', error)

      // Reset after error
      setTimeout(() => {
        setState('idle')
        setSelectedFile(null)
      }, 2000)
    }
  }

  const isLoading = state === 'uploading' || state === 'analyzing'
  const showAnalyzing = state === 'uploading' || state === 'analyzing'

  return (
    <>
      <div className="space-y-6">
        {/* Mobile: Camera only, Desktop: Camera + Drop */}
        {isMobileView ? (
          <CameraCapture onFileSelected={handleFileSelected} isLoading={isLoading} />
        ) : (
          <div className="space-y-4">
            <DropZone
              onFileSelected={handleFileSelected}
              isLoading={isLoading}
              previewFile={selectedFile}
            />
          </div>
        )}

        {/* Error message */}
        {state === 'error' && (
          <div className="p-4 bg-unsafe/10 border border-unsafe/30 rounded-lg">
            <p className="text-sm text-unsafe font-medium">
              Analysis failed. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* Analyzing overlay */}
      <AnalyzingOverlay
        isVisible={showAnalyzing}
        stage={state === 'uploading' ? 'uploading' : 'analyzing'}
        uploadProgress={uploadProgress}
      />
    </>
  )
}
