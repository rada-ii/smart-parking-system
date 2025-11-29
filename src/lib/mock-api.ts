// ============================================
// MOCK-API.TS - Simulirani Backend API
// ============================================
//
// KAKO RADI:
// Svaka funkcija simulira API poziv sa delay-om.
// Podaci se čuvaju u localStorage.
//
// KAKO POVEZATI SA PRAVIM BACKEND-OM:
// Zameni sadržaj svake funkcije sa fetch() pozivom.
// 
// Primer:
// MOCK:
//   async login(form) { ... localStorage logika ... }
// 
// PRAVI API:
//   async login(form) {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(form)
//     })
//     return res.json()
//   }
// ============================================

import { 
  Admin, GroupUser, User, Device, Group, 
  ParkingSpot, Vehicle, AccessGrant, ActivityLog,
  LoginForm, AdminRegisterForm, GroupForm, VehicleForm, GuestAccessForm,
  ApiResponse, UserRole
} from './types'

import {
  mockAdmins, mockGroupUsers, mockDevices, mockGroups,
  mockParkingSpots, mockVehicles, mockAccessGrants, mockActivityLogs,
  mockPasswords, ADMIN_REGISTRATION_CODE
} from './mock-data'

import { generateId, generateToken, generatePinCode, getFromStorage, saveToStorage } from './utils'

// Simulira network delay
const delay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms + Math.random() * 300))

// Storage keys
const STORAGE = {
  CURRENT_USER: 'parking_current_user',
  USER_ROLE: 'parking_user_role',
  ADMINS: 'parking_admins',
  GROUP_USERS: 'parking_group_users',
  DEVICES: 'parking_devices',
  GROUPS: 'parking_groups',
  SPOTS: 'parking_spots',
  VEHICLES: 'parking_vehicles',
  GRANTS: 'parking_grants',
  LOGS: 'parking_logs',
}

// Inicijalizuj storage sa mock podacima
function initStorage() {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem(STORAGE.ADMINS)) {
    saveToStorage(STORAGE.ADMINS, mockAdmins)
  }
  if (!localStorage.getItem(STORAGE.GROUP_USERS)) {
    saveToStorage(STORAGE.GROUP_USERS, mockGroupUsers)
  }
  if (!localStorage.getItem(STORAGE.DEVICES)) {
    saveToStorage(STORAGE.DEVICES, mockDevices)
  }
  if (!localStorage.getItem(STORAGE.GROUPS)) {
    saveToStorage(STORAGE.GROUPS, mockGroups)
  }
  if (!localStorage.getItem(STORAGE.SPOTS)) {
    saveToStorage(STORAGE.SPOTS, mockParkingSpots)
  }
  if (!localStorage.getItem(STORAGE.VEHICLES)) {
    saveToStorage(STORAGE.VEHICLES, mockVehicles)
  }
  if (!localStorage.getItem(STORAGE.GRANTS)) {
    saveToStorage(STORAGE.GRANTS, mockAccessGrants)
  }
  if (!localStorage.getItem(STORAGE.LOGS)) {
    saveToStorage(STORAGE.LOGS, mockActivityLogs)
  }
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  /**
   * Login za sve korisnike (admin i obični)
   * Backend endpoint: POST /api/auth/login
   */
  async login(form: LoginForm, isAdmin: boolean = false): Promise<ApiResponse<{ user: User; role: UserRole }>> {
    await delay()
    initStorage()
    
    if (isAdmin) {
      const admins = getFromStorage<Admin[]>(STORAGE.ADMINS, mockAdmins)
      const admin = admins.find(a => a.email === form.email)
      const validPassword = mockPasswords[form.email] === form.password
      
      if (!admin || !validPassword) {
        return { success: false, error: 'Pogrešan email ili lozinka' }
      }
      
      saveToStorage(STORAGE.CURRENT_USER, admin)
      saveToStorage(STORAGE.USER_ROLE, 'ADMIN')
      
      return { success: true, data: { user: admin, role: 'ADMIN' } }
    } else {
      const users = getFromStorage<GroupUser[]>(STORAGE.GROUP_USERS, mockGroupUsers)
      const user = users.find(u => u.email === form.email)
      const validPassword = mockPasswords[form.email] === form.password
      
      if (!user || !validPassword) {
        return { success: false, error: 'Pogrešan email ili lozinka' }
      }
      
      if (!user.isActive) {
        return { success: false, error: 'Nalog je deaktiviran' }
      }
      
      saveToStorage(STORAGE.CURRENT_USER, user)
      saveToStorage(STORAGE.USER_ROLE, user.role)
      
      return { success: true, data: { user, role: user.role } }
    }
  },

  /**
   * Registracija novog admina
   * Backend endpoint: POST /api/auth/admin/register
   */
  async registerAdmin(form: AdminRegisterForm): Promise<ApiResponse<Admin>> {
    await delay()
    initStorage()
    
    // Proveri admin kod
    if (form.adminCode !== ADMIN_REGISTRATION_CODE) {
      return { success: false, error: 'Nevažeći administratorski kod' }
    }
    
    const admins = getFromStorage<Admin[]>(STORAGE.ADMINS, mockAdmins)
    
    // Proveri da li email postoji
    if (admins.find(a => a.email === form.email)) {
      return { success: false, error: 'Administrator sa ovim emailom već postoji' }
    }
    
    const newAdmin: Admin = {
      id: generateId(),
      email: form.email,
      name: form.name,
      phone: form.phone,
      role: 'ADMIN',
      createdAt: new Date(),
    }
    
    admins.push(newAdmin)
    saveToStorage(STORAGE.ADMINS, admins)
    mockPasswords[form.email] = form.password
    
    saveToStorage(STORAGE.CURRENT_USER, newAdmin)
    saveToStorage(STORAGE.USER_ROLE, 'ADMIN')
    
    return { success: true, data: newAdmin }
  },

  /**
   * Logout
   * Backend endpoint: POST /api/auth/logout
   */
  async logout(): Promise<void> {
    await delay(200)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE.CURRENT_USER)
      localStorage.removeItem(STORAGE.USER_ROLE)
    }
  },

  /**
   * Dobavi trenutnog korisnika
   */
  getCurrentUser(): { user: User | null; role: UserRole | null } {
    if (typeof window === 'undefined') return { user: null, role: null }
    
    const user = getFromStorage<User | null>(STORAGE.CURRENT_USER, null)
    const role = getFromStorage<UserRole | null>(STORAGE.USER_ROLE, null)
    
    return { user, role }
  },
}

