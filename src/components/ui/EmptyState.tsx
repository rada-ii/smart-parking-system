'use client'

// ============================================
// EMPTY STATE - Prazno stanje
// ============================================
//
// Prikazuje se kada:
// - Nema podataka u listi
// - Nema rezultata pretrage
// - Korisnik treba da uradi prvu akciju
//
// PRIMER:
// <EmptyState
//   icon={<Car />}
//   title="Nema vozila"
//   description="Dodajte prvo vozilo"
//   action={<Button>Dodaj vozilo</Button>}
// />
// ============================================

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
