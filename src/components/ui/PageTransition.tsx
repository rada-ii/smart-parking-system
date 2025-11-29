'use client'

// ============================================
// PAGE TRANSITION - Animacija promene stranice
// ============================================
//
// Wrapper koji dodaje animaciju kada se sadržaj
// stranice promeni. Poboljšava UX jer korisnik
// jasno vidi da se nešto desilo.
//
// KORIŠĆENJE:
// <PageTransition>
//   <YourPageContent />
// </PageTransition>
// ============================================

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div 
      className={cn(
        'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out',
        className
      )}
    >
      {children}
    </div>
  )
}

// Verzija sa staggered animacijom za liste
export function StaggeredList({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

// Item za staggered listu
export function StaggeredItem({ 
  children, 
  index = 0,
  className 
}: { 
  children: ReactNode
  index?: number
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'animate-in fade-in slide-in-from-bottom-2',
        className
      )}
      style={{ 
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {children}
    </div>
  )
}
