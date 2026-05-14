import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import MapView from '../../components/MapView'
import { toast } from 'react-toastify'
import { sortByDistance, getUserLocation, watchUserLocation, haversineDistanceKm } from '../../utils/geo'
import { MapPin, Truck, Clock, AlertCircle, CheckCircle2, Navigation, LogOut } from 'lucide-react'

export default function UserDashboard(){
  const navigate = useNavigate()
  const trucks = useStore(s => s.trucks)
  const corporations = useStore(s => s.municipalCorporations)
  const addRequest = useStore(s => s.addRequest)
  const requests = useStore(s => s.requests)
  const logout = useStore(s => s.logout)

  const [loc, setLoc] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [geoStatus, setGeoStatus] = useState('requesting')
  const [nearbyTrucks, setNearbyTrucks] = useState([])

  useEffect(() => {
    getUserLocation().then(({ location, accuracy }) => {
      setLoc(location)
      setAccuracy(accuracy)
      setGeoStatus('ready')
    }).catch(err => {
      console.error(err)
      setGeoStatus('denied')
    })

    const unwatch = watchUserLocation(
      ({ location, accuracy: acc }) => {
        setLoc(location)
        setAccuracy(acc)
      },
      (error) => {
        console.warn('Location watch error:', error)
      }
    )

    return () => unwatch?.()
  }, [])

  useEffect(() => {
    if (loc) {
      const nearby = trucks
        .map(truck => ({
          ...truck,
          distance: haversineDistanceKm(loc, truck.latlng)
        }))
        .filter(truck => truck.distance < 5)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
      setNearbyTrucks(nearby)
    }
  }, [loc, trucks])

  const nearbyCorporations = loc
    ? sortByDistance(loc, corporations).slice(0, 5)
    : []

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const collectedRequests = requests.filter(r => r.status === 'collected')

  function requestPickup(area){
    const payload = {
      id: Date.now(),
      areaId: area.id,
      areaName: area.name,
      latlng: loc,
      status: 'pending'
    }
    addRequest(payload)
    toast.success(`✓ Pickup request submitted for ${area.name}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

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
              Welcome back! 👋
            </h1>
            <p className="text-gray-400 mt-2">Track waste collection in real-time from your location</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="px-6 py-3 flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 font-medium hover:bg-red-500/30 transition-all"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </motion.div>

        {/* Location Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-xl border backdrop-blur-sm ${
            geoStatus === 'ready'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={geoStatus === 'ready' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                {geoStatus === 'ready' ? '📍' : '⏳'}
              </motion.div>
              <div>
                <p className="font-semibold text-white">
                  {geoStatus === 'ready'
                    ? `Live Location: ${loc?.map(l => l.toFixed(4)).join(', ')}`
                    : 'Getting your location...'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {accuracy && `Accuracy: ±${accuracy.toFixed(0)}m`}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-xl"
            >
              🛰️
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
              🗺️ Live Map
            </h3>
            {loc ? (
              <MapView center={loc} userLocation={loc} trucks={trucks} requests={requests} />
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-lg border border-slate-700 text-slate-300 flex-col gap-3">
                <span className="text-5xl animate-bounce">📍</span>
                <div className="text-center">
                  <p className="font-semibold text-lg">Requesting location...</p>
                  <p className="text-sm text-gray-400 mt-1">Please allow location access for best experience</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nearby Trucks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <Truck className="text-green-400" size={20} /> Nearby Trucks
              </h4>
              {nearbyTrucks.length > 0 ? (
                <div className="space-y-3">
                  {nearbyTrucks.map(truck => (
                    <motion.div
                      key={truck.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-green-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{truck.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          truck.status === 'dispatched'
                            ? 'bg-blue-500/20 text-blue-300'
                            : truck.status === 'idle'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {truck.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Navigation size={12} />
                        {truck.distance.toFixed(2)} km away
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No trucks nearby</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-2xl font-bold text-blue-300">{pendingRequests.length}</p>
                <p className="text-xs text-gray-400 mt-1">Pending</p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-2xl font-bold text-green-300">{collectedRequests.length}</p>
                <p className="text-xs text-gray-400 mt-1">Collected</p>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
            >
              <h4 className="font-bold text-sm mb-3 text-white flex items-center gap-2">
                ℹ️ Quick Tips
              </h4>
              <ul className="text-xs space-y-2 text-gray-300">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Enable location access</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>See nearby corporations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Request waste pickup</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Track in real-time</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Nearby Corporations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
        >
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <MapPin className="text-green-400" size={20} /> Nearby Municipal Corporations
          </h4>
          {loc ? (
            nearbyCorporations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyCorporations.map(corp => (
                  <motion.div
                    key={corp.id}
                    whileHover={{ y: -5 }}
                    className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-white">{corp.name}</h5>
                        <p className="text-xs text-gray-400 mt-1">{corp.city}</p>
                      </div>
                      <motion.span
                        animate={{ rotate: 20 }}
                        className="text-2xl"
                      >
                        {corp.alerted ? '🔔' : '🏛️'}
                      </motion.span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
                      <span>📏 {corp.distanceKm.toFixed(1)} km</span>
                      <span>📊 {corp.requests} requests</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => requestPickup(corp)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                    >
                      Request Pickup
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No corporations found nearby</p>
            )
          ) : (
            <p className="text-gray-400 text-center py-8">📍 Enable location to see nearby corporations</p>
          )}
        </motion.div>

        {/* Recent Requests */}
        {requests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
          >
            <h4 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <Clock size={20} /> Request History
            </h4>
            <div className="space-y-3">
              {requests.slice().reverse().slice(0, 5).map(r => (
                <motion.div
                  key={r.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {r.status === 'pending' && <Clock size={18} className="text-yellow-400" />}
                    {r.status === 'collected' && <CheckCircle2 size={18} className="text-green-400" />}
                    {r.status === 'dispatched' && <Truck size={18} className="text-blue-400" />}
                    <div>
                      <p className="font-medium text-white">{r.areaName}</p>
                      <p className="text-xs text-gray-400">ID: {r.id.toString().slice(0, 8)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-300'
                      : r.status === 'collected'
                      ? 'bg-green-500/10 text-green-300'
                      : 'bg-blue-500/10 text-blue-300'
                  }`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
