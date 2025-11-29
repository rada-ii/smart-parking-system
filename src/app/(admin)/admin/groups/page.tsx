'use client'

/**
 * ADMIN GROUPS (/admin/groups)
 * ============================
 * 
 * Upravljanje grupama korisnika.
 * 
 * GRUPA = porodica ili firma koja ima:
 * - Pristup određenom uređaju (rampi)
 * - N parking mesta
 * - N članova
 * 
 * FUNKCIJE:
 * - Lista svih grupa
 * - Kreiranje nove grupe
 * - Dodavanje korisnika u grupu
 * - Brisanje grupe
 */

import { useEffect, useState } from 'react'
import { groupsApi, devicesApi } from '@/lib/mock-api'
import { Group, Device, GroupUser } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
import { useAdmin } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  Users, 
  Plus, 
  UserPlus,
  Trash2,
  ParkingCircle,
  Server,
  ChevronRight,
  Mail
} from 'lucide-react'

type GroupWithDetails = Group & { device?: Device; usersCount: number }

export default function AdminGroupsPage() {
  const { showToast } = useToast()
  const admin = useAdmin()
  
  const [groups, setGroups] = useState<GroupWithDetails[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Create group form
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    deviceId: '',
    maxParkingSpots: 1,
  })
  const [groupFormErrors, setGroupFormErrors] = useState<Record<string, string>>({})

  // Add user form  
  const [userForm, setUserForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'MEMBER' as 'GROUP_ADMIN' | 'MEMBER',
  })
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data
  const fetchData = async () => {
    const [groupsRes, devicesRes] = await Promise.all([
      groupsApi.getAll(),
      devicesApi.getAll(),
    ])
    
    if (groupsRes.success && groupsRes.data) setGroups(groupsRes.data)
    if (devicesRes.success && devicesRes.data) setDevices(devicesRes.data)
    
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle group form
  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setGroupForm(prev => ({ 
      ...prev, 
      [name]: name === 'maxParkingSpots' ? parseInt(value) || 1 : value 
    }))
  }

  const validateGroupForm = () => {
    const errors: Record<string, string> = {}
    if (!groupForm.name.trim()) errors.name = 'Naziv je obavezan'
    if (!groupForm.deviceId) errors.deviceId = 'Izaberite uređaj'
    if (groupForm.maxParkingSpots < 1) errors.maxParkingSpots = 'Minimum 1 mesto'
    setGroupFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateGroupForm() || !admin) return

    setIsSubmitting(true)
    const response = await groupsApi.create(admin.id, groupForm)
    setIsSubmitting(false)

    if (response.success) {
      showToast('success', 'Grupa uspešno kreirana')
      setShowCreateModal(false)
      setGroupForm({ name: '', description: '', deviceId: '', maxParkingSpots: 1 })
      fetchData()
    } else {
      showToast('error', response.error || 'Greška pri kreiranju')
    }
  }

  // Handle add user form
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserForm(prev => ({ ...prev, [name]: value }))
  }

  const validateUserForm = () => {
    const errors: Record<string, string> = {}
    if (!userForm.email.trim()) errors.email = 'Email je obavezan'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) errors.email = 'Nevažeći email'
    if (!userForm.firstName.trim()) errors.firstName = 'Ime je obavezno'
    if (!userForm.lastName.trim()) errors.lastName = 'Prezime je obavezno'
    setUserFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateUserForm() || !selectedGroupId) return

    setIsSubmitting(true)
    const response = await groupsApi.addUser(selectedGroupId, userForm)
    setIsSubmitting(false)

    if (response.success) {
      showToast('success', response.message || 'Korisnik dodat', 'Privremena lozinka poslata')
      setShowAddUserModal(false)
      setUserForm({ email: '', firstName: '', lastName: '', phone: '', role: 'MEMBER' })
      setSelectedGroupId(null)
      fetchData()
    } else {
      showToast('error', response.error || 'Greška pri dodavanju')
    }
  }

  // Delete group
  const handleDelete = async () => {
    if (!deletingId) return
    
    const response = await groupsApi.delete(deletingId)
    if (response.success) {
      showToast('success', 'Grupa obrisana')
      setDeletingId(null)
      fetchData()
    } else {
      showToast('error', 'Greška pri brisanju')
    }
  }

  if (isLoading) {
    return <PageLoader message="Učitavanje grupa..." />
  }

  const deviceOptions = devices.map(d => ({ value: d.id, label: d.name }))

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Grupe korisnika</h1>
            <p className="section-description">Porodice i firme sa parking mestima</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} adminTheme>
            <Plus className="w-4 h-4" />
            Nova grupa
          </Button>
        </div>

        {/* Groups */}
        {groups.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Users className="w-8 h-8" />}
                title="Nema grupa"
                description="Kreirajte prvu grupu korisnika"
                action={
                  <Button onClick={() => setShowCreateModal(true)} adminTheme>
                    <Plus className="w-4 h-4" />
                    Nova grupa
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 stagger-children">
            {groups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">
                  {/* Group Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-gray-500">{group.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Server className="w-4 h-4" />
                        <span>{group.device?.name || 'Bez uređaja'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ParkingCircle className="w-4 h-4" />
                        <span>{group.maxParkingSpots} parking {group.maxParkingSpots === 1 ? 'mesto' : 'mesta'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{group.usersCount} {group.usersCount === 1 ? 'član' : 'članova'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedGroupId(group.id)
                        setShowAddUserModal(true)
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      Dodaj člana
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeletingId(group.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nova grupa"
          description="Kreirajte grupu za porodicu ili firmu"
        >
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <Input
              label="Naziv grupe"
              name="name"
              placeholder="Porodica Marković"
              value={groupForm.name}
              onChange={handleGroupChange}
              error={groupFormErrors.name}
            />
            <Input
              label="Opis (opciono)"
              name="description"
              placeholder="Stan 15, ulaz A"
              value={groupForm.description}
              onChange={handleGroupChange}
            />
            <Select
              label="Uređaj (rampa)"
              name="deviceId"
              value={groupForm.deviceId}
              onChange={handleGroupChange}
              options={deviceOptions}
              placeholder="Izaberite uređaj"
              error={groupFormErrors.deviceId}
            />
            <Input
              label="Broj parking mesta"
              name="maxParkingSpots"
              type="number"
              min={1}
              max={10}
              value={groupForm.maxParkingSpots}
              onChange={handleGroupChange}
              error={groupFormErrors.maxParkingSpots}
            />
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                Otkaži
              </Button>
              <Button type="submit" isLoading={isSubmitting} adminTheme>
                Kreiraj grupu
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Add User Modal */}
        <Modal
          isOpen={showAddUserModal}
          onClose={() => {
            setShowAddUserModal(false)
            setSelectedGroupId(null)
          }}
          title="Dodaj člana"
          description="Novi član će dobiti pristupne podatke na email"
        >
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ime"
                name="firstName"
                placeholder="Marko"
                value={userForm.firstName}
                onChange={handleUserChange}
                error={userFormErrors.firstName}
              />
              <Input
                label="Prezime"
                name="lastName"
                placeholder="Marković"
                value={userForm.lastName}
                onChange={handleUserChange}
                error={userFormErrors.lastName}
              />
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="marko@example.com"
              value={userForm.email}
              onChange={handleUserChange}
              error={userFormErrors.email}
              leftIcon={<Mail className="w-5 h-5" />}
            />
            <Input
              label="Telefon (opciono)"
              name="phone"
              placeholder="+381 64 123 4567"
              value={userForm.phone}
              onChange={handleUserChange}
            />
            <Select
              label="Uloga"
              name="role"
              value={userForm.role}
              onChange={handleUserChange}
              options={[
                { value: 'GROUP_ADMIN', label: 'Administrator grupe' },
                { value: 'MEMBER', label: 'Član' },
              ]}
            />
            <ModalFooter>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowAddUserModal(false)
                  setSelectedGroupId(null)
                }}
              >
                Otkaži
              </Button>
              <Button type="submit" isLoading={isSubmitting} adminTheme>
                Dodaj člana
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Obriši grupu?"
          description="Svi korisnici, vozila i pristupi vezani za ovu grupu će biti obrisani."
        >
          <ModalFooter>
            <Button variant="secondary" onClick={() => setDeletingId(null)}>
              Otkaži
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Obriši
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </PageTransition>
  )
}
