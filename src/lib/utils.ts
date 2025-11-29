// ============================================
// UTILS.TS - Pomoćne funkcije
// ============================================
//
// Ove funkcije se koriste kroz celu aplikaciju.
// "Čiste" su - nemaju side effects.
//
// ZAŠTO ODVAJAMO U POSEBAN FAJL:
// 1. Lakše testiranje
// 2. Reusability - koristimo na više mesta
// 3. Čistiji kod u komponentama
// ============================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DeviceType, DeviceStatus, AccessStatus, AccessMethod, LogAction } from './types'

// ============================================
// TAILWIND HELPERS
// ============================================

/**
 * Kombinuje Tailwind klase inteligentno.
 * Rešava konflikte (npr. "p-4 p-2" -> "p-2")
 * 
 * @example
 * cn('p-4', isLarge && 'p-8', 'text-red-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// ID I TOKEN GENERATORI
// ============================================

/**
 * Generiše random ID.
 * U produkciji bi backend generisao UUID.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Generiše token za pristup (12 karaktera)
 */
export function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Generiše PIN kod (4-6 cifara)
 */
export function generatePinCode(length: number = 4): string {
  let pin = ''
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10).toString()
  }
  return pin
}

// ============================================
// FORMATIRANJE DATUMA
// ============================================

/**
 * Formatira datum u srpski format: "01.12.2024."
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formatira datum i vreme: "01.12.2024. 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatira samo vreme: "14:30"
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatira za HTML datetime-local input
 */
export function formatForInput(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}

/**
 * Relativno vreme: "pre 5 minuta", "pre 2 sata"
 */
export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'upravo sada'
  if (minutes < 60) return `pre ${minutes} min`
  if (hours < 24) return `pre ${hours}h`
  if (days < 7) return `pre ${days} dana`
  
  return formatDate(d)
}

// ============================================
// PREVODI I LABELE
// ============================================

/**
 * Naziv tipa uređaja na srpskom
 */
export function getDeviceTypeName(type: DeviceType): string {
  const names: Record<DeviceType, string> = {
    BARRIER: 'Rampa',
    GATE: 'Kapija',
    SMART_LOCK: 'Pametna brava',
    GARAGE: 'Garaža',
  }
  return names[type] || type
}

/**
 * Naziv statusa uređaja
 */
export function getDeviceStatusName(status: DeviceStatus): string {
  const names: Record<DeviceStatus, string> = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    MAINTENANCE: 'Održavanje',
  }
  return names[status] || status
}

/**
 * Boja statusa uređaja za CSS
 */
export function getDeviceStatusColor(status: DeviceStatus): string {
  const colors: Record<DeviceStatus, string> = {
    ONLINE: 'bg-green-500',
    OFFLINE: 'bg-red-500',
    MAINTENANCE: 'bg-yellow-500',
  }
  return colors[status] || 'bg-gray-400'
}

/**
 * Naziv statusa pristupa
 */
export function getAccessStatusName(status: AccessStatus): string {
  const names: Record<AccessStatus, string> = {
    ACTIVE: 'Aktivan',
    EXPIRED: 'Istekao',
    REVOKED: 'Opozvan',
    USED: 'Iskorišćen',
  }
  return names[status] || status
}

/**
 * Boja statusa pristupa
 */
export function getAccessStatusColor(status: AccessStatus): string {
  const colors: Record<AccessStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    EXPIRED: 'bg-gray-100 text-gray-600',
    REVOKED: 'bg-red-100 text-red-700',
    USED: 'bg-blue-100 text-blue-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-600'
}

/**
 * Naziv metode pristupa
 */
export function getAccessMethodName(method: AccessMethod): string {
  const names: Record<AccessMethod, string> = {
    PHONE: 'Telefon',
    PIN: 'PIN kod',
    LICENSE_PLATE: 'Tablice',
    LINK: 'Link',
  }
  return names[method] || method
}

/**
 * Naziv akcije u logu
 */
export function getLogActionName(action: LogAction): string {
  const names: Record<LogAction, string> = {
    ACCESS_GRANTED: 'Pristup odobren',
    ACCESS_DENIED: 'Pristup odbijen',
    DEVICE_ONLINE: 'Uređaj online',
    DEVICE_OFFLINE: 'Uređaj offline',
    GROUP_CREATED: 'Grupa kreirana',
    USER_ADDED: 'Korisnik dodat',
    VEHICLE_ADDED: 'Vozilo dodato',
    GUEST_ACCESS: 'Gost pristupio',
  }
  return names[action] || action
}

// ============================================
// VALIDACIJA
// ============================================

/**
 * Validira email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validira srpski telefon
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+381|0)[0-9]{8,10}$/.test(cleaned)
}

/**
 * Validira format tablica (srpski format)
 * Prihvata: BG-123-AB, BG123AB, NS 123 AB
 */
export function isValidLicensePlate(plate: string): boolean {
  const cleaned = plate.replace(/[\s-]/g, '').toUpperCase()
  // Srpski format: 2 slova + 3-4 cifre + 2 slova
  return /^[A-Z]{2}[0-9]{3,4}[A-Z]{2}$/.test(cleaned)
}

/**
 * Formatira tablice u standardni format: "BG-123-AB"
 */
export function formatLicensePlate(plate: string): string {
  const cleaned = plate.replace(/[\s-]/g, '').toUpperCase()
  if (cleaned.length >= 7) {
    const letters1 = cleaned.slice(0, 2)
    const numbers = cleaned.slice(2, -2)
    const letters2 = cleaned.slice(-2)
    return `${letters1}-${numbers}-${letters2}`
  }
  return plate.toUpperCase()
}

/**
 * Validira PIN kod
 */
export function isValidPin(pin: string): boolean {
  return /^[0-9]{4,6}$/.test(pin)
}

// ============================================
// CLIPBOARD
// ============================================

/**
 * Kopira tekst u clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback za starije browsere
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Sigurno čita iz localStorage
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

/**
 * Sigurno piše u localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

/**
 * Briše iz localStorage
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    console.error('Failed to remove from localStorage')
  }
}
