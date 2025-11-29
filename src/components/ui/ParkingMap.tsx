"use client";

/**
 * PARKING MAP
 * ============
 *
 * Vizuelna 2D mapa parking mesta.
 * Prikazuje parking mesta kao grid sa ptičje perspektive.
 *
 * FEATURES:
 * - Dinamičan grid baziran na broju mesta
 * - Hover efekat sa detaljima
 * - Klik za akcije
 * - Animacije
 */

import { useState } from "react";
import { ParkingSpot, Vehicle } from "@/lib/types";
import { Car, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParkingMapProps {
  spots: ParkingSpot[];
  vehicles: Vehicle[];
  onSpotClick?: (spot: ParkingSpot) => void;
  className?: string;
}

export function ParkingMap({
  spots,
  vehicles,
  onSpotClick,
  className,
}: ParkingMapProps) {
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);

  // Izračunaj optimalan grid layout
  const totalSpots = spots.length;
  const columns = totalSpots <= 4 ? 2 : totalSpots <= 6 ? 3 : 4;

  // Pronađi vozilo za dato mesto
  const getVehicleForSpot = (spot: ParkingSpot): Vehicle | undefined => {
    if (!spot.currentVehicleId) return undefined;
    return vehicles.find((v) => v.id === spot.currentVehicleId);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Parking lot background */}
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 relative overflow-hidden">
        {/* Road markings - dekorativne linije */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-1/2 w-1 h-full bg-yellow-500 -translate-x-1/2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 20px, currentColor 20px, currentColor 40px)",
            }}
          />
        </div>

        {/* Parking spots grid */}
        <div
          className="grid gap-4 relative z-10 pt-12"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {spots.map((spot, index) => {
            const vehicle = getVehicleForSpot(spot);
            const isOccupied = spot.isOccupied;
            const isHovered = hoveredSpot === spot.id;

            return (
              <div
                key={spot.id}
                className="relative"
                onMouseEnter={() => setHoveredSpot(spot.id)}
                onMouseLeave={() => setHoveredSpot(null)}
              >
                {/* Parking spot */}
                <button
                  onClick={() => onSpotClick?.(spot)}
                  className={cn(
                    "relative w-full aspect-[3/4] rounded-lg border-2 border-dashed transition-all duration-300",
                    "flex flex-col items-center justify-center gap-2 p-3",
                    isOccupied
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600"
                      : "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600",
                    isHovered && "transform scale-105 shadow-lg",
                    onSpotClick && "cursor-pointer hover:shadow-xl"
                  )}
                >
                  {/* Spot number */}
                  <div
                    className={cn(
                      "absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                      isOccupied
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    )}
                  >
                    {spot.spotNumber}
                  </div>

                  {/* Car icon or empty */}
                  {isOccupied ? (
                    <div className="flex flex-col items-center animate-fade-in">
                      <Car
                        className={cn(
                          "w-12 h-12 transition-transform duration-300",
                          isHovered
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-blue-500 dark:text-blue-400"
                        )}
                      />
                      {vehicle && (
                        <span className="mt-1 text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
                          {vehicle.licensePlate}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-green-600 dark:text-green-400">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center transition-all duration-300",
                          isHovered && "border-solid bg-green-500 text-white"
                        )}
                      >
                        <span className="text-2xl font-light">P</span>
                      </div>
                      <span className="mt-1 text-xs font-medium">Slobodno</span>
                    </div>
                  )}
                </button>

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 animate-fade-in">
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap">
                      <p className="font-semibold">Mesto {spot.spotNumber}</p>
                      {isOccupied && vehicle ? (
                        <div className="flex items-center gap-2 mt-1 text-gray-300 dark:text-gray-600">
                          <Car className="w-3 h-3" />
                          <span>
                            {vehicle.brand} {vehicle.model}
                          </span>
                        </div>
                      ) : (
                        <p className="text-green-400 dark:text-green-600">
                          Slobodno za parkiranje
                        </p>
                      )}
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-600 dark:text-gray-300">Slobodno</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Zauzeto</span>
          </div>
        </div>
      </div>

      {/* Stats below map */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {spots.filter((s) => !s.isOccupied).length}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Slobodnih mesta
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {spots.filter((s) => s.isOccupied).length}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Zauzetih mesta
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * MINI PARKING MAP
 * =================
 *
 * Manja verzija mape za dashboard i sidebar.
 */
interface MiniParkingMapProps {
  spots: ParkingSpot[];
  className?: string;
}

export function MiniParkingMap({ spots, className }: MiniParkingMapProps) {
  const columns = Math.min(spots.length, 5);

  return (
    <div
      className={cn("bg-gray-100 dark:bg-gray-800 rounded-xl p-3", className)}
    >
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {spots.map((spot) => (
          <div
            key={spot.id}
            className={cn(
              "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-colors",
              spot.isOccupied
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            )}
            title={`Mesto ${spot.spotNumber}: ${
              spot.isOccupied ? "Zauzeto" : "Slobodno"
            }`}
          >
            {spot.spotNumber}
          </div>
        ))}
      </div>
    </div>
  );
}