// ============================================
// DEVICES API (Admin only)
// ============================================

export const devicesApi = {
  /**
   * Lista svih uređaja
   * Backend endpoint: GET /api/devices
   */
  async getAll(): Promise<ApiResponse<Device[]>> {
    await delay()
    initStorage()
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    return { success: true, data: devices }
  },

  /**
   * Dodaj novi uređaj
   * Backend endpoint: POST /api/devices
   */
  async create(data: { serialNumber: string; name: string; deviceType: Device['deviceType']; location: string }): Promise<ApiResponse<Device>> {
    await delay()
    initStorage()
    
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    
    // Proveri da li serijski broj postoji
    if (devices.find(d => d.serialNumber === data.serialNumber)) {
      return { success: false, error: 'Uređaj sa ovim serijskim brojem već postoji' }
    }
    
    const newDevice: Device = {
      id: generateId(),
      serialNumber: data.serialNumber,
      name: data.name,
      deviceType: data.deviceType,
      location: data.location,
      status: 'OFFLINE',
      isActive: true,
      createdAt: new Date(),
    }
    
    devices.push(newDevice)
    saveToStorage(STORAGE.DEVICES, devices)
    
    // Log
    await logsApi.create({
      action: 'DEVICE_ONLINE',
      deviceId: newDevice.id,
      success: true,
      message: `Dodat uređaj: ${newDevice.name} (${newDevice.serialNumber})`,
    })
    
    return { success: true, data: newDevice }
  },

  /**
   * Obriši uređaj
   * Backend endpoint: DELETE /api/devices/:id
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay()
    
    let devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    devices = devices.filter(d => d.id !== id)
    saveToStorage(STORAGE.DEVICES, devices)
    
    return { success: true }
  },

  /**
   * Test konekcije
   * Backend endpoint: POST /api/devices/:id/test
   */
  async testConnection(id: string): Promise<ApiResponse<{ status: Device['status'] }>> {
    await delay(1500)
    
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    const idx = devices.findIndex(d => d.id === id)
    
    if (idx === -1) {
      return { success: false, error: 'Uređaj nije pronađen' }
    }
    
    // Simulacija: 80% šansa da je online
    const isOnline = Math.random() > 0.2
    devices[idx].status = isOnline ? 'ONLINE' : 'OFFLINE'
    devices[idx].lastSeenAt = new Date()
    saveToStorage(STORAGE.DEVICES, devices)
    
    return { success: true, data: { status: devices[idx].status } }
  },
}

