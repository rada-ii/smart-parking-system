'use client'

/**
 * ADMIN LOGS (/admin/logs)
 * ========================
 * 
 * Pregled svih aktivnosti u sistemu.
 * 
 * PRIKAZUJE:
 * - Tabela svih logova
 * - Filteri: svi/uspešni/neuspešni
 * - Detalji: vreme, akcija, poruka, status
 */

import { useEffect, useState } from 'react'
import { logsApi } from '@/lib/mock-api'
import { ActivityLog } from '@/lib/types'
import { formatDateTime, getLogActionName } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'

type FilterType = 'all' | 'success' | 'failed'

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  // Fetch logs
  const fetchLogs = async () => {
    setIsLoading(true)
    const response = await logsApi.getAll()
    if (response.success && response.data) {
      setLogs(response.data)
      setFilteredLogs(response.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Apply filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredLogs(logs)
    } else if (filter === 'success') {
      setFilteredLogs(logs.filter(l => l.success))
    } else {
      setFilteredLogs(logs.filter(l => !l.success))
    }
  }, [filter, logs])

  // Stats
  const successCount = logs.filter(l => l.success).length
  const failedCount = logs.filter(l => !l.success).length

  if (isLoading) {
    return <PageLoader message="Učitavanje logova..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Aktivnosti</h1>
            <p className="section-description">Istorija svih događaja u sistemu</p>
          </div>
          <Button variant="secondary" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4" />
            Osveži
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'all' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            <p className="text-sm text-gray-500">Ukupno</p>
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'success' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="text-2xl font-bold text-green-600">{successCount}</p>
            <p className="text-sm text-gray-500">Uspešnih</p>
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'failed' 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
            <p className="text-sm text-gray-500">Neuspešnih</p>
          </button>
        </div>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            {filteredLogs.length === 0 ? (
              <EmptyState
                icon={<Activity className="w-8 h-8" />}
                title="Nema aktivnosti"
                description={filter !== 'all' ? 'Nema rezultata sa ovim filterom' : 'Još uvek nema zabeleženih aktivnosti'}
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcija
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poruka
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vreme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.map((log, idx) => (
                      <tr 
                        key={log.id} 
                        className="hover:bg-gray-50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.success ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-green-100">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <Badge variant="success">Uspešno</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-red-100">
                                <XCircle className="w-4 h-4 text-red-600" />
                              </div>
                              <Badge variant="error">Neuspešno</Badge>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {getLogActionName(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">
                            {log.message}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {formatDateTime(log.timestamp)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
