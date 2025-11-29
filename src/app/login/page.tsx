'use client'

/**
 * USER LOGIN (/login)
 * ===================
 * 
 * Prijava za korisnike (članove grupa).
 * 
 * DEMO PRISTUP:
 * Email: marko@example.com
 * Password: marko123
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
import { Mail, Lock, Users, ArrowLeft, Info } from 'lucide-react'

export default function UserLoginPage() {
  const router = useRouter()
  const { loginUser, isLoading } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = 'Email je obavezan'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Unesite validan email'
    if (!form.password) newErrors.password = 'Lozinka je obavezna'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const result = await loginUser(form)
    if (result.success) {
      showToast('success', 'Dobrodošli!')
      router.push('/dashboard')
    } else {
      showToast('error', result.error || 'Greška pri prijavi')
      setErrors({ password: result.error || 'Pogrešan email ili lozinka' })
    }
  }

  const fillDemo = () => {
    setForm({ email: 'marko@example.com', password: 'marko123' })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col">
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Nazad</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <Logo size="lg" linkTo="/" className="justify-center mb-6" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Users className="w-4 h-4" />
              Korisnik
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Prijava</h1>
              <p className="text-gray-500 text-center mb-8">Pristupite svom parkingu</p>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full flex items-center gap-3 p-4 mb-6 bg-blue-50 border border-blue-100 rounded-xl text-left hover:bg-blue-100 transition-colors"
              >
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Demo pristup</p>
                  <p className="text-xs text-blue-600">Klikni da popuniš demo kredencijale</p>
                </div>
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email adresa"
                  name="email"
                  type="email"
                  placeholder="vas@email.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Lozinka"
                  name="password"
                  type="password"
                  placeholder="Unesite lozinku"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Prijavi se
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Administrator?{' '}
                  <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Admin prijava
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-400 mt-8">&copy; {new Date().getFullYear()} Inova Tech</p>
        </div>
      </main>
    </div>
  )
}
