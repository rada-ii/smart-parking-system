'use client'

/**
 * ADMIN DASHBOARD (/admin/dashboard)
 * ===================================
 * 
 * Glavna stranica za administratore.
 * 
 * PRIKAZUJE:
 * - Statistike (uređaji, grupe, korisnici, pristupi)
 * - Poslednje aktivnosti
 * - Brze akcije (dodaj uređaj, kreiraj grupu)
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { statsApi, logsApi } from '@/lib/mock-api'
import { ActivityLog } from '@/lib/types'
import { formatDateTime, getLogActionName } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  Server, 
  Users, 
  UserCheck, 
  Activity,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalDevices: number
    onlineDevices: number
    totalGroups: number
    totalUsers: number
    todayAccesses: number
  } | null>(null)
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          statsApi.getAdminStats(),
          logsApi.getAll(),
        ])
        
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data)
        }
        if (logsRes.success && logsRes.data) {
          setRecentLogs(logsRes.data.slice(0, 5))
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (isLoading) {
    return <PageLoader message="Učitavanje podataka..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Dobrodošli nazad</h1>
            <p className="section-description">Pregled sistema i aktivnosti</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/devices">
              <Button variant="outline" adminTheme>
                <Plus className="w-4 h-4" />
                Novi uređaj
              </Button>
            </Link>
            <Link href="/admin/groups">
              <Button adminTheme>
                <Plus className="w-4 h-4" />
                Nova grupa
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <StatCard
            icon={<Server className="w-6 h-6" />}
            value={stats?.onlineDevices || 0}
            label={`od ${stats?.totalDevices || 0} uređaja online`}
            iconColor="bg-green-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value={stats?.totalGroups || 0}
            label="Aktivnih grupa"
            iconColor="bg-blue-500"
          />
          <StatCard
            icon={<UserCheck className="w-6 h-6" />}
            value={stats?.totalUsers || 0}
            label="Registrovanih korisnika"
            iconColor="bg-purple-500"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            value={stats?.todayAccesses || 0}
            label="Pristupa danas"
            iconColor="bg-primary-500"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Poslednje aktivnosti</CardTitle>
                <Link href="/admin/logs">
                  <Button variant="ghost" size="sm">
                    Prikaži sve
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nema aktivnosti</p>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${log.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        {log.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {getLogActionName(log.action)}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {log.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Brze akcije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/devices" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dodaj uređaj</p>
                      <p className="text-sm text-gray-500">Registruj novu rampu</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/groups" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Kreiraj grupu</p>
                      <p className="text-sm text-gray-500">Nova porodica/firma</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/logs" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Svi logovi</p>
                      <p className="text-sm text-gray-500">Pregled aktivnosti</p>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium text-green-700">API Server</p>
                  <p className="text-sm text-green-600">Operativan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium text-green-700">Baza podataka</p>
                  <p className="text-sm text-green-600">Operativna</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div>
                  <p className="font-medium text-yellow-700">TCP Gateway</p>
                  <p className="text-sm text-yellow-600">Demo režim</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