// ============================================
// GROUPS API (Admin only)
// ============================================

export const groupsApi = {
  /**
   * Lista svih grupa
   * Backend endpoint: GET /api/groups
   */
  async getAll(): Promise<ApiResponse<(Group & { device?: Device; usersCount: number })[]>> {
    await delay()
    initStorage()
    
    const groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    const users = getFromStorage<GroupUser[]>(STORAGE.GROUP_USERS, mockGroupUsers)
    
    const enriched = groups.map(g => ({
      ...g,
      device: devices.find(d => d.id === g.deviceId),
      usersCount: users.filter(u => u.groupId === g.id).length,
    }))
    
    return { success: true, data: enriched }
  },

  /**
   * Dobavi jednu grupu
   * Backend endpoint: GET /api/groups/:id
   */
  async getById(id: string): Promise<ApiResponse<Group & { device?: Device; users: GroupUser[]; spots: ParkingSpot[] }>> {
    await delay()
    initStorage()
    
    const groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    const users = getFromStorage<GroupUser[]>(STORAGE.GROUP_USERS, mockGroupUsers)
    const spots = getFromStorage<ParkingSpot[]>(STORAGE.SPOTS, mockParkingSpots)
    
    const group = groups.find(g => g.id === id)
    if (!group) {
      return { success: false, error: 'Grupa nije pronađena' }
    }
    
    return { 
      success: true, 
      data: {
        ...group,
        device: devices.find(d => d.id === group.deviceId),
        users: users.filter(u => u.groupId === id),
        spots: spots.filter(s => s.groupId === id),
      }
    }
  },

  /**
   * Kreiraj grupu
   * Backend endpoint: POST /api/groups
   */
  async create(adminId: string, form: GroupForm): Promise<ApiResponse<Group>> {
    await delay()
    initStorage()
    
    const groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    const spots = getFromStorage<ParkingSpot[]>(STORAGE.SPOTS, mockParkingSpots)
    
    const newGroup: Group = {
      id: generateId(),
      name: form.name,
      description: form.description,
      deviceId: form.deviceId,
      maxParkingSpots: form.maxParkingSpots,
      isActive: true,
      createdAt: new Date(),
      createdById: adminId,
    }
    
    groups.push(newGroup)
    saveToStorage(STORAGE.GROUPS, groups)
    
    // Kreiraj parking mesta
    for (let i = 1; i <= form.maxParkingSpots; i++) {
      const spot: ParkingSpot = {
        id: generateId(),
        groupId: newGroup.id,
        spotNumber: `${newGroup.name.substring(0, 1).toUpperCase()}-${String(i).padStart(2, '0')}`,
        isOccupied: false,
      }
      spots.push(spot)
    }
    saveToStorage(STORAGE.SPOTS, spots)
    
    // Log
    await logsApi.create({
      action: 'GROUP_CREATED',
      groupId: newGroup.id,
      userId: adminId,
      success: true,
      message: `Kreirana grupa: ${newGroup.name}`,
    })
    
    return { success: true, data: newGroup }
  },

  /**
   * Dodaj korisnika u grupu
   * Backend endpoint: POST /api/groups/:id/users
   */
  async addUser(groupId: string, data: { email: string; firstName: string; lastName: string; phone?: string; role: 'GROUP_ADMIN' | 'MEMBER' }): Promise<ApiResponse<GroupUser>> {
    await delay()
    initStorage()
    
    const users = getFromStorage<GroupUser[]>(STORAGE.GROUP_USERS, mockGroupUsers)
    
    // Proveri da li email postoji
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Korisnik sa ovim emailom već postoji' }
    }
    
    const newUser: GroupUser = {
      id: generateId(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      groupId,
      isActive: true,
      createdAt: new Date(),
    }
    
    users.push(newUser)
    saveToStorage(STORAGE.GROUP_USERS, users)
    
    // Default password (u produkciji bi se slao email)
    mockPasswords[data.email] = 'password123'
    
    // Log
    await logsApi.create({
      action: 'USER_ADDED',
      groupId,
      userId: newUser.id,
      success: true,
      message: `Dodat korisnik: ${data.firstName} ${data.lastName}`,
    })
    
    return { success: true, data: newUser, message: 'Privremena lozinka: password123' }
  },

  /**
   * Obriši grupu
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay()
    
    let groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    groups = groups.filter(g => g.id !== id)
    saveToStorage(STORAGE.GROUPS, groups)
    
    return { success: true }
  },
}

// ============================================
// VEHICLES API (User)
// ============================================

export const vehiclesApi = {
  /**
   * Lista vozila grupe
   * Backend endpoint: GET /api/vehicles?groupId=xxx
   */
  async getByGroup(groupId: string): Promise<ApiResponse<Vehicle[]>> {
    await delay()
    initStorage()
    
    const vehicles = getFromStorage<Vehicle[]>(STORAGE.VEHICLES, mockVehicles)
    const groupVehicles = vehicles.filter(v => v.groupId === groupId && v.isActive)
    
    return { success: true, data: groupVehicles }
  },

  /**
   * Dodaj vozilo
   * Backend endpoint: POST /api/vehicles
   */
  async create(groupId: string, form: VehicleForm, ownerName?: string): Promise<ApiResponse<Vehicle>> {
    await delay()
    initStorage()
    
    const vehicles = getFromStorage<Vehicle[]>(STORAGE.VEHICLES, mockVehicles)
    
    // Proveri da li tablice postoje
    const normalizedPlate = form.licensePlate.replace(/[\s-]/g, '').toUpperCase()
    if (vehicles.find(v => v.licensePlate.replace(/[\s-]/g, '').toUpperCase() === normalizedPlate && v.isActive)) {
      return { success: false, error: 'Vozilo sa ovim tablicama već postoji' }
    }
    
    const newVehicle: Vehicle = {
      id: generateId(),
      groupId,
      licensePlate: form.licensePlate.toUpperCase(),
      brand: form.brand,
      model: form.model,
      color: form.color,
      ownerName,
      isGuest: false,
      isActive: true,
      createdAt: new Date(),
    }
    
    vehicles.push(newVehicle)
    saveToStorage(STORAGE.VEHICLES, vehicles)
    
    // Log
    await logsApi.create({
      action: 'VEHICLE_ADDED',
      groupId,
      vehicleId: newVehicle.id,
      success: true,
      message: `Dodato vozilo: ${newVehicle.licensePlate}`,
    })
    
    return { success: true, data: newVehicle }
  },

  /**
   * Obriši vozilo
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay()
    
    const vehicles = getFromStorage<Vehicle[]>(STORAGE.VEHICLES, mockVehicles)
    const idx = vehicles.findIndex(v => v.id === id)
    
    if (idx !== -1) {
      vehicles[idx].isActive = false
      saveToStorage(STORAGE.VEHICLES, vehicles)
    }
    
    return { success: true }
  },
}

// ============================================
// PARKING SPOTS API
// ============================================

export const spotsApi = {
  /**
   * Lista parking mesta grupe
   */
  async getByGroup(groupId: string): Promise<ApiResponse<(ParkingSpot & { vehicle?: Vehicle })[]>> {
    await delay()
    initStorage()
    
    const spots = getFromStorage<ParkingSpot[]>(STORAGE.SPOTS, mockParkingSpots)
    const vehicles = getFromStorage<Vehicle[]>(STORAGE.VEHICLES, mockVehicles)
    
    const groupSpots = spots
      .filter(s => s.groupId === groupId)
      .map(s => ({
        ...s,
        vehicle: s.currentVehicleId ? vehicles.find(v => v.id === s.currentVehicleId) : undefined,
      }))
    
    return { success: true, data: groupSpots }
  },
}

