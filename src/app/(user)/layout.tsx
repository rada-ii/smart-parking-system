'use client'

/**
 * USER LAYOUT
 * ============
 * 
 * Layout za sve korisničke stranice.
 * Proverava da li je korisnik ulogovan kao GROUP_ADMIN ili MEMBER.
 * Prikazuje Onboarding tutorial prvi put.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { PageLoader } from '@/components/ui/Spinner'
import { OnboardingModal } from '@/components/ui/OnboardingModal'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, role, isLoading } = useAuth()

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!user || role === 'ADMIN')) {
      router.push('/login')
    }
  }, [user, role, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <PageLoader message="Učitavanje..." />
      </div>
    )
  }

  if (!user || role === 'ADMIN') {
    return null
  }

  return (
    <OnboardingProvider userType="user">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <Sidebar isAdmin={false} />
        <div className="lg:pl-64 transition-all duration-300">
          <Header isAdmin={false} />
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Onboarding Tutorial */}
        <OnboardingModal type="user" />
      </div>
    </OnboardingProvider>
  )
}
