import React from 'react';

export default function HeaderForm({ form, onChange }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4 flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Date</label>
        <div className="flex gap-1">
          <input type="number" name="month" min="1" max="12" placeholder="MM" value={form.month} onChange={onChange} className="w-12 px-1 py-0.5 border rounded text-xs" />
          <input type="number" name="day" min="1" max="31" placeholder="DD" value={form.day} onChange={onChange} className="w-12 px-1 py-0.5 border rounded text-xs" />
          <input type="number" name="year" min="1900" max="2100" placeholder="YYYY" value={form.year} onChange={onChange} className="w-16 px-1 py-0.5 border rounded text-xs" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">From</label>
        <input type="text" name="from" value={form.from} onChange={onChange} className="w-32 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">To</label>
        <input type="text" name="to" value={form.to} onChange={onChange} className="w-32 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Total Miles Driving Today</label>
        <input type="number" name="totalMilesDriving" value={form.totalMilesDriving} onChange={onChange} className="w-24 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Total Mileage Today</label>
        <input type="number" name="totalMileage" value={form.totalMileage} onChange={onChange} className="w-24 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Carrier Name</label>
        <input type="text" name="carrierName" value={form.carrierName} onChange={onChange} className="w-40 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Main Office Address</label>
        <input type="text" name="officeAddress" value={form.officeAddress} onChange={onChange} className="w-40 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Home Terminal Address</label>
        <input type="text" name="terminalAddress" value={form.terminalAddress} onChange={onChange} className="w-40 px-1 py-0.5 border rounded text-xs" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Truck/Trailer/License Info</label>
        <input type="text" name="truckInfo" value={form.truckInfo} onChange={onChange} className="w-40 px-1 py-0.5 border rounded text-xs" />
      </div>
    </div>
  );
} 