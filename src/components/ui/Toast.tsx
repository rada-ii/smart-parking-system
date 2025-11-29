'use client'

// ============================================
// TOAST - Notifikacije
// ============================================
//
// TIPOVI:
// - success: Zelena (uspeh)
// - error: Crvena (greška)
// - warning: Žuta (upozorenje)
// - info: Plava (informacija)
//
// FEATURES:
// - Animacija ulaska (slide + fade)
// - Automatski nestaje
// - Može se ručno zatvoriti
// - Prikazuje se u donjem desnom uglu
//
// KORISTI SE PREKO CONTEXT-A:
// const { showToast } = useToast()
// showToast('success', 'Sačuvano!')
// ============================================

import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, hideToast } = useToast()

  if (toasts.length === 0) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  
  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto',
            'animate-in slide-in-from-right-full fade-in duration-300',
            styles[toast.type]
          )}
          role="alert"
        >
          <span className={iconStyles[toast.type]}>
            {icons[toast.type]}
          </span>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-medium text-sm">{toast.title}</p>
            )}
            <p className={cn('text-sm', toast.title && 'mt-0.5 opacity-90')}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => hideToast(toast.id)}
            className="p-1 -m-1 rounded-lg opacity-60 hover:opacity-100 
                     hover:bg-black/5 transition-all"
            aria-label="Zatvori"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
