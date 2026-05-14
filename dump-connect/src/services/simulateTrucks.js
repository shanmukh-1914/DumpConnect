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

// Realistic jitter movement that stays within bounds
export function jitterMove(latlng, scale = 0.0008) {
  const [lat, lng] = latlng
  // Add realistic street-level movement
  const dLat = (Math.random() - 0.5) * scale
  const dLng = (Math.random() - 0.5) * scale * 1.2 // Slightly more horizontal variation

  // Bounds for Delhi area
  const newLat = Math.max(28.4, Math.min(28.9, lat + dLat))
  const newLng = Math.max(76.8, Math.min(77.4, lng + dLng))

  return [newLat, newLng]
}

// Generate smooth curved route using Catmull-Rom spline
export function generateSmoothRoute(waypoints, segments = 50) {
  if (waypoints.length < 2) return waypoints
  
  const route = []
  const segmentCount = segments / (waypoints.length - 1)

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = i > 0 ? waypoints[i - 1] : waypoints[i]
    const p1 = waypoints[i]
    const p2 = waypoints[i + 1]
    const p3 = i + 2 < waypoints.length ? waypoints[i + 2] : waypoints[i + 1]

    for (let t = 0; t < 1; t += 1 / segmentCount) {
      const t2 = t * t
      const t3 = t2 * t

      const q = 0.5 * (
        2 * p1[0] +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      )

      const r = 0.5 * (
        2 * p1[1] +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      )

      route.push([q, r])
    }
  }

  return route
}

// Calculate realistic travel time in seconds
export function calculateTravelTime(distance_km, avg_speed_kmh = 25) {
  return (distance_km / avg_speed_kmh) * 3600
}

// Interpolate position along route based on progress percentage (0-1)
export function getPositionOnRoute(route, progress) {
  if (!route || route.length === 0) return null
  const index = Math.floor(progress * (route.length - 1))
  return route[Math.min(index, route.length - 1)]
}

// Generate next waypoint with randomness for realistic streets
export function generateNextWaypoint(current, options = {}) {
  const { maxDistance = 0.01, maxLat = 28.9, minLat = 28.4, maxLng = 77.4, minLng = 76.8 } = options
  
  const [lat, lng] = current
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * maxDistance

  const newLat = Math.max(minLat, Math.min(maxLat, lat + Math.cos(angle) * distance))
  const newLng = Math.max(minLng, Math.min(maxLng, lng + Math.sin(angle) * distance))

  return [newLat, newLng]
}
