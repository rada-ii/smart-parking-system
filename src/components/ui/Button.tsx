'use client'

// ============================================
// BUTTON - Univerzalna dugme komponenta
// ============================================
//
// VARIJANTE:
// - primary: Glavna akcija (narandžasta za admin, plava za user)
// - secondary: Sekundarna akcija (siva)
// - danger: Opasna akcija (crvena)
// - ghost: Bez pozadine
// - outline: Samo okvir
//
// VELIČINE: sm, md, lg
//
// PROPS:
// - isLoading: Prikazuje spinner
// - variant: Varijanta boje
// - size: Veličina
// - adminTheme: Koristi admin boje (narandžasta)
// ============================================

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  adminTheme?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    disabled, 
    children,
    adminTheme = false,
    ...props 
  }, ref) => {
    
    const baseStyles = `
      inline-flex items-center justify-center font-medium 
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      disabled:opacity-50 disabled:cursor-not-allowed 
      rounded-xl
      transform active:scale-[0.98]
    `
    
    // Boje zavise od admin/user teme
    const variants = {
      primary: adminTheme
        ? 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      outline: adminTheme
        ? 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500'
        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Učitavanje...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
