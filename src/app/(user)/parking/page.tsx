'use client'

/**
 * USER PARKING (/parking)
 * =======================
 * 
 * Pregled parking mesta grupe.
 * Prikazuje vizuelnu mapu parkinga sa statusom: slobodno/zauzeto.
 */

import { useEffect, useState } from 'react'
import { spotsApi, vehiclesApi } from '@/lib/mock-api'
import { useGroupUser } from '@/contexts/AuthContext'
import { ParkingSpot, Vehicle } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/Spinner'
import { ParkingMap } from '@/components/ui/ParkingMap'
import { ParkingCircle, Car, CheckCircle, MapPin } from 'lucide-react'

type SpotWithVehicle = ParkingSpot & { vehicle?: Vehicle }

export default function UserParkingPage() {
  const groupUser = useGroupUser()
  const [spots, setSpots] = useState<SpotWithVehicle[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)

  useEffect(() => {
    if (!groupUser?.groupId) return

    const fetchData = async () => {
      const [spotsRes, vehiclesRes] = await Promise.all([
        spotsApi.getByGroup(groupUser.groupId),
        vehiclesApi.getByGroup(groupUser.groupId)
      ])
      
      if (spotsRes.success && spotsRes.data) {
        setSpots(spotsRes.data)
      }
      if (vehiclesRes.success && vehiclesRes.data) {
        setVehicles(vehiclesRes.data)
      }
      setIsLoading(false)
    }
    
    fetchData()
  }, [groupUser?.groupId])

  if (isLoading || !groupUser) {
    return <PageLoader message="Učitavanje parking mesta..." />
  }

  const freeSpots = spots.filter(s => !s.isOccupied).length

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot === selectedSpot ? null : spot)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Parking mesta</h1>
            <p className="section-description">
              {freeSpots} od {spots.length} mesta slobodno
            </p>
          </div>
        </div>

        {spots.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={<ParkingCircle className="w-8 h-8" />}
                title="Nema parking mesta"
                description="Kontaktirajte administratora za dodavanje parking mesta"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Parking Map - Vizuelna mapa */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <CardTitle>Mapa parkinga</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ParkingMap 
                    spots={spots} 
                    vehicles={vehicles}
                    onSpotClick={handleSpotClick}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Detalji o izabranom mestu */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {selectedSpot ? `Mesto ${selectedSpot.spotNumber}` : 'Izaberite mesto'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSpot ? (
                    <div className="space-y-4">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge variant={selectedSpot.isOccupied ? 'info' : 'success'}>
                          {selectedSpot.isOccupied ? 'Zauzeto' : 'Slobodno'}
                        </Badge>
                      </div>

                      {/* Description */}
                      {selectedSpot.description && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Opis:</span>
                          <p className="text-gray-900 dark:text-white mt-1">{selectedSpot.description}</p>
                        </div>
                      )}

                      {/* Vehicle Info */}
                      {selectedSpot.isOccupied && selectedSpot.currentVehicleId && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Trenutno vozilo:</span>
                          {(() => {
                            const vehicle = vehicles.find(v => v.id === selectedSpot.currentVehicleId)
                            if (!vehicle) return <p className="text-gray-900 dark:text-white">Nepoznato</p>
                            return (
                              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <Car className="w-8 h-8 text-blue-500" />
                                  <div>
                                    <p className="font-mono font-bold text-gray-900 dark:text-white">
                                      {vehicle.licensePlate}
                                    </p>
                                    {vehicle.brand && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {vehicle.brand} {vehicle.model}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <ParkingCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Kliknite na parking mesto na mapi da vidite detalje</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
