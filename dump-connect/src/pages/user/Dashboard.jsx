import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import MapView from '../../components/MapView'
import { toast } from 'react-toastify'
import { sortByDistance } from '../../utils/geo'

export default function UserDashboard(){
  const navigate = useNavigate()
  const trucks = useStore(s => s.trucks)
  const corporations = useStore(s => s.municipalCorporations)
  const addRequest = useStore(s => s.addRequest)
  const requests = useStore(s => s.requests)
  const logout = useStore(s => s.logout)

  const [loc, setLoc] = useState(null)
  const [geoStatus, setGeoStatus] = useState('requesting')

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        setLoc([pos.coords.latitude, pos.coords.longitude])
        setGeoStatus('ready')
      }, ()=>{
        setLoc(null)
        setGeoStatus('denied')
      })
    } else {
      setLoc(null)
      setGeoStatus('unsupported')
    }
  }, [])

  const nearbyCorporations = loc
    ? sortByDistance(loc, corporations).slice(0, 5)
    : []

  function requestPickup(area){
    const payload = {
      id: Date.now(),
      areaId: area.id,
      areaName: area.name,
      latlng: loc,
      status: 'pending'
    }
    addRequest(payload)
    toast.success('Pickup request submitted')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back! 👋</h1>
          <p className="text-slate-400">Request pickups from nearby municipal corporations</p>
        </div>
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="px-4 py-2 rounded-lg border border-slate-600 text-slate-100 font-medium hover:bg-slate-800/50 transition"
        >
          🚪 Logout
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🗺️ Live Map</h3>
            {loc ? (
              <MapView center={loc} userLocation={loc} trucks={trucks} requests={requests} />
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-lg border border-slate-700 text-slate-300 flex-col gap-3">
                <span className="text-4xl">📍</span>
                <div className="text-center">
                  {geoStatus === 'requesting' && <p>Waiting for browser location permission...</p>}
                  {geoStatus === 'denied' && <p>Location permission denied. Please allow access to show your map position.</p>}
                  {geoStatus === 'unsupported' && <p>Geolocation is not supported by this browser.</p>}
                </div>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">📋 Request History</h3>
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.slice().reverse().slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition">
                    <div>
                      <div className="font-medium">{r.areaName}</div>
                      <div className="text-xs text-slate-400">ID: {r.id.toString().slice(0, 8)}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      r.status === 'collected' ? 'bg-green-500/10 text-green-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">📭</p>
                <p>No requests yet. Request a pickup to get started!</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
        <div className="glass p-6 rounded-xl border-l-4 border-l-primary">
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">📍 Your Location</h4>
          <p className="text-sm text-slate-300 font-mono break-all">{loc ? loc.join(', ') : 'Waiting for your live location'}</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">🏛️ Nearby Corporations</h4>
          {loc ? (
            <div className="space-y-3">
              {nearbyCorporations.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-primary/50 transition">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{a.city}</span>
                      <span className="text-slate-600">•</span>
                      <span>{a.distanceKm.toFixed(1)} km</span>
                    </div>
                  </div>
                  <button aria-label={`Request pickup in ${a.name}`} onClick={()=>requestPickup(a)} className="px-3 py-1 bg-gradient-to-r from-primary to-accent rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/50 transition whitespace-nowrap ml-2">Request</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">📍 Enable location to see nearby corporations</p>
          )}
        </div>

        <div className="glass p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10">
          <h4 className="font-bold mb-2 flex items-center gap-2">ℹ️ How it works</h4>
          <ul className="text-sm space-y-2 text-slate-300">
            <li className="flex gap-2"><span>1️⃣</span> <span>Enable location access</span></li>
            <li className="flex gap-2"><span>2️⃣</span> <span>See nearby corporations</span></li>
            <li className="flex gap-2"><span>3️⃣</span> <span>Click Request to submit</span></li>
            <li className="flex gap-2"><span>4️⃣</span> <span>Track truck in real-time</span></li>
          </ul>
        </div>
      </aside>
      </div>
    </div>
  )
}
