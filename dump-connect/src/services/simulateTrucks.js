// Simulation helpers: generate a linear route (array of latlngs) between two points
export function generateRoutePoints(from, to, steps = 40) {
  const [lat1, lng1] = from
  const [lat2, lng2] = to
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const lat = lat1 + (lat2 - lat1) * t
    const lng = lng1 + (lng2 - lng1) * t
    pts.push([lat, lng])
  }
  return pts
}

// small jitter fallback movement (when no route assigned)
export function jitterMove(latlng, scale = 0.0006) {
  const [lat, lng] = latlng
  const dLat = (Math.random() - 0.5) * scale
  const dLng = (Math.random() - 0.5) * scale
  return [lat + dLat, lng + dLng]
}
