import React from 'react';

export default function ShippingInfo({ form, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4 flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Document/Manifest No.</label>
        <input type="text" name="manifestNo" value={form.manifestNo} onChange={onChange} className="w-40 px-1 py-0.5 border rounded text-xs" />
        {errors.manifestNo && <span className="text-xs text-red-500">{errors.manifestNo}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold">Shipper & Commodity</label>
        <input type="text" name="shipperCommodity" value={form.shipperCommodity} onChange={onChange} className="w-64 px-1 py-0.5 border rounded text-xs" />
        {errors.shipperCommodity && <span className="text-xs text-red-500">{errors.shipperCommodity}</span>}
      </div>
    </div>
  );
} 