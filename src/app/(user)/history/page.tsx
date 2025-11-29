'use client'

/**
 * USER HISTORY (/history)
 * =======================
 * 
 * Istorija aktivnosti korisnika na parkingu.
 */

import { useEffect, useState } from 'react'
import { logsApi } from '@/lib/mock-api'
import { useGroupUser } from '@/contexts/AuthContext'
import { ActivityLog } from '@/lib/types'
import { formatDateTime, getLogActionName } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function UserHistoryPage() {
  const groupUser = useGroupUser()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!groupUser?.groupId) return

    const fetchLogs = async () => {
      const response = await logsApi.getAll({ groupId: groupUser.groupId })
      if (response.success && response.data) {
        setLogs(response.data)
      }
      setIsLoading(false)
    }
    
    fetchLogs()
  }, [groupUser?.groupId])

  if (isLoading || !groupUser) {
    return <PageLoader message="Učitavanje istorije..." />
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Istorija</h1>
            <p className="section-description">Pregled svih aktivnosti</p>
          </div>
        </div>

        {/* Logs */}
        <Card>
          <CardContent className="p-0">
            {logs.length === 0 ? (
              <EmptyState
                icon={<Activity className="w-8 h-8" />}
                title="Nema aktivnosti"
                description="Aktivnosti će se pojaviti ovde"
                className="py-12"
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {logs.map((log, idx) => (
                  <div 
                    key={log.id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className={`p-2 rounded-lg ${
                      log.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
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
                    <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
                      <Clock className="w-4 h-4" />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
