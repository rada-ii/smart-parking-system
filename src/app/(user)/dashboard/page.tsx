'use client'

/**
 * USER DASHBOARD (/dashboard)
 * ===========================
 * 
 * Glavna stranica za korisnike.
 * 
 * PRIKAZUJE:
 * - Statistike (parking mesta, vozila, aktivni pristupi)
 * - Brze akcije
 * - Poslednje aktivnosti
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { statsApi, logsApi, grantsApi } from '@/lib/mock-api'
import { useGroupUser } from '@/contexts/AuthContext'
import { ActivityLog, AccessGrant } from '@/lib/types'
import { formatDateTime, getLogActionName } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  ParkingCircle, 
  Car, 
  Key,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function UserDashboardPage() {
  const groupUser = useGroupUser()
  const [stats, setStats] = useState<{
    totalSpots: number
    occupiedSpots: number
    totalVehicles: number
    activeGrants: number
    todayAccesses: number
  } | null>(null)
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([])
  const [activeGrants, setActiveGrants] = useState<AccessGrant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!groupUser?.groupId) return

    const fetchData = async () => {
      try {
        const [statsRes, logsRes, grantsRes] = await Promise.all([
          statsApi.getUserStats(groupUser.groupId),
          logsApi.getAll({ groupId: groupUser.groupId }),
          grantsApi.getByGroup(groupUser.groupId),
        ])
        
        if (statsRes.success && statsRes.data) setStats(statsRes.data)
        if (logsRes.success && logsRes.data) setRecentLogs(logsRes.data.slice(0, 5))
        if (grantsRes.success && grantsRes.data) {
          setActiveGrants(grantsRes.data.filter(g => g.status === 'ACTIVE').slice(0, 3))
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [groupUser?.groupId])

  if (isLoading || !groupUser) {
    return <PageLoader message="Učitavanje..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Dobrodošli, {groupUser.firstName}!</h1>
            <p className="section-description">Pregled vašeg parkinga</p>
          </div>
          <Link href="/access">
            <Button>
              <Plus className="w-4 h-4" />
              Pozovi gosta
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <StatCard
            icon={<ParkingCircle className="w-6 h-6" />}
            value={`${stats?.occupiedSpots || 0}/${stats?.totalSpots || 0}`}
            label="Zauzetih mesta"
            iconColor="bg-blue-500"
          />
          <StatCard
            icon={<Car className="w-6 h-6" />}
            value={stats?.totalVehicles || 0}
            label="Registrovanih vozila"
            iconColor="bg-green-500"
          />
          <StatCard
            icon={<Key className="w-6 h-6" />}
            value={stats?.activeGrants || 0}
            label="Aktivnih pristupa"
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
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Brze akcije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/vehicles" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dodaj vozilo</p>
                      <p className="text-sm text-gray-500">Registruj tablice</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/access" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pozovi gosta</p>
                      <p className="text-sm text-gray-500">Generiši pristup</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/history" className="block">
                <div className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Istorija</p>
                      <p className="text-sm text-gray-500">Pregled aktivnosti</p>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Active Grants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Aktivni pristupi</CardTitle>
                <Link href="/access">
                  <Button variant="ghost" size="sm">
                    Prikaži sve
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeGrants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nema aktivnih pristupa</p>
              ) : (
                <div className="space-y-3">
                  {activeGrants.map((grant) => (
                    <div 
                      key={grant.id}
                      className="p-3 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{grant.guestName || 'Gost'}</p>
                        <Badge variant="success" dot>Aktivan</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>do {formatDateTime(grant.endTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Poslednje aktivnosti</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    Prikaži sve
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nema aktivnosti</p>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-start gap-3"
                    >
                      <div className={`p-1.5 rounded-lg ${
                        log.success ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${
                          log.success ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getLogActionName(log.action)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
