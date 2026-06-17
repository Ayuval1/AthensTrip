import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { ATTRACTIONS, APARTMENT } from '../data/athens'
import AttractionModal from './AttractionModal'
import RoutePlanner from './RoutePlanner'

const CATEGORY_COLORS = {
  historical: '#E74C3C', nature: '#27AE60', food: '#F39C12',
  shopping: '#9B59B6', fun: '#2980B9', supermarket: '#00897B',
  metro: '#D81B60', bus: '#7B1FA2',
}
const CATEGORY_LABELS = {
  historical: '🏛️ היסטורי', nature: '🌿 טבע', food: '🍽️ אוכל',
  shopping: '🛍️ קניות', fun: '🎉 בילוי', supermarket: '🛒 סופרים',
  metro: '🚇 מטרו', bus: '🚌 אוטובוס',
}
const CATEGORY_EMOJIS = {
  historical: '🏛️', nature: '🌿', food: '🍽️', shopping: '🛍️',
  fun: '🎉', supermarket: '🛒', metro: '🚇', bus: '🚌',
}

function makeIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;display:block;text-align:center;line-height:28px;">${emoji}</span></div>`,
    iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -36],
  })
}
const HOME_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#1B4F8C;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:18px;">🏠</div>`,
  iconSize: [36, 36], iconAnchor: [18, 18],
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => { if (onMapClick) onMapClick(e.latlng) }
  })
  return null
}

export default function InteractiveMap() {
  const [modalId, setModalId] = useState(null)
  const [activeCategories, setActiveCategories] = useState(Object.keys(CATEGORY_COLORS))
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [routeGeometry, setRouteGeometry] = useState(null)
  const [mapClickHandler, setMapClickHandler] = useState(null)
  const mapRef = useRef(null)

  function toggleCategory(cat) {
    setActiveCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => { const latlng = [pos.coords.latitude, pos.coords.longitude]; setUserPos(latlng); setLocating(false); mapRef.current?.flyTo(latlng, 16) },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const visible = ATTRACTIONS.filter(a => activeCategories.includes(a.category))

  return (
    <div className="flex flex-col h-full">
      {modalId && <AttractionModal attractionId={modalId} onClose={() => setModalId(null)} />}

      <div className="flex gap-1.5 px-3 pt-3 pb-2 overflow-x-auto flex-shrink-0">
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
          <button key={cat} onClick={() => toggleCategory(cat)}
            className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium transition-all"
            style={{ background: activeCategories.includes(cat) ? CATEGORY_COLORS[cat] : 'rgba(0,0,0,0.06)', color: activeCategories.includes(cat) ? 'white' : '#666' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-3 pb-3 relative">
        {mapClickHandler && (
          <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none' }}>
            <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: '#1B4F8C', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
              📍 לחץ על המפה לבחירת מיקום
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, display: 'flex', gap: '8px' }}>
          <button onClick={handleLocate} disabled={locating} className="text-xs px-3 py-2 rounded-xl font-medium"
            style={{ background: userPos ? '#27AE60' : '#1B4F8C', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer' }}>
            {locating ? '⏳' : '📍'} {locating ? 'מאתר...' : 'מיקומי'}
          </button>
          <button onClick={() => mapRef.current?.flyTo(APARTMENT.coords, 17)} className="text-xs px-3 py-2 rounded-xl font-medium"
            style={{ background: '#C9A84C', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer' }}>
            🏠 דירה
          </button>
        </div>

        <RoutePlanner
          onRoute={geometry => setRouteGeometry(geometry)}
          onClear={() => setRouteGeometry(null)}
          setMapClickHandler={setMapClickHandler}
        />

        <MapContainer ref={mapRef} center={[37.9715, 23.7267]} zoom={14}
          style={{ height: '100%', minHeight: '400px', borderRadius: '16px', cursor: mapClickHandler ? 'crosshair' : 'grab' }}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri &mdash; Source: Esri, DeLorme, HERE, TomTom, Intermap, USGS, NRCAN, EPA, NPS"
          />

          <MapClickHandler onMapClick={mapClickHandler} />

          <Marker position={APARTMENT.coords} icon={HOME_ICON}>
            <Popup>
              <div style={{ fontFamily: 'Heebo', direction: 'rtl', textAlign: 'right' }}>
                <strong>🏠 הדירה שלנו</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>{APARTMENT.neighborhood}</p>
              </div>
            </Popup>
          </Marker>

          {userPos && (
            <CircleMarker center={userPos} radius={10}
              pathOptions={{ color: '#1B4F8C', fillColor: '#4A90D9', fillOpacity: 0.85, weight: 2 }}>
              <Popup>
                <div style={{ fontFamily: 'Heebo', direction: 'rtl', textAlign: 'right', minWidth: '140px' }}>
                  <strong>📍 אתם כאן</strong><br />
                  <a href={`https://www.google.com/maps/dir/?api=1&origin=${userPos[0]},${userPos[1]}&destination=${APARTMENT.coords[0]},${APARTMENT.coords[1]}&travelmode=walking`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '6px', background: '#C9A84C', color: 'white', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}>
                    🏠 מסלול לדירה
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          )}

          {visible.map(attraction => (
            <Marker key={attraction.id} position={attraction.coords}
              icon={makeIcon(CATEGORY_COLORS[attraction.category], attraction.emoji || CATEGORY_EMOJIS[attraction.category])}>
              <Popup>
                <div style={{ fontFamily: 'Heebo', direction: 'rtl', textAlign: 'right', minWidth: '150px' }}>
                  <strong style={{ color: '#0D2644', fontSize: '14px' }}>{attraction.name}</strong>
                  <p style={{ margin: '4px 0 2px', fontSize: '12px', color: '#666' }}>{attraction.hours}</p>
                  <button onClick={() => setModalId(attraction.id)}
                    style={{ background: '#1B4F8C', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', marginTop: '6px', width: '100%' }}>
                    פרטים נוספים
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {routeGeometry && routeGeometry.length > 1 && (
            <>
              <Polyline positions={routeGeometry} pathOptions={{ color: '#000', weight: 6, opacity: 0.2 }} />
              <Polyline positions={routeGeometry} pathOptions={{ color: '#1B4F8C', weight: 4, opacity: 0.9, dashArray: '10,5' }} />
              <CircleMarker center={routeGeometry[0]} radius={8}
                pathOptions={{ fillColor: '#27AE60', color: '#fff', weight: 2, fillOpacity: 1 }} />
              <CircleMarker center={routeGeometry[routeGeometry.length - 1]} radius={8}
                pathOptions={{ fillColor: '#DC2626', color: '#fff', weight: 2, fillOpacity: 1 }} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
