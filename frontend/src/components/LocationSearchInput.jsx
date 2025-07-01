import React, { useState, useRef } from 'react';

const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN;

export default function LocationSearchInput({ value, onChange, onSelect, label, placeholder, name }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    setSuggestions(data.features || []);
  };

  const handleInputChange = (e) => {
    onChange(e);
    setShowDropdown(true);
    clearTimeout(timeoutRef.current);
    const query = e.target.value;
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleSelect = (place) => {
    onSelect(place.place_name);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      {label && <label className="text-xs font-semibold">{label}</label>}
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => value && setShowDropdown(true)}
        autoComplete="off"
        placeholder={placeholder}
        className="border rounded px-2 py-1 text-sm w-full"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((place) => (
            <li
              key={place.id}
              className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-sm"
              onMouseDown={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 