// ============================================
// ACCESS GRANTS API
// ============================================

export const grantsApi = {
  /**
   * Lista pristupa grupe
   */
  async getByGroup(groupId: string): Promise<ApiResponse<AccessGrant[]>> {
    await delay()
    initStorage()
    
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
    const groupGrants = grants.filter(g => g.groupId === groupId)
    
    return { success: true, data: groupGrants }
  },

  /**
   * Dobavi pristup po tokenu (za goste)
   */
  async getByToken(token: string): Promise<ApiResponse<AccessGrant & { group: Group; spot: ParkingSpot }>> {
    await delay(300)
    initStorage()
    
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
    const groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    const spots = getFromStorage<ParkingSpot[]>(STORAGE.SPOTS, mockParkingSpots)
    
    const grant = grants.find(g => g.token === token)
    
    if (!grant) {
      return { success: false, error: 'Nevažeći link za pristup' }
    }
    
    const group = groups.find(g => g.id === grant.groupId)
    const spot = spots.find(s => s.id === grant.parkingSpotId)
    
    if (!group || !spot) {
      return { success: false, error: 'Pristup nije validan' }
    }
    
    return { success: true, data: { ...grant, group, spot } }
  },

  /**
   * Kreiraj pristup za gosta
   */
  async create(userId: string, groupId: string, form: GuestAccessForm): Promise<ApiResponse<{ grant: AccessGrant; link: string }>> {
    await delay()
    initStorage()
    
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
    const token = generateToken()
    
    const newGrant: AccessGrant = {
      id: generateId(),
      token,
      groupId,
      parkingSpotId: form.parkingSpotId,
      guestName: form.guestName,
      guestPhone: form.guestPhone,
      guestLicensePlate: form.guestLicensePlate,
      accessMethods: form.accessMethods,
      pinCode: form.generatePin ? generatePinCode() : undefined,
      startTime: new Date(form.startTime),
      endTime: new Date(form.endTime),
      maxUses: form.maxUses,
      useCount: 0,
      status: 'ACTIVE',
      createdById: userId,
      createdAt: new Date(),
    }
    
    grants.push(newGrant)
    saveToStorage(STORAGE.GRANTS, grants)
    
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000'
    
    return { 
      success: true, 
      data: { 
        grant: newGrant, 
        link: `${baseUrl}/g/${token}` 
      } 
    }
  },

  /**
   * Opozovi pristup
   */
  async revoke(id: string): Promise<ApiResponse<void>> {
    await delay()
    
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
    const idx = grants.findIndex(g => g.id === id)
    
    if (idx !== -1) {
      grants[idx].status = 'REVOKED'
      saveToStorage(STORAGE.GRANTS, grants)
    }
    
    return { success: true }
  },
}

