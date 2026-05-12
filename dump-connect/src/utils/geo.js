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
