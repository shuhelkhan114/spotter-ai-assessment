import React from 'react';

const STATUS = [
  'Off Duty',
  'Sleeper Berth',
  'Driving',
  'On Duty',
];

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function SummaryPanel({ blocks }) {
  // Calculate totals for each status
  const totals = [0, 0, 0, 0];
  blocks.forEach((status) => {
    if (status >= 0 && status < 4) totals[status] += 15;
  });
  const totalMins = totals.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="font-semibold mb-2 text-sm">Summary (Totals)</div>
      <div className="flex flex-wrap gap-4 text-xs">
        {STATUS.map((label, idx) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-medium">{label}</span>
            <span className="text-blue-700">{formatMinutes(totals[idx])}</span>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <span className="font-medium">Total</span>
          <span className="text-green-700">{formatMinutes(totalMins)}</span>
        </div>
      </div>
    </div>
  );
} 