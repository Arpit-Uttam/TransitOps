import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '', nameModel: '', type: 'Truck', maxLoadCapacity: '', odometer: '', acquisitionCost: '', region: ''
  });
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/vehicles', formData);
      setShowModal(false);
      fetchVehicles();
      setFormData({ registrationNumber: '', nameModel: '', type: 'Truck', maxLoadCapacity: '', odometer: '', acquisitionCost: '', region: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unique registration number required.');
    }
  };

  const handleRetire = async (id) => {
    if (window.confirm('Retire vehicle from active duty?')) {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Vehicle Registry</h1>
          <p className="text-gray-500">Register and inspect transport vehicles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-lg shadow-blue-500/10">
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4">Reg Number</th>
              <th className="px-6 py-4">Name/Model</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Capacity (kg)</th>
              <th className="px-6 py-4">Odometer (km)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 text-gray-700 dark:text-gray-200">
                <td className="px-6 py-4 font-mono font-semibold">{v.registrationNumber}</td>
                <td className="px-6 py-4 font-medium">{v.nameModel}</td>
                <td className="px-6 py-4">{v.type}</td>
                <td className="px-6 py-4">{v.maxLoadCapacity}</td>
                <td className="px-6 py-4">{v.odometer}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    v.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10' :
                    v.status === 'On_Trip' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10' :
                    v.status === 'In_Shop' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10' : 'bg-red-100 text-red-700 dark:bg-red-500/10'
                  }`}>{v.status}</span>
                </td>
                <td className="px-6 py-4">
                  {v.status !== 'Retired' && (
                    <button onClick={() => handleRetire(v.id)} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-8 border border-gray-100 dark:border-slate-700 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Register New Vehicle</h2>
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-sm flex gap-3"><ShieldAlert />{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Registration Number" required value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
              <input placeholder="Volvo FH16, atc" required value={formData.nameModel} onChange={(e) => setFormData({...formData, nameModel: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white">
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Sedan">Sedan</option>
              </select>
              <input placeholder="Max Load Capacity (kg)" type="number" required value={formData.maxLoadCapacity} onChange={(e) => setFormData({...formData, maxLoadCapacity: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Starting Odometer" type="number" required value={formData.odometer} onChange={(e) => setFormData({...formData, odometer: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
              <input placeholder="Acquisition Cost" type="number" required value={formData.acquisitionCost} onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})} className="border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            </div>

            <input placeholder="Operational Region" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 border dark:border-slate-700 font-semibold py-3 rounded-2xl dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/10">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
