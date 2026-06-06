'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  hideOnMobile?: boolean
}

export function Navbar({ hideOnMobile = false }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className={`bg-card-bg border-b border-border sticky top-0 z-40 ${hideOnMobile ? 'hidden md:block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/scan" className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c-3.31 0-6 2.69-6 6 0 1.49.55 2.86 1.46 3.93C6.55 13.15 6 14.33 6 15.5 6 18.59 8.69 21 12 21s6-2.41 6-5.5c0-1.17-.55-2.35-1.46-3.57C17.45 10.86 18 9.49 18 8c0-3.31-2.69-6-6-6zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
            <span>CKD MealGuard</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/scan"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            >
              Scan
            </Link>
            <Link
              href="/history"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            >
              History
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-unsafe hover:bg-unsafe/10 rounded-lg transition-colors ml-2"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <Link
              href="/scan"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            >
              Scan
            </Link>
            <Link
              href="/history"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            >
              History
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-unsafe hover:bg-unsafe/10 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
