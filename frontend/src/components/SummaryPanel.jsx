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
  const totals = [0, 0, 0, 0];
  blocks.forEach((status) => {
    if (status >= 0 && status < 4) totals[status] += 15;
  });
  const totalMins = totals.reduce((a, b) => a + b, 0);

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-1">
        {STATUS.map((label, idx) => (
          <div key={label} className="flex items-center justify-between">
            <span className="w-28 text-sm font-medium pr-2 whitespace-nowrap">{label}</span>
            <span className="text-blue-700 text-xs">{formatMinutes(totals[idx])}</span>
          </div>
        ))}
        <div className="flex items-center justify-end mt-2">
          <span className="font-medium text-sm mr-2">Total</span>
          <span className="text-green-700 text-xs">{formatMinutes(totalMins)}</span>
        </div>
      </div>
    </div>
  );
} 