'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomNavProps {
  hideOnDesktop?: boolean
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

export function BottomNav({ hideOnDesktop = false }: BottomNavProps) {
  const pathname = usePathname()

  const items: NavItem[] = [
    {
      href: '/scan',
      label: 'Scan',
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      href: '/history',
      label: 'History',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border z-40 ${
        hideOnDesktop ? 'md:hidden' : ''
      }`}
    >
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
              isActive(item.href)
                ? 'text-primary border-t-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-foreground'
            }`}
          >
            <div className="mb-1">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
