'use client'

// ============================================
// LOGO - Inova Tech logo
// ============================================
//
// RESPONSIVE:
// - Desktop: Horizontalni logo (logo-horizontal.png)
// - Mobile/Tablet: Kvadratni logo (logo.jpg)
//
// VELIČINE: sm, md, lg
// ============================================

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  linkTo?: string
  className?: string
  showText?: boolean
}

export function Logo({ 
  size = 'md', 
  linkTo = '/',
  className,
  showText = false 
}: LogoProps) {
  
  const sizes = {
    sm: { width: 100, height: 32, mobile: 32 },
    md: { width: 140, height: 40, mobile: 40 },
    lg: { width: 180, height: 48, mobile: 48 },
  }
  
  const { width, height, mobile } = sizes[size]

  const LogoContent = () => (
    <div className={cn('flex items-center', className)}>
      {/* Desktop: Horizontalni logo */}
      <div className="hidden sm:block">
        <Image
          src="/logo-horizontal.png"
          alt="Inova Tech"
          width={width}
          height={height}
          className="h-auto w-auto"
          priority
        />
      </div>
      
      {/* Mobile: Kvadratni logo */}
      <div className="block sm:hidden">
        <Image
          src="/logo.jpg"
          alt="Inova Tech"
          width={mobile}
          height={mobile}
          className="rounded-lg"
          priority
        />
      </div>
      
      {showText && (
        <span className="ml-2 font-semibold text-gray-900 hidden lg:block">
          Parking System
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="focus:outline-none">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}

// Mini logo za collapsed sidebar
export function MiniLogo({ className }: { className?: string }) {
  return (
    <div className={cn('w-10 h-10', className)}>
      <Image
        src="/logo.jpg"
        alt="Inova Tech"
        width={40}
        height={40}
        className="rounded-lg"
        priority
      />
    </div>
  )
}
