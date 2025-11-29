'use client'

/**
 * USER ACCESS (/access)
 * =====================
 * 
 * Kreiranje pristupa za goste.
 * 
 * FUNKCIJE:
 * - Lista aktivnih pristupa
 * - Kreiranje novog pristupa
 * - Metode: PIN, telefon, tablice, link
 * - Kopiranje linka
 * - Opoziv pristupa
 */

import { useEffect, useState } from 'react'
import { grantsApi, spotsApi } from '@/lib/mock-api'
import { useGroupUser } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AccessGrant, ParkingSpot, AccessMethod } from '@/lib/types'
import { formatDateTime, formatForInput, getAccessMethodName, copyToClipboard } from '@/lib/utils'
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
  Key, 
  Plus, 
  Copy, 
  XCircle,
  Clock,
  Phone,
  Hash,
  Car,
  Link as LinkIcon,
  CheckCircle
} from 'lucide-react'

export default function UserAccessPage() {
  const groupUser = useGroupUser()
  const { showToast } = useToast()
  
  const [grants, setGrants] = useState<AccessGrant[]>([])
  const [spots, setSpots] = useState<ParkingSpot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [newGrant, setNewGrant] = useState<{ grant: AccessGrant; link: string } | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // Form state
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  const [form, setForm] = useState({
    parkingSpotId: '',
    guestName: '',
    guestPhone: '',
    guestLicensePlate: '',
    startTime: formatForInput(now),
    endTime: formatForInput(tomorrow),
    maxUses: '',
    generatePin: true,
    methods: ['LINK', 'PIN'] as AccessMethod[],
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data
  const fetchData = async () => {
    if (!groupUser?.groupId) return
    
    const [grantsRes, spotsRes] = await Promise.all([
      grantsApi.getByGroup(groupUser.groupId),
      spotsApi.getByGroup(groupUser.groupId),
    ])
    
    if (grantsRes.success && grantsRes.data) setGrants(grantsRes.data)
    if (spotsRes.success && spotsRes.data) setSpots(spotsRes.data)
    
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [groupUser?.groupId])

  // Handle form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleMethod = (method: AccessMethod) => {
    setForm(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(m => m !== method)
        : [...prev.methods, method]
    }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.parkingSpotId) errors.parkingSpotId = 'Izaberite parking mesto'
    if (!form.startTime) errors.startTime = 'Unesite početak'
    if (!form.endTime) errors.endTime = 'Unesite kraj'
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      errors.endTime = 'Kraj mora biti posle početka'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !groupUser) return

    setIsSubmitting(true)
    const response = await grantsApi.create(groupUser.id, groupUser.groupId, {
      parkingSpotId: form.parkingSpotId,
      guestName: form.guestName || undefined,
      guestPhone: form.guestPhone || undefined,
      guestLicensePlate: form.guestLicensePlate || undefined,
      accessMethods: form.methods,
      startTime: form.startTime,
      endTime: form.endTime,
      maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
      generatePin: form.generatePin,
    })
    setIsSubmitting(false)

    if (response.success && response.data) {
      setNewGrant(response.data)
      setShowModal(false)
      setShowResultModal(true)
      fetchData()
      
      // Reset form
      setForm({
        parkingSpotId: '',
        guestName: '',
        guestPhone: '',
        guestLicensePlate: '',
        startTime: formatForInput(new Date()),
        endTime: formatForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        maxUses: '',
        generatePin: true,
        methods: ['LINK', 'PIN'],
      })
    } else {
      showToast('error', response.error || 'Greška pri kreiranju')
    }
  }

  const handleCopyLink = async (link: string) => {
    const success = await copyToClipboard(link)
    showToast(success ? 'success' : 'error', success ? 'Link kopiran!' : 'Greška pri kopiranju')
  }

  const handleRevoke = async () => {
    if (!revokingId) return
    
    const response = await grantsApi.revoke(revokingId)
    if (response.success) {
      showToast('success', 'Pristup opozvan')
      setRevokingId(null)
      fetchData()
    } else {
      showToast('error', 'Greška pri opozivanju')
    }
  }

  if (isLoading || !groupUser) {
    return <PageLoader message="Učitavanje..." />
  }

  const activeGrants = grants.filter(g => g.status === 'ACTIVE')
  const pastGrants = grants.filter(g => g.status !== 'ACTIVE')
  const spotOptions = spots.map(s => ({ value: s.id, label: `${s.spotNumber}${s.description ? ` - ${s.description}` : ''}` }))

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Pristupi za goste</h1>
            <p className="section-description">Upravljanje privremenim pristupima</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Novi pristup
          </Button>
        </div>

        {/* Active Grants */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivni pristupi</h2>
          {activeGrants.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={<Key className="w-8 h-8" />}
                  title="Nema aktivnih pristupa"
                  description="Kreirajte pristup za gosta"
                  action={
                    <Button onClick={() => setShowModal(true)}>
                      <Plus className="w-4 h-4" />
                      Novi pristup
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {activeGrants.map((grant) => {
                const spot = spots.find(s => s.id === grant.parkingSpotId)
                const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/g/${grant.token}`
                
                return (
                  <Card key={grant.id} className="border-2 border-green-200">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {grant.guestName || 'Gost'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Mesto: {spot?.spotNumber}
                          </p>
                        </div>
                        <Badge variant="success" dot>Aktivan</Badge>
                      </div>

                      {/* Methods */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {grant.accessMethods.map(m => (
                          <Badge key={m} variant="info">
                            {getAccessMethodName(m)}
                          </Badge>
                        ))}
                      </div>

                      {/* PIN if exists */}
                      {grant.pinCode && (
                        <div className="p-3 bg-purple-50 rounded-lg mb-4">
                          <p className="text-xs text-purple-600 mb-1">PIN kod:</p>
                          <p className="font-mono font-bold text-xl text-purple-700">
                            {grant.pinCode}
                          </p>
                        </div>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>do {formatDateTime(grant.endTime)}</span>
                      </div>

                      {/* Uses */}
                      {grant.maxUses && (
                        <p className="text-sm text-gray-500 mb-4">
                          Korišćenja: {grant.useCount}/{grant.maxUses}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCopyLink(link)}
                        >
                          <Copy className="w-4 h-4" />
                          Kopiraj link
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRevokingId(grant.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Past Grants */}
        {pastGrants.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Prošli pristupi</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {pastGrants.slice(0, 5).map((grant) => (
                    <div key={grant.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-gray-900">{grant.guestName || 'Gost'}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(grant.endTime)}</p>
                      </div>
                      <Badge variant={grant.status === 'EXPIRED' ? 'default' : 'warning'}>
                        {grant.status === 'EXPIRED' ? 'Istekao' : 'Opozvan'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Access Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Novi pristup za gosta"
          size="lg"
        >
          <form onSubmit={handleCreateAccess} className="space-y-4">
            <Select
              label="Parking mesto"
              name="parkingSpotId"
              value={form.parkingSpotId}
              onChange={handleChange}
              options={spotOptions}
              placeholder="Izaberite mesto"
              error={formErrors.parkingSpotId}
            />

            <Input
              label="Ime gosta (opciono)"
              name="guestName"
              placeholder="Ime i prezime"
              value={form.guestName}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Telefon (opciono)"
                name="guestPhone"
                placeholder="+381 64 123 4567"
                value={form.guestPhone}
                onChange={handleChange}
              />
              <Input
                label="Tablice (opciono)"
                name="guestLicensePlate"
                placeholder="BG-123-AB"
                value={form.guestLicensePlate}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Početak"
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={handleChange}
                error={formErrors.startTime}
              />
              <Input
                label="Kraj"
                name="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={handleChange}
                error={formErrors.endTime}
              />
            </div>

            <Input
              label="Max korišćenja (opciono)"
              name="maxUses"
              type="number"
              min={1}
              placeholder="Neograničeno"
              value={form.maxUses}
              onChange={handleChange}
            />

            {/* Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode pristupa
              </label>
              <div className="flex flex-wrap gap-2">
                {(['LINK', 'PIN', 'PHONE', 'LICENSE_PLATE'] as AccessMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleMethod(method)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${
                      form.methods.includes(method)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {getAccessMethodName(method)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate PIN checkbox */}
            {form.methods.includes('PIN') && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="generatePin"
                  checked={form.generatePin}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Automatski generiši PIN kod</span>
              </label>
            )}

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Otkaži
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Kreiraj pristup
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Result Modal */}
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Pristup kreiran!"
        >
          {newGrant && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">Uspešno!</p>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link za gosta:
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={newGrant.link}
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleCopyLink(newGrant.link)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* PIN */}
              {newGrant.grant.pinCode && (
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-purple-600 mb-1">PIN kod:</p>
                  <p className="font-mono font-bold text-3xl text-purple-700">
                    {newGrant.grant.pinCode}
                  </p>
                </div>
              )}

              <ModalFooter>
                <Button onClick={() => setShowResultModal(false)}>
                  Zatvori
                </Button>
              </ModalFooter>
            </div>
          )}
        </Modal>

        {/* Revoke Confirmation Modal */}
        <Modal
          isOpen={!!revokingId}
          onClose={() => setRevokingId(null)}
          title="Opozovi pristup?"
          description="Gost više neće moći da koristi ovaj pristup."
        >
          <ModalFooter>
            <Button variant="secondary" onClick={() => setRevokingId(null)}>
              Otkaži
            </Button>
            <Button variant="danger" onClick={handleRevoke}>
              Opozovi
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </PageTransition>
  )
}
