'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AuthGuardProps {
  children: React.ReactNode
  requireOnboarded?: boolean
}

export function AuthGuard({ children, requireOnboarded = false }: AuthGuardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setIsAuthed(true)

        // Check if user is onboarded if required
        if (requireOnboarded) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('onboarded')
            .eq('id', user.id)
            .single()

          if (error || !profile?.onboarded) {
            router.push('/onboarding')
            return
          }

          setIsOnboarded(true)
        } else {
          setIsOnboarded(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, supabase, requireOnboarded])

  // Show loading state
  if (isAuthed === null || isOnboarded === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated and onboarded
  if (isAuthed && isOnboarded) {
    return <>{children}</>
  }

  return null
}