// ============================================
// UNLOCK API
// ============================================

export const unlockApi = {
  /**
   * Otključaj (za goste)
   * Backend endpoint: POST /api/unlock
   */
  async unlock(token: string, method: 'LINK' | 'PIN', pinCode?: string): Promise<ApiResponse<{ message: string }>> {
    await delay(1500) // Simulira TCP komunikaciju
    
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
    const grant = grants.find(g => g.token === token)
    
    if (!grant) {
      await logsApi.create({
        action: 'ACCESS_DENIED',
        success: false,
        message: 'Nevažeći token',
      })
      return { success: false, error: 'Nevažeći pristup' }
    }
    
    // Provere
    if (grant.status !== 'ACTIVE') {
      return { success: false, error: 'Pristup nije aktivan' }
    }
    
    const now = new Date()
    if (now < new Date(grant.startTime)) {
      return { success: false, error: 'Pristup još nije počeo' }
    }
    
    if (now > new Date(grant.endTime)) {
      grant.status = 'EXPIRED'
      saveToStorage(STORAGE.GRANTS, grants)
      return { success: false, error: 'Pristup je istekao' }
    }
    
    if (grant.maxUses && grant.useCount >= grant.maxUses) {
      grant.status = 'USED'
      saveToStorage(STORAGE.GRANTS, grants)
      return { success: false, error: 'Iskorišćen maksimalan broj pristupa' }
    }
    
    // Proveri PIN ako je potrebno
    if (method === 'PIN' && grant.pinCode && grant.pinCode !== pinCode) {
      return { success: false, error: 'Pogrešan PIN kod' }
    }
    
    // Uspešno otključavanje
    const idx = grants.findIndex(g => g.id === grant.id)
    grants[idx].useCount++
    
    if (grants[idx].maxUses && grants[idx].useCount >= grants[idx].maxUses) {
      grants[idx].status = 'USED'
    }
    
    saveToStorage(STORAGE.GRANTS, grants)
    
    // Log
    await logsApi.create({
      action: 'GUEST_ACCESS',
      groupId: grant.groupId,
      grantId: grant.id,
      success: true,
      message: `Gost ${grant.guestName || 'Nepoznat'} - ${method} pristup`,
    })
    
    return { success: true, data: { message: 'Rampa je otvorena' } }
  },
}

