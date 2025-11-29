'use client'

/**
 * ADMIN DEVICES (/admin/devices)
 * ==============================
 * 
 * Upravljanje uređajima (rampama, kapijama).
 * 
 * FUNKCIJE:
 * - Lista svih uređaja sa statusom
 * - Dodavanje novog uređaja (serijski broj)
 * - Test konekcije
 * - Brisanje uređaja
 */

import { useEffect, useState } from 'react'
import { devicesApi } from '@/lib/mock-api'
import { Device, DeviceType } from '@/lib/types'
import { getDeviceTypeName, getDeviceStatusColor, formatDateTime } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'
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
  Server, 
  Plus, 
  Wifi, 
  WifiOff, 
  Trash2, 
  RefreshCw,
  MapPin,
  Hash
} from 'lucide-react'

const deviceTypes: { value: DeviceType; label: string }[] = [
  { value: 'BARRIER', label: 'Rampa' },
  { value: 'GATE', label: 'Kapija' },
  { value: 'GARAGE', label: 'Garaža' },
  { value: 'SMART_LOCK', label: 'Pametna brava' },
]

export default function AdminDevicesPage() {
  const { showToast } = useToast()
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    serialNumber: '',
    name: '',
    deviceType: 'BARRIER' as DeviceType,
    location: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch devices
  const fetchDevices = async () => {
    const response = await devicesApi.getAll()
    if (response.success && response.data) {
      setDevices(response.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.serialNumber.trim()) errors.serialNumber = 'Serijski broj je obavezan'
    if (!form.name.trim()) errors.name = 'Naziv je obavezan'
    if (!form.location.trim()) errors.location = 'Lokacija je obavezna'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add device
  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    const response = await devicesApi.create(form)
    setIsSubmitting(false)

    if (response.success) {
      showToast('success', 'Uređaj uspešno dodat')
      setShowModal(false)
      setForm({ serialNumber: '', name: '', deviceType: 'BARRIER', location: '' })
      fetchDevices()
    } else {
      showToast('error', response.error || 'Greška pri dodavanju')
      if (response.error?.includes('serijski')) {
        setFormErrors({ serialNumber: response.error })
      }
    }
  }

  // Test connection
  const handleTestConnection = async (id: string) => {
    setTestingId(id)
    const response = await devicesApi.testConnection(id)
    setTestingId(null)

    if (response.success && response.data) {
      const isOnline = response.data.status === 'ONLINE'
      showToast(
        isOnline ? 'success' : 'warning',
        isOnline ? 'Uređaj je online' : 'Uređaj je offline'
      )
      fetchDevices()
    } else {
      showToast('error', 'Greška pri testiranju konekcije')
    }
  }

  // Delete device
  const handleDelete = async () => {
    if (!deletingId) return
    
    const response = await devicesApi.delete(deletingId)
    if (response.success) {
      showToast('success', 'Uređaj obrisan')
      setDeletingId(null)
      fetchDevices()
    } else {
      showToast('error', 'Greška pri brisanju')
    }
  }

  if (isLoading) {
    return <PageLoader message="Učitavanje uređaja..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Uređaji</h1>
            <p className="section-description">Upravljanje rampama i kapijama</p>
          </div>
          <Button onClick={() => setShowModal(true)} adminTheme>
            <Plus className="w-4 h-4" />
            Dodaj uređaj
          </Button>
        </div>

        {/* Devices Grid */}
        {devices.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Server className="w-8 h-8" />}
                title="Nema uređaja"
                description="Dodajte prvi uređaj da biste započeli"
                action={
                  <Button onClick={() => setShowModal(true)} adminTheme>
                    <Plus className="w-4 h-4" />
                    Dodaj uređaj
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {devices.map((device) => (
              <Card key={device.id} hover>
                <CardContent className="p-6">
                  {/* Status indicator */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      device.status === 'ONLINE' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {device.status === 'ONLINE' ? (
                        <Wifi className="w-6 h-6" />
                      ) : (
                        <WifiOff className="w-6 h-6" />
                      )}
                    </div>
                    <Badge 
                      variant={device.status === 'ONLINE' ? 'success' : 'error'}
                      dot
                    >
                      {device.status === 'ONLINE' ? 'Online' : 'Offline'}
                    </Badge>
                  </div>

                  {/* Device info */}
                  <h3 className="font-semibold text-gray-900 mb-1">{device.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {getDeviceTypeName(device.deviceType)}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Hash className="w-4 h-4" />
                      <span>{device.serialNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{device.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleTestConnection(device.id)}
                      isLoading={testingId === device.id}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(device.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Device Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Dodaj novi uređaj"
          description="Unesite podatke o rampi ili kapiji"
        >
          <form onSubmit={handleAddDevice} className="space-y-4">
            <Input
              label="Serijski broj"
              name="serialNumber"
              placeholder="IT-2024-XXX"
              value={form.serialNumber}
              onChange={handleChange}
              error={formErrors.serialNumber}
              hint="Serijski broj sa uređaja"
            />
            <Input
              label="Naziv uređaja"
              name="name"
              placeholder="Rampa - Parking A"
              value={form.name}
              onChange={handleChange}
              error={formErrors.name}
            />
            <Select
              label="Tip uređaja"
              name="deviceType"
              value={form.deviceType}
              onChange={handleChange}
              options={deviceTypes}
            />
            <Input
              label="Lokacija"
              name="location"
              placeholder="Beograd, Ulica bb"
              value={form.location}
              onChange={handleChange}
              error={formErrors.location}
            />
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Otkaži
              </Button>
              <Button type="submit" isLoading={isSubmitting} adminTheme>
                Dodaj uređaj
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Obriši uređaj?"
          description="Ova akcija se ne može poništiti. Svi podaci vezani za ovaj uređaj će biti obrisani."
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
