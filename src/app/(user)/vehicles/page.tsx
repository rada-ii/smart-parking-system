'use client'

/**
 * USER VEHICLES (/vehicles)
 * =========================
 * 
 * Upravljanje vozilima korisnika.
 * Korisnik unosi tablice svojih vozila.
 */

import { useEffect, useState } from 'react'
import { vehiclesApi } from '@/lib/mock-api'
import { useGroupUser } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Vehicle } from '@/lib/types'
import { formatDate, formatLicensePlate, isValidLicensePlate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { Car, Plus, Trash2, Hash } from 'lucide-react'

export default function UserVehiclesPage() {
  const groupUser = useGroupUser()
  const { showToast } = useToast()
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    color: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch vehicles
  const fetchVehicles = async () => {
    if (!groupUser?.groupId) return
    
    const response = await vehiclesApi.getByGroup(groupUser.groupId)
    if (response.success && response.data) {
      setVehicles(response.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchVehicles()
  }, [groupUser?.groupId])

  // Handle form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.licensePlate.trim()) {
      errors.licensePlate = 'Tablice su obavezne'
    } else if (!isValidLicensePlate(form.licensePlate)) {
      errors.licensePlate = 'Format: BG-123-AB'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !groupUser) return

    setIsSubmitting(true)
    const formattedPlate = formatLicensePlate(form.licensePlate)
    const response = await vehiclesApi.create(
      groupUser.groupId, 
      { ...form, licensePlate: formattedPlate },
      `${groupUser.firstName} ${groupUser.lastName}`
    )
    setIsSubmitting(false)

    if (response.success) {
      showToast('success', 'Vozilo uspešno dodato')
      setShowModal(false)
      setForm({ licensePlate: '', brand: '', model: '', color: '' })
      fetchVehicles()
    } else {
      showToast('error', response.error || 'Greška pri dodavanju')
      if (response.error?.includes('tablicama')) {
        setFormErrors({ licensePlate: response.error })
      }
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    const response = await vehiclesApi.delete(deletingId)
    if (response.success) {
      showToast('success', 'Vozilo obrisano')
      setDeletingId(null)
      fetchVehicles()
    } else {
      showToast('error', 'Greška pri brisanju')
    }
  }

  if (isLoading || !groupUser) {
    return <PageLoader message="Učitavanje vozila..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Moja vozila</h1>
            <p className="section-description">Registrovana vozila za automatski pristup</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Dodaj vozilo
          </Button>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Car className="w-8 h-8" />}
                title="Nema vozila"
                description="Dodajte svoje vozilo za automatski pristup parkingu"
                action={
                  <Button onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    Dodaj vozilo
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} hover>
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-green-100 text-green-600">
                      <Car className="w-6 h-6" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(vehicle.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* License Plate */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="font-mono font-bold text-lg text-gray-900">
                        {vehicle.licensePlate}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  {(vehicle.brand || vehicle.model) && (
                    <p className="font-medium text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </p>
                  )}
                  {vehicle.color && (
                    <p className="text-sm text-gray-500">{vehicle.color}</p>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-4">
                    Dodato {formatDate(vehicle.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Vehicle Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Dodaj vozilo"
          description="Unesite podatke o vozilu za automatski pristup"
        >
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <Input
              label="Registarske tablice"
              name="licensePlate"
              placeholder="BG-123-AB"
              value={form.licensePlate}
              onChange={handleChange}
              error={formErrors.licensePlate}
              hint="Srpski format tablica"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marka (opciono)"
                name="brand"
                placeholder="Volkswagen"
                value={form.brand}
                onChange={handleChange}
              />
              <Input
                label="Model (opciono)"
                name="model"
                placeholder="Golf 8"
                value={form.model}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Boja (opciono)"
              name="color"
              placeholder="Bela"
              value={form.color}
              onChange={handleChange}
            />
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Otkaži
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Dodaj vozilo
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Obriši vozilo?"
          description="Vozilo više neće imati automatski pristup parkingu."
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
