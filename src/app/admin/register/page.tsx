'use client'

/**
 * ADMIN REGISTER (/admin/register)
 * =================================
 * 
 * Registracija novog administratora.
 * Zahteva ADMIN KOD za verifikaciju.
 * 
 * ADMIN KOD: INOVA2024
 * (U produkciji bi se ovo menjalo ili slalo emailom)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Mail, Lock, User, Phone, Key, ArrowLeft, Info } from 'lucide-react'

export default function AdminRegisterPage() {
  const router = useRouter()
  const { registerAdmin, isLoading } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.name) newErrors.name = 'Ime je obavezno'
    if (!form.email) newErrors.email = 'Email je obavezan'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Unesite validan email'
    if (!form.password) newErrors.password = 'Lozinka je obavezna'
    else if (form.password.length < 6) newErrors.password = 'Lozinka mora imati najmanje 6 karaktera'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Lozinke se ne poklapaju'
    if (!form.adminCode) newErrors.adminCode = 'Admin kod je obavezan'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const result = await registerAdmin(form)
    if (result.success) {
      showToast('success', 'Uspešna registracija! Dobrodošli.')
      router.push('/admin/dashboard')
    } else {
      showToast('error', result.error || 'Greška pri registraciji')
      if (result.error?.includes('kod')) {
        setErrors({ adminCode: result.error })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex flex-col">
      <header className="p-4">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Nazad na prijavu</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <Logo size="lg" linkTo="/" className="justify-center mb-6" />
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Nova registracija</h1>
              <p className="text-gray-500 text-center mb-8">Kreirajte administratorski nalog</p>

              {/* Info o admin kodu */}
              <div className="flex items-start gap-3 p-4 mb-6 bg-blue-50 border border-blue-100 rounded-xl">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    Za registraciju je potreban <strong>administratorski kod</strong> koji dobijate od Inova Tech tima.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Demo kod: INOVA2024</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Ime i prezime"
                  name="name"
                  placeholder="Petar Petrović"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  leftIcon={<User className="w-5 h-5" />}
                />
                
                <Input
                  label="Email adresa"
                  name="email"
                  type="email"
                  placeholder="admin@vašafirma.rs"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label="Telefon (opciono)"
                  name="phone"
                  type="tel"
                  placeholder="+381 64 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-5 h-5" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Lozinka"
                    name="password"
                    type="password"
                    placeholder="Min. 6 karaktera"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    leftIcon={<Lock className="w-5 h-5" />}
                  />
                  <Input
                    label="Potvrda lozinke"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ponovite lozinku"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    leftIcon={<Lock className="w-5 h-5" />}
                  />
                </div>

                <Input
                  label="Administratorski kod"
                  name="adminCode"
                  placeholder="Unesite kod"
                  value={form.adminCode}
                  onChange={handleChange}
                  error={errors.adminCode}
                  leftIcon={<Key className="w-5 h-5" />}
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading} adminTheme>
                  Registruj se
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Već imate nalog?{' '}
                  <Link href="/admin/login" className="text-primary-500 hover:text-primary-600 font-medium">
                    Prijavite se
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
