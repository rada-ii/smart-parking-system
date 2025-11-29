// ============================================
// MOCK-DATA.TS - Demo podaci za testiranje
// ============================================
//
// Ovi podaci simuliraju šta backend vraća.
// Koriste se samo dok nema pravog backend-a.
//
// STRUKTURA:
// - 1 Admin
// - 2 Grupe (porodice)
// - Po 2 korisnika u svakoj grupi
// - Vozila i parking mesta
// ============================================

import { 
  Admin, 
  GroupUser, 
  Device, 
  Group, 
  ParkingSpot, 
  Vehicle, 
  AccessGrant,
  ActivityLog 
} from './types'

// ============================================
// ADMIN
// ============================================

export const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    email: 'admin@inovatech.rs',
    name: 'Inova Admin',
    phone: '+381641234567',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
  },
]

// ============================================
// UREĐAJI (RAMPE)
// ============================================

export const mockDevices: Device[] = [
  {
    id: 'device-1',
    serialNumber: 'IT-2024-001',
    name: 'Rampa - Parking A',
    deviceType: 'BARRIER',
    location: 'Beograd, Bulevar Kralja Aleksandra 100',
    ipAddress: '192.168.1.100',
    port: 4001,
    status: 'ONLINE',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastSeenAt: new Date(),
  },
  {
    id: 'device-2',
    serialNumber: 'IT-2024-002',
    name: 'Kapija - Zgrada B',
    deviceType: 'GATE',
    location: 'Novi Sad, Bulevar Oslobođenja 50',
    ipAddress: '192.168.1.101',
    port: 4001,
    status: 'ONLINE',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastSeenAt: new Date(),
  },
  {
    id: 'device-3',
    serialNumber: 'IT-2024-003',
    name: 'Garaža - Lamela C',
    deviceType: 'GARAGE',
    location: 'Beograd, Takovska 25',
    ipAddress: '192.168.1.102',
    port: 4001,
    status: 'OFFLINE',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    lastSeenAt: new Date(Date.now() - 3600000),
  },
]

// ============================================
// GRUPE (PORODICE/FIRME)
// ============================================

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Porodica Marković',
    description: 'Stan 15, ulaz A',
    deviceId: 'device-1',
    maxParkingSpots: 2,
    isActive: true,
    createdAt: new Date('2024-01-20'),
    createdById: 'admin-1',
  },
  {
    id: 'group-2',
    name: 'Porodica Petrović',
    description: 'Stan 8, ulaz B',
    deviceId: 'device-1',
    maxParkingSpots: 1,
    isActive: true,
    createdAt: new Date('2024-02-05'),
    createdById: 'admin-1',
  },
  {
    id: 'group-3',
    name: 'Firma XYZ d.o.o.',
    description: 'Kancelarija 301',
    deviceId: 'device-2',
    maxParkingSpots: 3,
    isActive: true,
    createdAt: new Date('2024-02-15'),
    createdById: 'admin-1',
  },
]

// ============================================
// KORISNICI GRUPA
// ============================================

