'use client'

/**
 * GUEST UNLOCK PAGE (/g/[token])
 * ==============================
 * 
 * Stranica koju gost otvara da bi otvorio rampu.
 * 
 * FLOW:
 * 1. Gost otvara link (npr. /g/abc123xyz)
 * 2. Validacija tokena i pristupa
 * 3. Prikazuje veliko dugme za otvaranje
 * 4. Ako je PIN potreban - unos PIN-a
 * 5. Animacija success/error
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { grantsApi, unlockApi } from '@/lib/mock-api'
import { AccessGrant, Group, ParkingSpot } from '@/lib/types'
import { formatDateTime, getAccessMethodName } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Unlock, 
  Lock, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  XCircle,
  KeyRound
} from 'lucide-react'

type GrantWithDetails = AccessGrant & { group: Group; spot: ParkingSpot }

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'success' | 'error'

export default function GuestUnlockPage() {
  const params = useParams()
  const token = params.token as string

  const [state, setState] = useState<PageState>('loading')
  const [grant, setGrant] = useState<GrantWithDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  
  // PIN input
  const [showPinInput, setShowPinInput] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  // Fetch grant data
  useEffect(() => {
    const fetchGrant = async () => {
      const response = await grantsApi.getByToken(token)
      
      if (!response.success || !response.data) {
        setState('invalid')
        setErrorMessage(response.error || 'Nevažeći link')
        return
      }

      const grantData = response.data
      setGrant(grantData)

      // Validate
      const now = new Date()
      const startTime = new Date(grantData.startTime)
      const endTime = new Date(grantData.endTime)

      if (grantData.status !== 'ACTIVE') {
        setState('expired')
        setErrorMessage('Pristup je istekao ili je opozvan')
        return
      }

      if (now < startTime) {
        setState('invalid')
        setErrorMessage(`Pristup počinje ${formatDateTime(startTime)}`)
        return
      }

      if (now > endTime) {
        setState('expired')
        setErrorMessage('Vreme pristupa je isteklo')
        return
      }

      if (grantData.maxUses && grantData.useCount >= grantData.maxUses) {
        setState('expired')
        setErrorMessage('Iskorišćen maksimalan broj pristupa')
        return
      }

      setState('valid')
    }

    fetchGrant()
  }, [token])

  // Handle unlock
  const handleUnlock = async () => {
    if (!grant) return

    // Check if PIN is required
    if (grant.accessMethods.includes('PIN') && grant.pinCode && !showPinInput) {
      setShowPinInput(true)
      return
    }

    // Validate PIN if needed
    if (showPinInput && grant.pinCode) {
      if (pin !== grant.pinCode) {
        setPinError('Pogrešan PIN kod')
        return
      }
    }

    setIsUnlocking(true)
    setPinError('')

    const response = await unlockApi.unlock(
      token, 
      showPinInput ? 'PIN' : 'LINK',
      showPinInput ? pin : undefined
    )

    setIsUnlocking(false)

    if (response.success) {
      setState('success')
      // Auto reset after 5 seconds
      setTimeout(() => {
        setState('valid')
        setShowPinInput(false)
        setPin('')
        // Refresh grant data
        grantsApi.getByToken(token).then(res => {
          if (res.success && res.data) setGrant(res.data)
        })
      }, 5000)
    } else {
      setState('error')
      setErrorMessage(response.error || 'Greška pri otključavanju')
      // Auto reset after 4 seconds
      setTimeout(() => {
        setState('valid')
      }, 4000)
    }
  }

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Učitavanje...</p>
        </div>
      </div>
    )
  }

  // Invalid/Expired state
  if (state === 'invalid' || state === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4">
          <Logo size="md" linkTo="/" className="justify-center" />
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-sm animate-scale-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {state === 'invalid' ? 'Nevažeći pristup' : 'Pristup istekao'}
            </h1>
            <p className="text-gray-500">{errorMessage}</p>
          </div>
        </main>
      </div>
    )
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
        <header className="p-4">
          <Logo size="md" linkTo="/" className="justify-center" />
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center animate-scale-in">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-glow">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Otvoreno!
            </h1>
            <p className="text-green-600">Rampa se otvara...</p>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
        <header className="p-4">
          <Logo size="md" linkTo="/" className="justify-center" />
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center animate-shake">
            <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-red-700 mb-2">
              Greška
            </h1>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        </main>
      </div>
    )
  }

  // Valid state - show unlock button
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <Logo size="md" linkTo="/" className="justify-center" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6 animate-slide-up">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Dobrodošli!
            </h1>
            {grant?.guestName && (
              <p className="text-gray-600">{grant.guestName}</p>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lokacija</p>
                <p className="font-medium text-gray-900">{grant?.group.name}</p>
              </div>
            </div>

            {/* Parking Spot */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 text-green-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Parking mesto</p>
                <p className="font-medium text-gray-900">{grant?.spot.spotNumber}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Važi do</p>
                <p className="font-medium text-gray-900">
                  {grant && formatDateTime(grant.endTime)}
                </p>
              </div>
            </div>

            {/* Uses left */}
            {grant?.maxUses && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  Preostalo korišćenja: {grant.maxUses - grant.useCount} od {grant.maxUses}
                </p>
              </div>
            )}
          </div>

          {/* PIN Input */}
          {showPinInput && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary-100 text-primary-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Unesite PIN kod</p>
                  <p className="text-sm text-gray-500">4-cifreni kod</p>
                </div>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="****"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''))
                  setPinError('')
                }}
                error={pinError}
                className="text-center text-2xl font-mono tracking-widest"
              />
            </div>
          )}

          {/* Unlock Button */}
          <button
            onClick={handleUnlock}
            disabled={isUnlocking}
            className={`
              w-full aspect-square max-w-xs mx-auto rounded-full 
              flex flex-col items-center justify-center gap-2
              text-white font-bold text-xl
              transition-all duration-300 transform
              ${isUnlocking 
                ? 'bg-gray-400 scale-95' 
                : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-glow'
              }
            `}
          >
            {isUnlocking ? (
              <>
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-lg">Otvaranje...</span>
              </>
            ) : (
              <>
                <Unlock className="w-16 h-16" />
                <span className="text-2xl">{showPinInput ? 'POTVRDI' : 'OTVORI'}</span>
              </>
            )}
          </button>

          {/* Methods info */}
          <div className="flex justify-center gap-2">
            {grant?.accessMethods.map(method => (
              <Badge key={method} variant="default">
                {getAccessMethodName(method)}
              </Badge>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-sm text-gray-400">
          Powered by Inova Tech
        </p>
      </footer>
    </div>
  )
}
