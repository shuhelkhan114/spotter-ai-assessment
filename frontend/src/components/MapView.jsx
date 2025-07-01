import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// TODO: Replace with your own Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1aGVsLWtoYW4iLCJhIjoiY21jazcwZjUzMGQ2azJtc2s5bWpsNXZjNSJ9.c2UyzVHEMMoyP34UYSYp0w';

const DEFAULT_ROUTE = [
  [-87.9065, 43.0389], // Milwaukee, WI
  [-87.6278, 41.8818], // Chicago, IL
];
const DEFAULT_STOPS = [
  { type: 'pickup', coords: [-87.9065, 43.0389] },
  { type: 'break', coords: [-87.75, 42.5] },
  { type: 'fuel', coords: [-87.7, 42.0] },
  { type: 'dropoff', coords: [-87.6278, 41.8818] },
];

const STOP_COLORS = {
  pickup: 'green',
  dropoff: 'red',
  break: 'orange',
  fuel: 'blue',
};

export default function MapView({ polyline, stops }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
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

      // Add markers for stops
      stopsData.forEach((stop) => {
        new mapboxgl.Marker({ color: STOP_COLORS[stop.type] || 'gray' })
          .setLngLat(stop.coords)
          .setPopup(new mapboxgl.Popup().setText(stop.type.charAt(0).toUpperCase() + stop.type.slice(1)))
          .addTo(mapRef.current);
      });
    });

    return () => mapRef.current && mapRef.current.remove();
  }, [polyline, stops]);

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