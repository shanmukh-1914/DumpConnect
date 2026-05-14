import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom icon creation function
const createCustomIcon = (type, status) => {
  let html, size
  
  if (type === 'user') {
    html = `
      <div style="
        background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        font-size: 16px;
      ">📍</div>
    `
    size = [32, 32]
  } else if (type === 'truck') {
    const bgColor = status === 'dispatched' ? '#3b82f6' : status === 'completed' ? '#10b981' : '#6b7280'
    html = `
      <div style="
        background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}cc 100%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
        font-size: 20px;
        animation: pulse 2s infinite;
      ">🚛</div>
    `
    size = [40, 40]
  } else if (type === 'request') {
    html = `
      <div style="
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
        font-size: 14px;
      ">🗑️</div>
    `
    size = [28, 28]
  } else if (type === 'destination') {
    html = `
      <div style="
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        font-size: 16px;
      ">📍</div>
    `
    size = [32, 32]
  }

  return L.divIcon({
    html: `<style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>${html}`,
    iconSize: size,
    className: 'custom-icon'
  })
}

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

export default function MapView({ center=[28.7041,77.1025], trucks=[], requests=[], userLocation=null }){
  const mapRef = useRef(null)
  const mapKeyRef = useRef(`map-${Math.random().toString(36).slice(2)}`)
  const safeCenter = Array.isArray(center) && center.length === 2 ? center : [28.7041, 77.1025]

  useEffect(() => {
    const map = mapRef.current
    if (map && Array.isArray(safeCenter) && safeCenter.length === 2) {
      map.setView(safeCenter, map.getZoom(), { animate: true })
    }
  }, [safeCenter])

  useEffect(() => {
    return () => {
      const map = mapRef.current
      if (map && map.remove) {
        try { map.remove() } catch (e) { /* ignore */ }
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
      <MapContainer
        key={mapKeyRef.current}
        center={safeCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* User Location */}
        {userLocation && (
          <>
            <CircleMarker
              center={userLocation}
              radius={12}
              pathOptions={{
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.3,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-green-600">📍 Your Location</p>
                  <p className="text-xs text-gray-600">{userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
            <Marker position={userLocation} icon={createCustomIcon('user')}>
              <Tooltip permanent direction="top" offset={[0, -25]}>
                <span className="font-semibold">📍 You</span>
              </Tooltip>
            </Marker>
          </>
        )}

        {/* Trucks */}
        {trucks.map(t => (
          <React.Fragment key={t.id}>
            <Marker position={t.latlng} icon={createCustomIcon('truck', t.status)}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-blue-600">{t.name}</p>
                  <p className="text-xs text-gray-600">Status: {t.status}</p>
                  <p className="text-xs text-gray-600">Capacity: {t.capacity}%</p>
                </div>
              </Popup>
              <Tooltip direction="right">
                <span className="font-semibold">{t.name} - {t.status}</span>
              </Tooltip>
            </Marker>

            {/* Draw route */}
            {t.route && t.route.length > 1 && (
              <>
                <Polyline
                  positions={t.route}
                  pathOptions={{
                    color: t.status === 'dispatched' ? '#3b82f6' : '#9ca3af',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '5, 5',
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* Route endpoints */}
                {t.route[t.route.length - 1] && (
                  <Marker position={t.route[t.route.length - 1]} icon={createCustomIcon('destination')}>
                    <Tooltip>Destination</Tooltip>
                  </Marker>
                )}
              </>
            )}
          </React.Fragment>
        ))}

        {/* Requests/Pickup Points */}
        {requests.map((r, i) => (
          <Marker key={`req-${i}`} position={r.latlng} icon={createCustomIcon('request')}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-red-600">{r.areaName}</p>
                <p className="text-xs text-gray-600">Status: {r.status}</p>
              </div>
            </Popup>
            <Tooltip direction="top">
              <span className="font-semibold">🗑️ {r.areaName}</span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
