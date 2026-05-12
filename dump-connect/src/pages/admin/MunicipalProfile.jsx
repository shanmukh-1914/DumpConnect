import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { sortByDistance } from '../../utils/geo'

export default function MunicipalProfile() {
  const navigate = useNavigate()
  const corporations = useStore(s => s.municipalCorporations)
  const requests = useStore(s => s.requests)
  const selectedCorporationId = useStore(s => s.selectedCorporationId)
  const setSelectedCorporationId = useStore(s => s.setSelectedCorporationId)
  const logout = useStore(s => s.logout)

  const [loc, setLoc] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLoc([pos.coords.latitude, pos.coords.longitude])
      })
    }
  }, [])

  useEffect(() => {
    if (loc && corporations.length) {
      const nearest = sortByDistance(loc, corporations)[0]
      if (nearest) {
        setSelectedCorporationId(nearest.id)
      }
    } else if (!loc && corporations.length && !selectedCorporationId) {
      setSelectedCorporationId(corporations[0].id)
    }
  }, [loc, corporations, selectedCorporationId, setSelectedCorporationId])

  const selectedCorporation = corporations.find(c => c.id === selectedCorporationId) || corporations[0]
  const corporationRequests = selectedCorporation
    ? requests.filter(request => request.areaId === selectedCorporation.id).slice().reverse()
    : []

  return (
    <div className="space-y-6">
      <div className="glass p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Municipal Corporation Profile</h2>
          <p className="text-sm text-slate-400">Review live requests and request status for one corporation at a time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin" className="px-3 py-2 rounded border border-slate-600 text-slate-100">Back to Dashboard</Link>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="px-3 py-2 rounded bg-primary text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="glass p-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Select corporation {loc && '(auto-selected based on your location)'}
            </label>
            <select
              value={selectedCorporation?.id || ''}
              onChange={(event) => setSelectedCorporationId(event.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-700 p-2"
            >
              {corporations.map(corporation => (
                <option key={corporation.id} value={corporation.id}>
                  {corporation.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCorporation && (
            <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
              <div className="text-lg font-semibold">{selectedCorporation.name}</div>
              <div className="text-sm text-slate-400">{selectedCorporation.city}</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <div className="text-slate-400">Population</div>
                  <div className="font-medium">{selectedCorporation.population.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Total Requests</div>
                  <div className="font-medium">{selectedCorporation.requests || 0}</div>
                </div>
                <div>
                  <div className="text-slate-400">Current Status</div>
                  <div className="font-medium">{selectedCorporation.alerted ? 'Alert sent' : 'Monitoring'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <div className="text-sm text-slate-400">Requests for this corporation</div>
            <div className="text-3xl font-semibold">{corporationRequests.length}</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4 max-h-[28rem] overflow-y-auto">
            <h3 className="font-medium mb-3">Request Feed</h3>
            <div className="space-y-3 text-sm">
              {corporationRequests.length ? corporationRequests.map(request => (
                <div key={request.id} className="rounded border border-slate-700 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{request.areaName}</div>
                    <div className="text-xs text-slate-400">{request.status}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Request ID: {request.id}
                  </div>
                </div>
              )) : (
                <div className="text-slate-400">No requests for the selected corporation yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
