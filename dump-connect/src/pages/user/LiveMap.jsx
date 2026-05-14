import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'
import MapView from '../../components/MapView'
import { jitterMove } from '../../services/simulateTrucks'
import { getUserLocation, watchUserLocation, haversineDistanceKm } from '../../utils/geo'
import { MapPin, Truck, Activity, Navigation } from 'lucide-react'

export default function LiveMap(){
  const trucks = useStore(s => s.trucks)
  const updateTruckPosition = useStore(s => s.updateTruckPosition)
  
  const [userLocation, setUserLocation] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [nearbyTrucks, setNearbyTrucks] = useState([])

  // Real-time location tracking
  useEffect(() => {
    getUserLocation().then(({ location, accuracy: acc }) => {
      setUserLocation(location)
      setAccuracy(acc)
    }).catch(err => console.error(err))

    const unwatch = watchUserLocation(
      ({ location, accuracy: acc }) => {
        setUserLocation(location)
        setAccuracy(acc)
      },
      (error) => console.warn('Location watch error:', error)
    )

    return () => unwatch?.()
  }, [])

  // Real-time truck position updates (faster)
  useEffect(() => {
    const id = setInterval(() => {
      trucks.forEach(t => {
        const next = jitterMove(t.latlng, 0.0008)
        updateTruckPosition(t.id, next)
      })
    }, 1000) // Update every second for smooth movement

    return () => clearInterval(id)
  }, [trucks, updateTruckPosition])

  // Calculate nearby trucks
  useEffect(() => {
    if (userLocation) {
      const nearby = trucks
        .map(truck => ({
          ...truck,
          distance: haversineDistanceKm(userLocation, truck.latlng)
        }))
        .filter(truck => truck.distance < 3)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
      setNearbyTrucks(nearby)
    }
  }, [trucks, userLocation])

  const activeTrucks = trucks.filter(t => t.status === 'dispatched').length
  const availableTrucks = trucks.filter(t => t.status === 'idle').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Live Truck Tracking
            </h1>
            <p className="text-gray-400 mt-2">Real-time location and movement monitoring</p>
          </div>
          <div className="flex gap-4">
            <motion.div
              animate={{ rotate: 20 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              📍
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {[
            { icon: <Truck className="text-blue-400" size={20} />, label: 'Active Trucks', value: activeTrucks, color: 'blue' },
            { icon: <Activity className="text-green-400" size={20} />, label: 'Available', value: availableTrucks, color: 'green' },
            { icon: <Navigation className="text-purple-400" size={20} />, label: 'Total Trucks', value: trucks.length, color: 'purple' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 border border-${stat.color}-500/30 flex items-center justify-between`}
            >
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {stat.icon}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
          >
            {userLocation ? (
              <MapView center={userLocation} userLocation={userLocation} trucks={trucks} requests={[]} />
            ) : (
              <div className="flex h-[70vh] items-center justify-center rounded-xl border border-slate-700 text-slate-300 flex-col gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl"
                >
                  🛰️
                </motion.span>
                <div className="text-center">
                  <p className="font-semibold text-lg">Loading your location...</p>
                  <p className="text-sm text-gray-400 mt-2">Acquiring GPS signal</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar - Nearby Trucks & Info */}
          <div className="space-y-6">
            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30"
            >
              <h4 className="font-bold text-lg flex items-center gap-2 text-white mb-4">
                <MapPin className="text-green-400" size={20} /> Your Location
              </h4>
              {userLocation ? (
                <>
                  <p className="text-sm text-gray-300 font-mono break-all mb-3">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                  {accuracy && (
                    <div className="text-xs text-gray-400">
                      <p>Accuracy: ±{accuracy.toFixed(0)}m</p>
                      <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (accuracy / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Requesting location...</p>
              )}
            </motion.div>

            {/* Nearby Trucks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
            >
              <h4 className="font-bold text-lg flex items-center gap-2 text-white mb-4">
                <Truck className="text-blue-400" size={20} /> Nearby Trucks
              </h4>
              {nearbyTrucks.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {nearbyTrucks.map((truck, idx) => (
                    <motion.div
                      key={truck.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{truck.name}</p>
                          <p className="text-xs text-gray-400 mt-1">ID: {truck.id}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          truck.status === 'dispatched'
                            ? 'bg-blue-500/20 text-blue-300'
                            : truck.status === 'idle'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {truck.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <Navigation size={14} className="text-green-400" />
                        {truck.distance.toFixed(2)} km away
                      </div>
                      <div className="text-xs text-gray-400">
                        Capacity: {truck.capacity}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No trucks nearby</p>
              )}
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-xs space-y-2"
            >
              <p className="font-bold text-white mb-3">📍 Map Legend</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-gray-300">Your location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-gray-300">Active truck</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-gray-300">Idle truck</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
