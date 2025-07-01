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
  const [errors, setErrors] = useState({});

  // Validation logic
  const validate = (fields = { header, shipping, remarks }) => {
    const newErrors = {};
    // Header fields
    Object.entries(fields.header).forEach(([key, value]) => {
      if (!value || value.toString().trim() === '') {
        newErrors[key] = 'Required';
      }
    });
    // Shipping fields
    Object.entries(fields.shipping).forEach(([key, value]) => {
      if (!value || value.toString().trim() === '') {
        newErrors[key] = 'Required';
      }
    });
    // Remarks
    if (!fields.remarks || fields.remarks.trim() === '') {
      newErrors.remarks = 'Required';
    }
    // Hours Used (totalMilesDriving)
    const hours = Number(fields.header.totalMilesDriving);
    if (isNaN(hours) || hours < 0 || hours > 70) {
      newErrors.totalMilesDriving = 'Must be a number between 0 and 70';
    }
    return newErrors;
  };

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

  // On submit (if you want to add a submit button)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert('Form is valid!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 overflow-x-auto">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <HeaderForm form={header} onChange={handleHeaderChange} errors={errors} />
          <ShippingInfo form={shipping} onChange={handleShippingChange} errors={errors} />
          <RemarksInput value={remarks} onChange={handleRemarksChange} error={errors.remarks} />
          <DailyLogGrid blocks={blocks} setBlocks={setBlocks} />
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow">Validate</button>
        </form>
      </div>
    </div>
  );
}
