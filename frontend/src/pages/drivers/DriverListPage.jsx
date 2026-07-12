import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, ShieldAlert, Award, Calendar, AlertCircle } from 'lucide-react';

export default function DriverListPage() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' });
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const expiry = new Date(formData.licenseExpiryDate);
    if (expiry <= new Date()) {
      setError("Cannot register drivers with expired driving licenses.");
      return;
    }
    try {
      await api.post('/drivers', formData);
      setShowModal(false);
      fetchDrivers();
      setFormData({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Driving License Number must be unique.');
    }
  };

  // Helper: check if license expires within 30 days
  const getLicenseWarning = (dateStr) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { isExpired: true, text: 'Expired' };
    if (diffDays <= 30) return { isExpiringSoon: true, text: `Expiring in ${diffDays} days` };
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Driver Roster</h1>
          <p className="text-gray-500">Monitor driver profiles, safety rankings, and licensing compliance</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-blue-500/10">
          <Plus className="w-5 h-5" /> Add Driver
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700/60 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 uppercase tracking-wider text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">License Number</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Safety Score</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {drivers.map((d) => {
              const warning = getLicenseWarning(d.licenseExpiryDate);
              return (
                <tr key={d.id} className="text-gray-700 dark:text-gray-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="px-6 py-4 font-medium">{d.name}</td>
                  <td className="px-6 py-4 font-mono font-semibold">{d.licenseNumber}</td>
                  <td className="px-6 py-4">{d.licenseCategory}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-medium ${warning?.isExpired ? 'text-red-500 font-bold' : ''}`}>
                        {d.licenseExpiryDate}
                      </span>
                      {warning && (
                        <span className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${
                          warning.isExpired ? 'text-red-500' : 'text-amber-500'
                        }`}>
                          <AlertCircle className="w-3 h-3" /> {warning.text}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{d.contactNumber}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                      <Award className={`w-4 h-4 ${
                        d.safetyScore >= 85 ? 'text-emerald-500' : 
                        d.safetyScore >= 60 ? 'text-amber-500' : 'text-red-500'
                      }`} />
                      {d.safetyScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      d.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10' :
                      d.status === 'On_Trip' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10' : 'bg-red-100 text-red-700 dark:bg-red-500/10'
                    }`}>{d.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 border dark:border-slate-700 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Register Driver</h2>
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-sm flex gap-3"><ShieldAlert />{error}</div>}

            <input placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="License Number" required value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="License Category" required value={formData.licenseCategory} onChange={(e) => setFormData({...formData, licenseCategory: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="Expiry Date" type="date" required value={formData.licenseExpiryDate} onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="Contact Number" required value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 border dark:border-slate-700 font-semibold py-3 rounded-2xl dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl">Register</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

