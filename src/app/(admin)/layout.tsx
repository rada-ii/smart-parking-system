'use client'

/**
 * ADMIN LAYOUT
 * =============
 * 
 * Layout za sve stranice u /admin/* direktorijumu.
 * 
 * ŠTA RADI:
 * 1. Proverava da li je korisnik ulogovan kao ADMIN
 * 2. Ako nije - redirect na /admin/login
 * 3. Prikazuje Sidebar i Header sa admin temom (narandžasta)
 * 4. Prikazuje Onboarding tutorial prvi put
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { PageLoader } from '@/components/ui/Spinner'
import { OnboardingModal } from '@/components/ui/OnboardingModal'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, role, isLoading } = useAuth()

  // Auth guard - redirect ako nije admin
  useEffect(() => {
    if (!isLoading && (!user || role !== 'ADMIN')) {
      router.push('/admin/login')
    }
  }, [user, role, isLoading, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <PageLoader message="Učitavanje..." />
      </div>
    )
  }

  // Ako nije admin, ne prikazuj ništa (redirect će se desiti)
  if (!user || role !== 'ADMIN') {
    return null
  }

  return (
    <OnboardingProvider userType="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Sidebar - narandžasta admin tema */}
        <Sidebar isAdmin={true} />
        
        {/* Main content */}
        <div className="lg:pl-64 transition-all duration-300">
          {/* Header */}
          <Header isAdmin={true} />
          
          {/* Page content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Onboarding Tutorial */}
        <OnboardingModal type="admin" />
      </div>
    </OnboardingProvider>
  )
}
