'use client'

import React, { useState } from 'react'
import { Navbar } from './navbar'
import { BottomNav } from './bottom-nav'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {/* Navbar (desktop + mobile header) */}
      <Navbar />

      {/* Main content */}
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom navigation (mobile only) */}
      <BottomNav />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
