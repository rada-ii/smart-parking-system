'use client'

// ============================================
// SIDEBAR - Bočna navigacija
// ============================================
//
// DVE VERZIJE:
// - ADMIN: Narandžasta tema, linkovi za admin panel
// - USER: Plava tema, linkovi za korisnika
//
// RESPONSIVE:
// - Desktop: Fiksiran levo, može se collapse
// - Mobile: Overlay koji se otvara hamburger menijem
//
// FEATURES:
// - Animacija hover-a na linkovima
// - Aktivni link ima pozadinsku boju
// - User info i logout na dnu
// - Help dugme za pokretanje onboarding-a
// - Dark mode support
// ============================================

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo, MiniLogo } from './Logo'
import { useAuth, useAdmin, useGroupUser } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { 
  LayoutDashboard, 
  Server,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Car,
  ParkingCircle,
  Key,
  History,
  HelpCircle
} from 'lucide-react'

// Navigacija za ADMIN
const adminNavigation = [
  { name: 'Pregled', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Uređaji', href: '/admin/devices', icon: Server },
  { name: 'Grupe', href: '/admin/groups', icon: Users },
  { name: 'Aktivnosti', href: '/admin/logs', icon: ClipboardList },
]

// Navigacija za KORISNIKA
const userNavigation = [
  { name: 'Pregled', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Parking mesta', href: '/parking', icon: ParkingCircle },
  { name: 'Vozila', href: '/vehicles', icon: Car },
  { name: 'Pristupi', href: '/access', icon: Key },
  { name: 'Istorija', href: '/history', icon: History },
]

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const admin = useAdmin()
  const groupUser = useGroupUser()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Onboarding hook - sada radi jer je Provider uvek aktivan
  const onboarding = useOnboarding()

  const navigation = isAdmin ? adminNavigation : userNavigation
  const user = isAdmin ? admin : groupUser
  const userName = isAdmin 
    ? admin?.name 
    : `${groupUser?.firstName} ${groupUser?.lastName}`

  const handleLogout = async () => {
    await logout()
    router.push(isAdmin ? '/admin/login' : '/login')
  }

  // Boje zavise od admin/user - sa dark mode
  const activeColor = isAdmin 
    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  const activeIconColor = isAdmin 
    ? 'text-primary-500' 
    : 'text-blue-500'
  const hoverColor = isAdmin
    ? 'hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
    : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        aria-label="Otvori meni"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800',
        'transition-all duration-300 ease-out',
        // Desktop
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
        // Mobile
        isMobileOpen 
          ? 'translate-x-0 w-72' 
          : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-800">
          {isCollapsed ? (
            <MiniLogo />
          ) : (
            <Logo size="sm" linkTo={isAdmin ? '/admin/dashboard' : '/dashboard'} />
          )}
          
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? 'Proširi meni' : 'Skupi meni'}
          >
            <ChevronLeft className={cn(
              'w-5 h-5 transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )} />
          </button>
          
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Zatvori meni"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? cn(activeColor, 'font-medium')
                    : cn('text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white', hoverColor),
                  isCollapsed && 'lg:justify-center lg:px-0'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive && activeIconColor
                )} />
                <span className={cn(
                  'transition-opacity duration-200',
                  isCollapsed && 'lg:hidden'
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3">
          {/* User info */}
          {!isCollapsed && user && (
            <div className="px-3 py-3 mb-2 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}
          
          {/* Settings (samo za user) */}
          {!isAdmin && (
            <Link
              href="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mb-1',
                'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200',
                isCollapsed && 'lg:justify-center'
              )}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className={cn(isCollapsed && 'lg:hidden')}>Podešavanja</span>
            </Link>
          )}
          
          {/* Help / Tutorial */}
          <button
            onClick={() => {
              onboarding.startOnboarding()
              setIsMobileOpen(false)
            }}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mb-1',
              'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200',
              isCollapsed && 'lg:justify-center'
            )}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && 'lg:hidden')}>Pomoć</span>
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl',
              'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200',
              isCollapsed && 'lg:justify-center'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && 'lg:hidden')}>Odjavi se</span>
          </button>
        </div>
      </aside>
    </>
  )
}
