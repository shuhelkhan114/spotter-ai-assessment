import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const DEFAULT_ROUTE = [
  [-87.9065, 43.0389],
  [-87.6278, 41.8818],
];
const DEFAULT_STOPS = [
  { type: 'pickup', coords: [-87.9065, 43.0389] },
  { type: 'break', coords: [-87.75, 42.5] },
  { type: 'fuel', coords: [-87.7, 42.0] },
  { type: 'dropoff', coords: [-87.6278, 41.8818] },
];

const STOP_ICONS = {
  pickup: '🟢',
  dropoff: '🔴',
  break: '⏸️',
  fuel: '⛽',
};

export default function MapView({ polyline, stops }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    setLoading(true);
    const route = polyline && polyline.length > 1 ? polyline : DEFAULT_ROUTE;
    const stopsData = stops && stops.length > 0 ? stops : DEFAULT_STOPS;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: route[0],
      zoom: 6,
    });

    mapRef.current.on('load', () => {
      mapRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      });
      mapRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 4 },
      });

      if (route.length > 1) {
        const bounds = route.reduce((b, coord) => b.extend(coord), new mapboxgl.LngLatBounds(route[0], route[0]));
        mapRef.current.fitBounds(bounds, { padding: 60 });
      }
      stopsData.forEach((stop) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.fontSize = '1.5rem';
        el.style.lineHeight = '1.5rem';
        el.textContent = STOP_ICONS[stop.type] || '📍';
        new mapboxgl.Marker(el)
          .setLngLat(stop.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<b>${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}</b><br/>Lng: ${stop.coords[0].toFixed(4)}<br/>Lat: ${stop.coords[1].toFixed(4)}`
            )
          )
          .addTo(mapRef.current);
      });
      setLoading(false);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [polyline, stops]);

  return (
    <div className="my-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-20">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full border rounded shadow"
        style={{ height: 400 }}
      />
    </div>
  );
} 