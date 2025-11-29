'use client'

/**
 * ONBOARDING CONTEXT
 * ===================
 * 
 * Upravlja onboarding tutorialom.
 * Pamti u localStorage da li je korisnik završio tutorial.
 * 
 * KORIŠĆENJE:
 * const { showOnboarding, startOnboarding, completeOnboarding, hasSeenOnboarding } = useOnboarding()
 */

import { createContext, useContext, useEffect, useState } from 'react'

interface OnboardingContextType {
  showOnboarding: boolean
  hasSeenOnboarding: boolean
  startOnboarding: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_KEY_ADMIN = 'parking_onboarding_admin'
const ONBOARDING_KEY_USER = 'parking_onboarding_user'

export function OnboardingProvider({ 
  children, 
  userType 
}: { 
  children: React.ReactNode
  userType: 'admin' | 'user'
}) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)
  const [mounted, setMounted] = useState(false)

  const storageKey = userType === 'admin' ? ONBOARDING_KEY_ADMIN : ONBOARDING_KEY_USER

  useEffect(() => {
    setMounted(true)
    const seen = localStorage.getItem(storageKey)
    
    if (!seen) {
      // Korisnik nije video onboarding - prikaži ga
      setHasSeenOnboarding(false)
      setShowOnboarding(true)
    } else {
      setHasSeenOnboarding(true)
    }
  }, [storageKey])

  const startOnboarding = () => {
    setShowOnboarding(true)
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
    setHasSeenOnboarding(true)
    localStorage.setItem(storageKey, 'true')
  }

  const resetOnboarding = () => {
    localStorage.removeItem(storageKey)
    setHasSeenOnboarding(false)
  }

  // VAŽNO: Provider mora UVEK biti aktivan, čak i pre mount-a
  // Inače će children (Sidebar, OnboardingModal) dobiti grešku
  // "useOnboarding must be used within OnboardingProvider"
  return (
    <OnboardingContext.Provider value={{
      showOnboarding: mounted ? showOnboarding : false,
      hasSeenOnboarding: mounted ? hasSeenOnboarding : true,
      startOnboarding,
      completeOnboarding,
      resetOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
