'use client'

// ============================================
// TOAST CONTEXT - Notifikacije
// ============================================
//
// ŠTA RADI:
// - Prikazuje kratke poruke (success, error, warning, info)
// - Automatski nestaju nakon 4 sekunde
// - Mogu se ručno zatvoriti
//
// KAKO SE KORISTI:
// const { showToast } = useToast()
// showToast('success', 'Uspešno sačuvano!')
// showToast('error', 'Greška pri čuvanju', 'Pokušajte ponovo')
// ============================================

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastType } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface ToastContextType {
  toasts: Toast[]
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void
  hideToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((
    type: ToastType, 
    message: string, 
    title?: string,
    duration: number = 4000
  ) => {
    const id = generateId()
    const toast: Toast = { id, type, message, title, duration }
    
    setToasts(prev => [...prev, toast])
    
    // Auto ukloni nakon duration (ako nije 0)
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
