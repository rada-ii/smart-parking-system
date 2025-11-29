// ============================================
// TYPES.TS - Definicije svih tipova podataka
// ============================================
//
// ZAŠTO JE OVO VAŽNO:
// TypeScript tipovi omogućavaju da IDE hvata greške
// dok pišeš kod, pre nego što se aplikacija pokrene.
// Svaki interface definiše "oblik" podataka.
//
// KAKO SE POVEZUJE SA BACKEND-OM:
// Ovi tipovi treba da odgovaraju strukturi koju
// backend vraća. Kada praviš API, koristi iste nazive.
// ============================================

// ============================================
// KORISNICI I ULOGE
// ============================================

// Tip uloge korisnika
export type UserRole = 'ADMIN' | 'GROUP_ADMIN' | 'MEMBER'

// Bazni korisnik (zajedničko za sve)
export interface BaseUser {
  id: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt?: Date
}

// Admin - upravlja celim sistemom
export interface Admin extends BaseUser {
  role: 'ADMIN'
  name: string
}

// Korisnik grupe - član porodice/firme
export interface GroupUser extends BaseUser {
  role: 'GROUP_ADMIN' | 'MEMBER'
  firstName: string
  lastName: string
  groupId: string
  isActive: boolean
}

// Unija svih korisnika
export type User = Admin | GroupUser

// ============================================
// UREĐAJI (RAMPE, BRAVE)
// ============================================

export type DeviceType = 'BARRIER' | 'GATE' | 'SMART_LOCK' | 'GARAGE'
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'

export interface Device {
  id: string
  serialNumber: string        // Serijski broj koji admin unosi
  name: string                // Npr. "Rampa - Parking A"
  deviceType: DeviceType
  location: string
  ipAddress?: string
  port?: number
  status: DeviceStatus
  isActive: boolean
  createdAt: Date
  lastSeenAt?: Date
}

// ============================================
// GRUPE (PORODICE, FIRME)
// ============================================

export interface Group {
  id: string
  name: string                // Npr. "Porodica Marković"
  description?: string
  deviceId: string            // Koji uređaj koriste
  maxParkingSpots: number     // Koliko mesta imaju
  isActive: boolean
  createdAt: Date
  createdById: string         // Admin koji je kreirao
}

// ============================================
// PARKING MESTA
// ============================================

export interface ParkingSpot {
  id: string
  groupId: string
  spotNumber: string          // Npr. "A-15" ili "Mesto 1"
  description?: string
  isOccupied: boolean
  currentVehicleId?: string   // Koje vozilo je trenutno tu
}

// ============================================
// VOZILA
// ============================================

export interface Vehicle {
  id: string
  groupId: string
  licensePlate: string        // Tablice: "BG-123-AB"
  brand?: string              // Marka: "Volkswagen"
  model?: string              // Model: "Golf"
  color?: string              // Boja: "Bela"
  ownerName?: string          // Vlasnik ako je gost
  isGuest: boolean            // Da li je gost vozilo
  isActive: boolean
  createdAt: Date
  expiresAt?: Date            // Za goste - kada ističe
}

// ============================================
// PRISTUPI (ZA GOSTE)
// ============================================

export type AccessMethod = 'PHONE' | 'PIN' | 'LICENSE_PLATE' | 'LINK'
export type AccessStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'USED'

export interface AccessGrant {
  id: string
  token: string               // Jedinstveni token za link
  groupId: string
  parkingSpotId: string
  
  // Podaci o gostu
  guestName?: string
  guestPhone?: string
  guestLicensePlate?: string
  
  // Metode pristupa
  accessMethods: AccessMethod[]
  pinCode?: string            // 4-6 cifara
  
  // Vremensko ograničenje
  startTime: Date
  endTime: Date
  maxUses?: number
  useCount: number
  
  status: AccessStatus
  createdById: string
  createdAt: Date
}

// ============================================
// LOGOVI / ISTORIJA
// ============================================

export type LogAction = 
  | 'ACCESS_GRANTED'      // Uspešno otvaranje
  | 'ACCESS_DENIED'       // Odbijen pristup
  | 'DEVICE_ONLINE'       // Uređaj se povezao
  | 'DEVICE_OFFLINE'      // Uređaj se isključio
  | 'GROUP_CREATED'       // Kreirana grupa
  | 'USER_ADDED'          // Dodat korisnik
  | 'VEHICLE_ADDED'       // Dodato vozilo
  | 'GUEST_ACCESS'        // Gost pristupio

export interface ActivityLog {
  id: string
  action: LogAction
  deviceId?: string
  groupId?: string
  userId?: string
  vehicleId?: string
  grantId?: string
  
  success: boolean
  message: string
  metadata?: Record<string, unknown>  // Dodatni podaci
  
  ipAddress?: string
  timestamp: Date
}

// ============================================
// FORME - ZA INPUT VALIDACIJU
// ============================================

export interface LoginForm {
  email: string
  password: string
}

export interface AdminRegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  phone?: string
  adminCode: string           // Specijalni kod za admin registraciju
}

export interface GroupForm {
  name: string
  description?: string
  deviceId: string
  maxParkingSpots: number
}

export interface VehicleForm {
  licensePlate: string
  brand?: string
  model?: string
  color?: string
}

export interface GuestAccessForm {
  parkingSpotId: string
  guestName?: string
  guestPhone?: string
  guestLicensePlate?: string
  accessMethods: AccessMethod[]
  startTime: string
  endTime: string
  maxUses?: number
  generatePin: boolean
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================
// UI STATE
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

// Theme za razlikovanje admin/user zona
export type ThemeMode = 'admin' | 'user'
