'use client'

/**
 * USER SETTINGS (/settings)
 * =========================
 * 
 * Podešavanja korisničkog profila.
 * Uključuje: profil, lozinku, push notifikacije.
 */

import { useState } from 'react'
import { useGroupUser } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageTransition } from '@/components/ui/PageTransition'
import { NotificationSettings } from '@/components/ui/NotificationSettings'
import { User, Lock, Bell } from 'lucide-react'

export default function UserSettingsPage() {
  const groupUser = useGroupUser()
  const { showToast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: groupUser?.firstName || '',
    lastName: groupUser?.lastName || '',
    email: groupUser?.email || '',
    phone: groupUser?.phone || '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulacija - u produkciji bi bio API poziv
    await new Promise(r => setTimeout(r, 1000))
    setIsLoading(false)
    showToast('success', 'Profil sačuvan')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      showToast('error', 'Lozinke se ne poklapaju')
      return
    }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsLoading(false)
    setPasswords({ current: '', new: '', confirm: '' })
    showToast('success', 'Lozinka promenjena')
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Podešavanja</h1>
            <p className="section-description">Upravljanje nalogom</p>
          </div>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Profil</CardTitle>
                <CardDescription>Vaši lični podaci</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Ime"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
                <Input
                  label="Prezime"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled
                hint="Email se ne može promeniti"
              />
              <Input
                label="Telefon"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />
              <div className="pt-2">
                <Button type="submit" isLoading={isLoading}>
                  Sačuvaj izmene
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Lozinka</CardTitle>
                <CardDescription>Promenite lozinku</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Trenutna lozinka"
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
              />
              <Input
                label="Nova lozinka"
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
              <Input
                label="Potvrdite novu lozinku"
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
              <div className="pt-2">
                <Button type="submit" isLoading={isLoading}>
                  Promeni lozinku
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Notifikacije</CardTitle>
                <CardDescription>Podešavanja obaveštenja</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
