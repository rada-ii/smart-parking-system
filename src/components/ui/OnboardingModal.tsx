'use client'

/**
 * ONBOARDING MODAL
 * =================
 * 
 * Interaktivni tutorial sa slide-ovima.
 * Prikazuje se prvi put kada se korisnik uloguje.
 * Može se ponovo pokrenuti iz sidebar-a (Pomoć).
 */

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Button } from '@/components/ui/Button'
import { 
  Car, 
  Users, 
  Key, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  Shield,
  MapPin,
  Clock,
  Check
} from 'lucide-react'

interface OnboardingSlide {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const ADMIN_SLIDES: OnboardingSlide[] = [
  {
    icon: <Shield className="w-16 h-16" />,
    title: 'Dobrodošli u Admin Panel',
    description: 'Ovde upravljate celim parking sistemom. Dodajte uređaje, kreirajte grupe korisnika i pratite sve aktivnosti.',
    color: 'bg-primary-500'
  },
  {
    icon: <Smartphone className="w-16 h-16" />,
    title: 'Dodajte uređaje',
    description: 'U sekciji "Uređaji" dodajte serijske brojeve vaših rampi i kapija. Svaki uređaj možete testirati pre korišćenja.',
    color: 'bg-blue-500'
  },
  {
    icon: <Users className="w-16 h-16" />,
    title: 'Kreirajte grupe',
    description: 'Grupe predstavljaju porodice ili firme. Svakoj grupi dodelite uređaj i broj parking mesta, zatim dodajte korisnike.',
    color: 'bg-green-500'
  },
  {
    icon: <Bell className="w-16 h-16" />,
    title: 'Pratite aktivnosti',
    description: 'U sekciji "Logovi" vidite sve aktivnosti - ko je otvorio rampu, kada i da li je bilo uspešno.',
    color: 'bg-purple-500'
  }
]

const USER_SLIDES: OnboardingSlide[] = [
  {
    icon: <Car className="w-16 h-16" />,
    title: 'Dobrodošli!',
    description: 'Ovde upravljate vašim parking mestima, vozilima i pristupom za goste. Hajde da vam pokažemo kako.',
    color: 'bg-blue-500'
  },
  {
    icon: <MapPin className="w-16 h-16" />,
    title: 'Vaša parking mesta',
    description: 'U sekciji "Parking" vidite sva vaša mesta i koja su trenutno slobodna ili zauzeta.',
    color: 'bg-green-500'
  },
  {
    icon: <Car className="w-16 h-16" />,
    title: 'Registrujte vozila',
    description: 'Dodajte tablice vaših vozila u sekciji "Vozila". Sistem će automatski prepoznati vaše vozilo.',
    color: 'bg-purple-500'
  },
  {
    icon: <Key className="w-16 h-16" />,
    title: 'Pozovite goste',
    description: 'U sekciji "Pristupi" kreirajte link ili PIN kod za goste. Možete ograničiti vreme i broj korišćenja.',
    color: 'bg-primary-500'
  },
  {
    icon: <Clock className="w-16 h-16" />,
    title: 'Pratite istoriju',
    description: 'U "Istoriji" vidite sve aktivnosti - kada je ko otvorio rampu i sa kog parking mesta.',
    color: 'bg-cyan-500'
  }
]

interface OnboardingModalProps {
  type: 'admin' | 'user'
}

export function OnboardingModal({ type }: OnboardingModalProps) {
  const { showOnboarding, completeOnboarding } = useOnboarding()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = type === 'admin' ? ADMIN_SLIDES : USER_SLIDES
  const totalSlides = slides.length
  const isLastSlide = currentSlide === totalSlides - 1

  if (!showOnboarding) return null

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding()
    } else {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const slide = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header sa bojom */}
        <div className={`${slide.color} p-8 text-white text-center transition-colors duration-300`}>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4">
            {slide.icon}
          </div>
          <h2 className="text-2xl font-bold">{slide.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">
            {slide.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'bg-primary-500 w-8' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
            >
              Preskoči
            </button>

            <div className="flex gap-2">
              {currentSlide > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="!px-3"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              
              <Button onClick={handleNext}>
                {isLastSlide ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Počnimo!
                  </>
                ) : (
                  <>
                    Dalje
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
