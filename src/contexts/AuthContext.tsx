'use client'

// ============================================
// AUTH CONTEXT - Globalno stanje autentikacije
// ============================================
//
// ŠTA RADI:
// - Čuva trenutnog korisnika (admin ili member)
// - Pamti ulogu (ADMIN, GROUP_ADMIN, MEMBER)
// - Pruža login/logout funkcije svim komponentama
//
// KAKO SE KORISTI:
// const { user, role, login, logout } = useAuth()
//
// ZAŠTO CONTEXT:
// Da ne bi morali prosleđivati user data kroz props
// na svakoj komponenti. Context je "globalna varijabla".
// ============================================

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User, UserRole, LoginForm, AdminRegisterForm, Admin, GroupUser } from '@/lib/types'
import { authApi } from '@/lib/mock-api'

// Tip za Context vrednost
interface AuthContextType {
  user: User | null
  role: UserRole | null
  isLoading: boolean
  isAdmin: boolean
  isGroupAdmin: boolean
  
  // Funkcije
  loginAdmin: (form: LoginForm) => Promise<{ success: boolean; error?: string }>
  loginUser: (form: LoginForm) => Promise<{ success: boolean; error?: string }>
  registerAdmin: (form: AdminRegisterForm) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

// Kreiraj Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider komponenta
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Proveri da li je korisnik ulogovan pri učitavanju
  useEffect(() => {
    const { user: savedUser, role: savedRole } = authApi.getCurrentUser()
    setUser(savedUser)
    setRole(savedRole)
    setIsLoading(false)
  }, [])

  // Admin login
  const loginAdmin = useCallback(async (form: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(form, true)
      if (response.success && response.data) {
        setUser(response.data.user)
        setRole(response.data.role)
        return { success: true }
      }
      return { success: false, error: response.error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // User login
  const loginUser = useCallback(async (form: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(form, false)
      if (response.success && response.data) {
        setUser(response.data.user)
        setRole(response.data.role)
        return { success: true }
      }
      return { success: false, error: response.error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Admin registracija
  const registerAdmin = useCallback(async (form: AdminRegisterForm) => {
    setIsLoading(true)
    try {
      const response = await authApi.registerAdmin(form)
      if (response.success && response.data) {
        setUser(response.data)
        setRole('ADMIN')
        return { success: true }
      }
      return { success: false, error: response.error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setRole(null)
  }, [])

  // Computed values
  const isAdmin = role === 'ADMIN'
  const isGroupAdmin = role === 'GROUP_ADMIN'

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isLoading,
      isAdmin,
      isGroupAdmin,
      loginAdmin,
      loginUser,
      registerAdmin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook za korišćenje auth context-a
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook za dobijanje admin podataka
export function useAdmin(): Admin | null {
  const { user, isAdmin } = useAuth()
  if (isAdmin && user && 'name' in user) {
    return user as Admin
  }
  return null
}

// Helper hook za dobijanje group user podataka
export function useGroupUser(): GroupUser | null {
  const { user, role } = useAuth()
  if ((role === 'GROUP_ADMIN' || role === 'MEMBER') && user && 'firstName' in user) {
    return user as GroupUser
  }
  return null
}
