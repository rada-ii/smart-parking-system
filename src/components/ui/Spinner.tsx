'use client'

// ============================================
// SPINNER - Loading indikator
// ============================================
//
// VELIČINE: sm, md, lg
// 
// PRIMER:
// <Spinner /> // Default medium
// <Spinner size="lg" />
// <PageLoader /> // Full screen loader
// ============================================

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-gray-400',
        sizes[size],
        className
      )} 
    />
  )
}

// Full page loader
export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full" />
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
      </div>
      {message && (
        <p className="text-gray-500 text-sm animate-pulse">{message}</p>
      )}
    </div>
  )
}

// Inline loader za dugmad i male prostore
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
    </div>
  )
}
