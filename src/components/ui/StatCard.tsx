'use client'

// ============================================
// STAT CARD - Kartica sa statistikom
// ============================================
//
// Prikazuje:
// - Ikonu u boji
// - Veliki broj (vrednost)
// - Opis (šta broj predstavlja)
// - Opciono: trend (gore/dole)
//
// PRIMER:
// <StatCard
//   icon={<Car />}
//   value={5}
//   label="Vozila"
//   iconColor="bg-blue-500"
// />
// ============================================

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  icon: ReactNode
  value: number | string
  label: string
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  icon,
  value,
  label,
  iconColor = 'bg-gray-500',
  trend,
  className,
}: StatCardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-2xl p-6 border border-gray-100',
        'transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
          
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}% od prošle nedelje</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'p-3 rounded-xl text-white',
          iconColor
        )}>
          {icon}
        </div>
      </div>
    </div>
  )
}
