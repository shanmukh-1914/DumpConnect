export function haversineDistanceKm(from, to) {
  if (!Array.isArray(from) || !Array.isArray(to) || from.length !== 2 || to.length !== 2) {
    return Number.POSITIVE_INFINITY
  }

  const toRad = (value) => (value * Math.PI) / 180
  const [lat1, lon1] = from
  const [lat2, lon2] = to
  const radius = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  return 2 * radius * Math.asin(Math.sqrt(a))
}

export function sortByDistance(origin, items) {
  return [...items]
    .map((item) => ({
      ...item,
      distanceKm: haversineDistanceKm(origin, item.center)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

// Real-time geolocation tracking
export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        resolve({ location: [latitude, longitude], accuracy })
      },
      (error) => {
        // Fallback to default location (Delhi)
        console.warn('Geolocation error:', error)
        resolve({ location: [28.7041, 77.1025], accuracy: null })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })
}

export function watchUserLocation(onLocationChange, onError) {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocation not supported'))
    return null
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords
      onLocationChange({
        location: [latitude, longitude],
        accuracy,
        heading,
        speed,
        timestamp: position.timestamp
      })
    },
    (error) => {
      console.warn('Geolocation watch error:', error)
      onError?.(error)
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  )

  return () => navigator.geolocation.clearWatch(watchId)
}

export function calculateBearing(from, to) {
  const toRad = (value) => (value * Math.PI) / 180
  const toDeg = (value) => (value * 180) / Math.PI

  const [lat1, lon1] = from
  const [lat2, lon2] = to

  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function calculateETA(distance, speed = 40) {
  // speed in km/h, distance in km
  const hours = distance / speed
  const minutes = Math.round(hours * 60)
  return minutes
}
