import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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
      // cleanup previous Leaflet map instance on unmount to avoid "container already initialized"
      const map = mapRef.current
      if (map && map.remove) {
        try { map.remove() } catch (e) { /* ignore */ }
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full h-[60vh] rounded-lg overflow-hidden">
      <MapContainer
        key={mapKeyRef.current}
        center={safeCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <CircleMarker center={userLocation} radius={10} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.35 }}>
            <Tooltip>Your current location</Tooltip>
          </CircleMarker>
        )}

        {trucks.map(t => (
          <React.Fragment key={t.id}>
            <Marker position={t.latlng}>
              <Tooltip>{t.label} — {t.status}</Tooltip>
            </Marker>
            {/* draw route if exists */}
            {t.route && t.route.length > 1 && (
              <Polyline positions={t.route} pathOptions={{ color: t.status === 'dispatched' ? '#60a5fa' : '#9ca3af', weight: 3, dashArray: '6' }} />
            )}
          </React.Fragment>
        ))}

        {requests.map((r, i) => (
          <CircleMarker key={i} center={r.latlng} radius={8} pathOptions={{ color: '#ff6b6b' }}>
            <Tooltip>Request — {r.areaName}</Tooltip>
          </CircleMarker>
        ))}

      </MapContainer>
    </div>
  )
}
