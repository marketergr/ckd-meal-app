'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onFileSelected: (file: File) => void
  isLoading?: boolean
  previewFile?: File | null
}

export function DropZone({
  onFileSelected,
  isLoading = false,
  previewFile = null,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  React.useEffect(() => {
    if (previewFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(previewFile)
    } else {
      setPreview(null)
    }
  }, [previewFile])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
        <button
          onClick={() => {
            setPreview(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          Choose Different Photo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/2.5',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <div className="space-y-2">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drag and drop your meal photo
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              or click to select a file
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
