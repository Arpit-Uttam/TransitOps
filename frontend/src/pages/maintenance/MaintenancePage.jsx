import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, Wrench, ShieldAlert } from 'lucide-react';

export default function MaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', description: '', cost: '' });
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    const res = await api.get('/maintenance');
    setLogs(res.data);
  };

  const fetchVehicles = async () => {
    const res = await api.get('/vehicles');
    setVehicles(res.data.filter(v => v.status !== 'Retired' && v.status !== 'In_Shop'));
  };

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/maintenance?vehicleId=${formData.vehicleId}&description=${formData.description}&cost=${formData.cost}`);
      setShowModal(false);
      fetchLogs();
      fetchVehicles();
      setFormData({ vehicleId: '', description: '', cost: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error scheduling maintenance');
    }
  };

  const handleComplete = async (id) => {
    await api.put(`/maintenance/${id}/complete`);
    fetchLogs();
    fetchVehicles();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Maintenance logs</h1>
          <p className="text-gray-500">Track and schedule active vehicle repairs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-lg shadow-blue-500/10">
          <Wrench className="w-5 h-5" /> Schedule Maintenance
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700/60 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 uppercase tracking-wider text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="text-gray-700 dark:text-gray-200">
                <td className="px-6 py-4 font-medium">{log.vehicle.nameModel} ({log.vehicle.registrationNumber})</td>
                <td className="px-6 py-4">{log.description}</td>
                <td className="px-6 py-4">${log.cost}</td>
                <td className="px-6 py-4">{log.startDate}</td>
                <td className="px-6 py-4">{log.endDate || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'Active' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10'}`}>{log.status}</span>
                </td>
                <td className="px-6 py-4">
                  {log.status === 'Active' && (
                    <button onClick={() => handleComplete(log.id)} className="text-blue-600 hover:text-blue-500 font-semibold transition-all">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 border dark:border-slate-700 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Schedule Maintenance</h2>
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-sm flex gap-3"><ShieldAlert />{error}</div>}

            <select required value={formData.vehicleId} onChange={(e) => setFormData({...formData, vehicleId: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white">
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>)}
            </select>

            <input placeholder="Job Description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            
            <input placeholder="Repair Cost" type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 border dark:border-slate-700 font-semibold py-3 rounded-2xl dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl">Confirm</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
