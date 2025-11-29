'use client'

/**
 * NOTIFICATION SETTINGS
 * ======================
 * 
 * Komponenta za podešavanje push notifikacija.
 * Koristi se u Settings stranici.
 */

import { useNotifications } from '@/contexts/NotificationContext'
import { Button } from '@/components/ui/Button'
import { Bell, BellOff, Check, X } from 'lucide-react'

export function NotificationSettings() {
  const { 
    permission, 
    isSupported, 
    requestPermission, 
    isEnabled, 
    setEnabled 
  } = useNotifications()

  if (!isSupported) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700">
            <BellOff className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Push notifikacije</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vaš browser ne podržava notifikacije
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40">
            <X className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Push notifikacije blokirane</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Omogućite notifikacije u podešavanjima browsera
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (permission !== 'granted') {
    return (
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Push notifikacije</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dobijajte obaveštenja kada gost otvori rampu
            </p>
          </div>
        </div>
        <Button onClick={requestPermission} size="sm">
          Omogući
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Push notifikacije omogućene</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dobićete obaveštenja o aktivnostima
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Notification types */}
      <div className="pl-4 space-y-2">
        <NotificationOption 
          label="Pristup gosta" 
          description="Kada gost otvori rampu"
          defaultChecked={true}
        />
        <NotificationOption 
          label="Istek pristupa" 
          description="Kada pristup uskoro ističe"
          defaultChecked={true}
        />
        <NotificationOption 
          label="Status uređaja" 
          description="Kada uređaj postane offline"
          defaultChecked={false}
        />
      </div>
    </div>
  )
}

interface NotificationOptionProps {
  label: string
  description: string
  defaultChecked?: boolean
}

function NotificationOption({ label, description, defaultChecked }: NotificationOptionProps) {
  return (
    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
      />
    </label>
  )
}