// ============================================
// LOGS API
// ============================================

export const logsApi = {
  /**
   * Lista logova
   */
  async getAll(filters?: { groupId?: string; deviceId?: string }): Promise<ApiResponse<ActivityLog[]>> {
    await delay()
    initStorage()
    
    let logs = getFromStorage<ActivityLog[]>(STORAGE.LOGS, mockActivityLogs)
    
    if (filters?.groupId) {
      logs = logs.filter(l => l.groupId === filters.groupId)
    }
    if (filters?.deviceId) {
      logs = logs.filter(l => l.deviceId === filters.deviceId)
    }
    
    // Sortiraj po vremenu (najnovije prvo)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return { success: true, data: logs }
  },

  /**
   * Kreiraj log (interno)
   */
  async create(log: Partial<ActivityLog>): Promise<void> {
    const logs = getFromStorage<ActivityLog[]>(STORAGE.LOGS, mockActivityLogs)
    
    const newLog: ActivityLog = {
      id: generateId(),
      action: log.action || 'ACCESS_GRANTED',
      deviceId: log.deviceId,
      groupId: log.groupId,
      userId: log.userId,
      vehicleId: log.vehicleId,
      grantId: log.grantId,
      success: log.success ?? true,
      message: log.message || '',
      ipAddress: '192.168.1.1',
      timestamp: new Date(),
    }
    
    logs.unshift(newLog)
    saveToStorage(STORAGE.LOGS, logs)
  },
}

// ============================================
// STATS API
// ============================================

export const statsApi = {
  /**
   * Statistike za admin dashboard
   */
  async getAdminStats(): Promise<ApiResponse<{
    totalDevices: number
    onlineDevices: number
    totalGroups: number
    totalUsers: number
    todayAccesses: number
  }>> {
    await delay(400)
    initStorage()
    
    const devices = getFromStorage<Device[]>(STORAGE.DEVICES, mockDevices)
    const groups = getFromStorage<Group[]>(STORAGE.GROUPS, mockGroups)
    const users = getFromStorage<GroupUser[]>(STORAGE.GROUP_USERS, mockGroupUsers)
    const logs = getFromStorage<ActivityLog[]>(STORAGE.LOGS, mockActivityLogs)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAccesses = logs.filter(l => 
      (l.action === 'ACCESS_GRANTED' || l.action === 'GUEST_ACCESS') &&
      new Date(l.timestamp) >= today
    ).length
    
    return {
      success: true,
      data: {
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
        totalGroups: groups.filter(g => g.isActive).length,
        totalUsers: users.filter(u => u.isActive).length,
        todayAccesses,
      }
    }
  },

  /**
   * Statistike za user dashboard
   */
  async getUserStats(groupId: string): Promise<ApiResponse<{
    totalSpots: number
    occupiedSpots: number
    totalVehicles: number
    activeGrants: number
    todayAccesses: number
  }>> {
    await delay(400)
    initStorage()
    
    const spots = getFromStorage<ParkingSpot[]>(STORAGE.SPOTS, mockParkingSpots)
      .filter(s => s.groupId === groupId)
    const vehicles = getFromStorage<Vehicle[]>(STORAGE.VEHICLES, mockVehicles)
      .filter(v => v.groupId === groupId && v.isActive)
    const grants = getFromStorage<AccessGrant[]>(STORAGE.GRANTS, mockAccessGrants)
      .filter(g => g.groupId === groupId && g.status === 'ACTIVE')
    const logs = getFromStorage<ActivityLog[]>(STORAGE.LOGS, mockActivityLogs)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAccesses = logs.filter(l => 
      l.groupId === groupId &&
      (l.action === 'ACCESS_GRANTED' || l.action === 'GUEST_ACCESS') &&
      new Date(l.timestamp) >= today
    ).length
    
    return {
      success: true,
      data: {
        totalSpots: spots.length,
        occupiedSpots: spots.filter(s => s.isOccupied).length,
        totalVehicles: vehicles.length,
        activeGrants: grants.length,
        todayAccesses,
      }
    }
  },
}
