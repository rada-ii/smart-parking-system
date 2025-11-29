'use client'

/**
 * LANDING PAGE (/)
 * =================
 * 
 * Početna stranica aplikacije.
 * Prikazuje dve opcije:
 * 1. Admin prijava - za administratore sistema
 * 2. Korisnik prijava - za članove grupa (stanare)
 * 
 * Ako je korisnik već ulogovan, redirect na odgovarajući dashboard.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/layout/Logo'
import { Shield, Users, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, role, isLoading } = useAuth()

  // Redirect ako je već ulogovan
  useEffect(() => {
    if (!isLoading && user) {
      if (role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, role, isLoading, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Ako je ulogovan, ne prikazuj ništa (redirect će se desiti)
  if (user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" linkTo="/" />
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Prijava
              </Link>
              <Link 
                href="/admin/login"
                className="text-sm px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            Pametan parking sistem
          </div>

          {/* Naslov */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Kontrola pristupa{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              parkingu
            </span>
          </h1>

          {/* Opis */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Registrujte vozila, upravljajte pristupom za goste i pratite 
            sve aktivnosti na parkingu u realnom vremenu.
          </p>

          {/* Opcije prijave */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Admin */}
            <Link 
              href="/admin/login"
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary-500 transition-all duration-300 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Administrator
              </h2>
              <p className="text-gray-500 mb-6">
                Upravljanje uređajima, grupama korisnika i pregled svih aktivnosti.
              </p>
              <div className="flex items-center text-primary-500 font-medium group-hover:gap-3 transition-all">
                <span>Admin prijava</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>

            {/* Korisnik */}
            <Link 
              href="/login"
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Korisnik
              </h2>
              <p className="text-gray-500 mb-6">
                Upravljanje vozilima, parking mestima i pristupom za goste.
              </p>
              <div className="flex items-center text-blue-500 font-medium group-hover:gap-3 transition-all">
                <span>Korisnik prijava</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-24">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Registracija vozila',
                description: 'Dodajte tablice svojih vozila za automatski pristup parkingu.',
              },
              {
                title: 'Pristup za goste',
                description: 'Generišite PIN ili link za goste sa vremenskim ograničenjem.',
              },
              {
                title: 'Praćenje aktivnosti',
                description: 'Vidite ko je i kada pristupio parkingu u realnom vremenu.',
              },
            ].map((feature, idx) => (
              <div 
                key={feature.title}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${400 + idx * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Logo size="sm" linkTo="/" className="justify-center mb-4" />
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Inova Tech. Sva prava zadržana.
          </p>
        </div>
      </footer>
    </div>
  )
}
