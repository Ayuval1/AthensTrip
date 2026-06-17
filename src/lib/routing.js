export async function streetRoute(waypoints, mode = 'foot') {
  if (!waypoints?.length || waypoints.length < 2) throw new Error('Need at least 2 waypoints')
  const coords = waypoints.map(p => `${p.lng},${p.lat}`).join(';')
  const res = await fetch(`/api/route?waypoints=${encodeURIComponent(coords)}&mode=${mode}`)
  if (!res.ok) throw new Error(`route fetch failed: ${res.status}`)
  const data = await res.json()
  if (!data.routes?.length) throw new Error('No routes returned')
  const route = data.routes[0]
  return {
    geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distance: route.distance,
    duration: route.duration,
  }
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} מ'`
  return `${(meters / 1000).toFixed(1)} ק"מ`
}

export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} דק'`
  const hours = Math.floor(mins / 60)
  const remaining = mins % 60
  return remaining > 0 ? `${hours}:${String(remaining).padStart(2, '0')} שע'` : `${hours} שע'`
}
