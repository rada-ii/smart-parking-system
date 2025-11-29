'use client'

/**
 * NOTIFICATION CONTEXT
 * =====================
 * 
 * Upravlja Web Push notifikacijama.
 * 
 * FEATURES:
 * - Traži dozvolu za notifikacije
 * - Šalje lokalne notifikacije
 * - Čuva preference u localStorage
 * 
 * NAPOMENA: Za prave push notifikacije potreban je backend sa Service Worker-om.
 * Ova implementacija koristi Notification API za demo.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface NotificationContextType {
  permission: NotificationPermission | 'default'
  isSupported: boolean
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, options?: NotificationOptions) => void
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const NOTIFICATION_ENABLED_KEY = 'parking_notifications_enabled'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabledState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Proveri da li browser podržava notifikacije
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Učitaj preference iz localStorage
      const saved = localStorage.getItem(NOTIFICATION_ENABLED_KEY)
      if (saved === 'true' && Notification.permission === 'granted') {
        setIsEnabledState(true)
      }
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        setIsEnabledState(true)
        localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true')
        
        // Prikaži test notifikaciju
        new Notification('Notifikacije uključene! 🔔', {
          body: 'Sada ćete dobijati obaveštenja o aktivnostima na parkingu.',
          icon: '/logo.jpg'
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [isSupported])

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || !isEnabled || permission !== 'granted') return

    try {
      new Notification(title, {
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        ...options
      })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }, [isSupported, isEnabled, permission])

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabledState(enabled)
    localStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled ? 'true' : 'false')
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NotificationContext.Provider value={{
      permission,
      isSupported,
      requestPermission,
      sendNotification,
      isEnabled,
      setEnabled
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

/**
 * NOTIFICATION TYPES
 * ===================
 * 
 * Predefinisane notifikacije za različite događaje.
 */
export const NotificationMessages = {
  guestAccess: (guestName?: string, spotNumber?: string) => ({
    title: 'Gost otvorio rampu! 🚗',
    body: guestName 
      ? `${guestName} je upravo otvorio rampu${spotNumber ? ` (Mesto ${spotNumber})` : ''}.`
      : `Neko je upravo otvorio rampu${spotNumber ? ` (Mesto ${spotNumber})` : ''}.`
  }),
  
  accessExpiring: (hoursLeft: number) => ({
    title: 'Pristup ističe uskoro ⏰',
    body: `Pristup za gosta ističe za ${hoursLeft} sata.`
  }),
  
  newUserAdded: (userName: string) => ({
    title: 'Novi korisnik dodat 👤',
    body: `${userName} je dodat u vašu grupu.`
  }),
  
  deviceOffline: (deviceName: string) => ({
    title: 'Uređaj offline ⚠️',
    body: `${deviceName} nije dostupan. Proverite konekciju.`
  })
}
