'use client'

// ============================================
// HEADER - Gornji bar stranice
// ============================================
//
// PRIKAZUJE:
// - Naslov trenutne stranice
// - Breadcrumbs (opciono)
// - Theme toggle (dark/light)
// - User avatar i brza podešavanja
//
// DVE TEME:
// - ADMIN: Narandžasti akcenti
// - USER: Plavi akcenti
// ============================================

import { usePathname } from 'next/navigation'
import { useAuth, useAdmin, useGroupUser } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Bell, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// Mapa naslova stranica
const pageTitles: Record<string, string> = {
  // Admin
  '/admin/dashboard': 'Kontrolna tabla',
  '/admin/devices': 'Uređaji',
  '/admin/groups': 'Grupe korisnika',
  '/admin/logs': 'Aktivnosti',
  // User
  '/dashboard': 'Kontrolna tabla',
  '/parking': 'Parking mesta',
  '/vehicles': 'Vozila',
  '/access': 'Pristup gostima',
  '/history': 'Istorija',
  '/settings': 'Podešavanja',
}

interface HeaderProps {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const pathname = usePathname()
  const admin = useAdmin()
  const groupUser = useGroupUser()
  
  const user = isAdmin ? admin : groupUser
  const userName = isAdmin 
    ? admin?.name 
    : `${groupUser?.firstName || ''} ${groupUser?.lastName || ''}`
  const userInitial = isAdmin 
    ? admin?.name?.charAt(0) 
    : groupUser?.firstName?.charAt(0)
  
  const title = pageTitles[pathname] || 'Dashboard'
  
  // Boja avatara zavisi od teme
  const avatarColor = isAdmin 
    ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
    : 'bg-gradient-to-br from-blue-500 to-blue-600'

  // Generiši breadcrumbs
  const generateBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean)
    const crumbs: { label: string; href: string }[] = []
    
    let path = ''
    for (const part of parts) {
      path += '/' + part
      const label = pageTitles[path] || part.charAt(0).toUpperCase() + part.slice(1)
      crumbs.push({ label, href: path })
    }
    
    return crumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4 pl-14 lg:pl-0">
          <div>
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
              <nav className="hidden sm:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-0.5">
                {breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.href} className="flex items-center gap-1">
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                    {idx === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            )}
            
            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Notifikacije"
          >
            <Bell className="w-5 h-5" />
            <span className={cn(
              'absolute top-1.5 right-1.5 w-2 h-2 rounded-full',
              isAdmin ? 'bg-primary-500' : 'bg-blue-500'
            )} />
          </button>

          {/* Separator */}
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm',
              avatarColor
            )}>
              {userInitial || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                {userName || 'Korisnik'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isAdmin ? 'Administrator' : 'Član'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
