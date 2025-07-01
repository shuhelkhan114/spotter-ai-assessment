import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// TODO: Replace with your own Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const DUMMY_ROUTE = [
  [-87.9065, 43.0389], // Milwaukee, WI
  [-87.6278, 41.8818], // Chicago, IL
];

export default function MapView() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return; // Prevent re-initialization

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: DUMMY_ROUTE[0],
      zoom: 6,
    });

    // Add route line
    mapRef.current.on('load', () => {
      mapRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: DUMMY_ROUTE,
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

      // Add markers for start and end
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(DUMMY_ROUTE[0])
        .addTo(mapRef.current);
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(DUMMY_ROUTE[1])
        .addTo(mapRef.current);
    });

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  return (
    <div className="my-4">
      <div
        ref={mapContainer}
        className="w-full border rounded shadow"
        style={{ height: 400 }}
      />
    </div>
  );
} 