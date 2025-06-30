import React, { useState } from 'react';
import HeaderForm from './components/HeaderForm';
import RemarksInput from './components/RemarksInput';
import ShippingInfo from './components/ShippingInfo';
import SummaryPanel from './components/SummaryPanel';
import DailyLogGrid from './components/DailyLogGrid';

const initialHeader = {
  month: '', day: '', year: '', from: '', to: '',
  totalMilesDriving: '', totalMileage: '', carrierName: '',
  officeAddress: '', terminalAddress: '', truckInfo: '',
};
const initialShipping = { manifestNo: '', shipperCommodity: '' };

export default function App() {
  const [header, setHeader] = useState(initialHeader);
  const [shipping, setShipping] = useState(initialShipping);
  const [remarks, setRemarks] = useState('');
  const [blocks, setBlocks] = useState(Array(24 * 4).fill(0));

  // Handlers for controlled components
  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };
  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 overflow-x-auto">
      <div className="max-w-6xl mx-auto">
        <HeaderForm form={header} onChange={handleHeaderChange} />
        <ShippingInfo form={shipping} onChange={handleShippingChange} />
        <RemarksInput value={remarks} onChange={handleRemarksChange} />
        <SummaryPanel blocks={blocks} />
        {/* Pass setBlocks to DailyLogGrid so it can update parent state */}
        <DailyLogGrid blocks={blocks} setBlocks={setBlocks} />
      </div>
    </div>
  );
}
