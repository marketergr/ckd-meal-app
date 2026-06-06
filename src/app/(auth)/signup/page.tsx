import React from 'react'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c-3.31 0-6 2.69-6 6 0 1.49.55 2.86 1.46 3.93C6.55 13.15 6 14.33 6 15.5 6 18.59 8.69 21 12 21s6-2.41 6-5.5c0-1.17-.55-2.35-1.46-3.57C17.45 10.86 18 9.49 18 8c0-3.31-2.69-6-6-6zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CKD MealGuard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account to start tracking meals
          </p>
        </div>

        {/* Form */}
        <div className="bg-card-bg rounded-lg border border-border p-6 shadow-sm">
          <SignupForm />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