export const mockGroupUsers: GroupUser[] = [
  // Porodica Marković
  {
    id: 'user-1',
    email: 'marko@example.com',
    firstName: 'Marko',
    lastName: 'Marković',
    phone: '+381641111111',
    role: 'GROUP_ADMIN',
    groupId: 'group-1',
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'user-2',
    email: 'ana@example.com',
    firstName: 'Ana',
    lastName: 'Marković',
    phone: '+381642222222',
    role: 'MEMBER',
    groupId: 'group-1',
    isActive: true,
    createdAt: new Date('2024-01-21'),
  },
  // Porodica Petrović
  {
    id: 'user-3',
    email: 'petar@example.com',
    firstName: 'Petar',
    lastName: 'Petrović',
    phone: '+381643333333',
    role: 'GROUP_ADMIN',
    groupId: 'group-2',
    isActive: true,
    createdAt: new Date('2024-02-05'),
  },
  // Firma XYZ
  {
    id: 'user-4',
    email: 'direktor@xyz.rs',
    firstName: 'Milan',
    lastName: 'Direktor',
    phone: '+381644444444',
    role: 'GROUP_ADMIN',
    groupId: 'group-3',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
]

// ============================================
// PARKING MESTA
// ============================================

export const mockParkingSpots: ParkingSpot[] = [
  // Porodica Marković - 2 mesta
  {
    id: 'spot-1',
    groupId: 'group-1',
    spotNumber: 'A-15',
    description: 'Levo od ulaza',
    isOccupied: false,
    currentVehicleId: undefined,
  },
  {
    id: 'spot-2',
    groupId: 'group-1',
    spotNumber: 'A-16',
    description: 'Desno od ulaza',
    isOccupied: true,
    currentVehicleId: 'vehicle-1',
  },
  // Porodica Petrović - 1 mesto
  {
    id: 'spot-3',
    groupId: 'group-2',
    spotNumber: 'B-08',
    description: 'Pored lifta',
    isOccupied: false,
    currentVehicleId: undefined,
  },
  // Firma XYZ - 3 mesta
  {
    id: 'spot-4',
    groupId: 'group-3',
    spotNumber: 'C-01',
    isOccupied: false,
  },
  {
    id: 'spot-5',
    groupId: 'group-3',
    spotNumber: 'C-02',
    isOccupied: false,
  },
  {
    id: 'spot-6',
    groupId: 'group-3',
    spotNumber: 'C-03',
    isOccupied: true,
    currentVehicleId: 'vehicle-4',
  },
]

// ============================================
// VOZILA
// ============================================

export const mockVehicles: Vehicle[] = [
  // Porodica Marković
  {
    id: 'vehicle-1',
    groupId: 'group-1',
    licensePlate: 'BG-123-AB',
    brand: 'Volkswagen',
    model: 'Golf 8',
    color: 'Bela',
    ownerName: 'Marko Marković',
    isGuest: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'vehicle-2',
    groupId: 'group-1',
    licensePlate: 'BG-456-CD',
    brand: 'Škoda',
    model: 'Octavia',
    color: 'Siva',
    ownerName: 'Ana Marković',
    isGuest: false,
    isActive: true,
    createdAt: new Date('2024-01-21'),
  },
  // Porodica Petrović
  {
    id: 'vehicle-3',
    groupId: 'group-2',
    licensePlate: 'NS-789-EF',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Crna',
    ownerName: 'Petar Petrović',
    isGuest: false,
    isActive: true,
    createdAt: new Date('2024-02-05'),
  },
  // Firma XYZ
  {
    id: 'vehicle-4',
    groupId: 'group-3',
    licensePlate: 'BG-999-XY',
    brand: 'Mercedes',
    model: 'E-Class',
    color: 'Crna',
    ownerName: 'Službeno vozilo',
    isGuest: false,
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
]

// ============================================
// PRISTUPI ZA GOSTE
// ============================================

export const mockAccessGrants: AccessGrant[] = [
  {
    id: 'grant-1',
    token: 'abc123xyz789',
    groupId: 'group-1',
    parkingSpotId: 'spot-1',
    guestName: 'Jovan Gost',
    guestPhone: '+381645555555',
    guestLicensePlate: 'KG-111-AA',
    accessMethods: ['PIN', 'LICENSE_PLATE'],
    pinCode: '1234',
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // +24h
    maxUses: 2,
    useCount: 0,
    status: 'ACTIVE',
    createdById: 'user-1',
    createdAt: new Date(),
  },
  {
    id: 'grant-2',
    token: 'def456uvw321',
    groupId: 'group-1',
    parkingSpotId: 'spot-2',
    guestName: 'Majstor Pera',
    guestPhone: '+381646666666',
    accessMethods: ['PHONE', 'LINK'],
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // pre 2h
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // +4h
    useCount: 1,
    status: 'ACTIVE',
    createdById: 'user-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

// ============================================
// LOGOVI AKTIVNOSTI
// ============================================

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'ACCESS_GRANTED',
    deviceId: 'device-1',
    groupId: 'group-1',
    vehicleId: 'vehicle-1',
    success: true,
    message: 'Vozilo BG-123-AB - ulaz odobren',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'log-2',
    action: 'GUEST_ACCESS',
    deviceId: 'device-1',
    groupId: 'group-1',
    grantId: 'grant-2',
    success: true,
    message: 'Gost Majstor Pera - PIN pristup',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'log-3',
    action: 'ACCESS_DENIED',
    deviceId: 'device-1',
    success: false,
    message: 'Nepoznate tablice: XX-000-XX',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'log-4',
    action: 'VEHICLE_ADDED',
    groupId: 'group-1',
    vehicleId: 'vehicle-2',
    userId: 'user-1',
    success: true,
    message: 'Dodato vozilo BG-456-CD',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'log-5',
    action: 'GROUP_CREATED',
    groupId: 'group-1',
    userId: 'admin-1',
    success: true,
    message: 'Kreirana grupa: Porodica Marković',
    timestamp: new Date('2024-01-20'),
  },
]

// ============================================
// LOZINKE (samo za mock - u produkciji hash!)
// ============================================

export const mockPasswords: Record<string, string> = {
  'admin@inovatech.rs': 'admin123',
  'marko@example.com': 'marko123',
  'ana@example.com': 'ana123',
  'petar@example.com': 'petar123',
  'direktor@xyz.rs': 'xyz123',
}

// Admin registracioni kod
export const ADMIN_REGISTRATION_CODE = 'INOVA2024'
