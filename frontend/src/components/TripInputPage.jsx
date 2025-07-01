import React, { useState } from 'react';
import MapView from './MapView';
import DailyLogGrid from './DailyLogGrid';
import LocationSearchInput from './LocationSearchInput';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const initialForm = {
  current_location: '',
  pickup_location: '',
  dropoff_location: '',
  current_cycle_used: '',
};

export default function TripInputPage() {
  const [form, setForm] = useState(initialForm);
  const [routeData, setRouteData] = useState(null);
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRouteData(null);
    setLogData(null);
    try {
      const routeRes = await fetch(`${API_BASE}/api/trip/route/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!routeRes.ok) throw new Error('Route API error');
      const routeJson = await routeRes.json();
      setRouteData(routeJson);

      const logsRes = await fetch(`${API_BASE}/api/trip/logs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!logsRes.ok) throw new Error('Logs API error');
      const logsJson = await logsRes.json();
      setLogData(logsJson);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-4">
        <LocationSearchInput
          label="Current Location"
          name="current_location"
          value={form.current_location}
          onChange={handleChange}
          onSelect={(val) => handleLocationSelect('current_location', val)}
          placeholder="Enter current location"
        />
        <LocationSearchInput
          label="Pickup Location"
          name="pickup_location"
          value={form.pickup_location}
          onChange={handleChange}
          onSelect={(val) => handleLocationSelect('pickup_location', val)}
          placeholder="Enter pickup location"
        />
        <LocationSearchInput
          label="Dropoff Location"
          name="dropoff_location"
          value={form.dropoff_location}
          onChange={handleChange}
          onSelect={(val) => handleLocationSelect('dropoff_location', val)}
          placeholder="Enter dropoff location"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Current Cycle Used (Hours)</label>
          <input type="number" name="current_cycle_used" value={form.current_cycle_used} onChange={handleChange} className="border rounded px-2 py-1 text-sm" min="0" max="70" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow mt-2" disabled={loading}>
          {loading ? 'Calculating...' : 'Plan Trip'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>

      {routeData && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Route & Stops</h2>
          <MapView polyline={routeData.polyline} stops={routeData.stops} />
          <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
            <div><b>Distance:</b> {routeData.distance_miles} miles</div>
            <div><b>ETA:</b> {routeData.eta_hours} hours</div>
            <div><b>Stops:</b> {routeData.stops.map((s, i) => `${s.type}${i < routeData.stops.length - 1 ? ', ' : ''}`)}</div>
          </div>
        </div>
      )}

      {logData && logData.days && logData.days.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Daily Log Sheet</h2>
          {logData.days.map((day, idx) => (
            <div key={day.date} className="mb-4">
              <div className="text-xs text-gray-500 mb-1">{day.date}</div>
              <DailyLogGrid blocks={day.blocks} setBlocks={() => {}} totals={day.totals} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 