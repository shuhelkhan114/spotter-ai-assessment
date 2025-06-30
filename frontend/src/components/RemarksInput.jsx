import React from 'react';

export default function RemarksInput({ value, onChange }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <label className="text-xs font-semibold mb-1 block">Remarks</label>
      <textarea
        name="remarks"
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full border rounded px-2 py-1 text-xs resize-vertical"
        placeholder="Enter remarks, locations, activities, etc."
      />
    </div>
  );
} 