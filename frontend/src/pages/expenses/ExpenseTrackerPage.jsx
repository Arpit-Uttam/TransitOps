import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, ShieldAlert, Receipt } from 'lucide-react';

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [fuelData, setFuelData] = useState({ vehicleId: '', liters: '', cost: '' });
  const [expData, setExpData] = useState({ vehicleId: '', type: 'Toll', amount: '', description: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    const [e, v] = await Promise.all([
      api.get('/expenses'),
      api.get('/vehicles')
    ]);
    setExpenses(e.data);
    setVehicles(v.data.filter(vh => vh.status !== 'Retired'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/fuel?vehicleId=${fuelData.vehicleId}&liters=${fuelData.liters}&cost=${fuelData.cost}`);
      setShowFuelModal(false);
      fetchData();
      setFuelData({ vehicleId: '', liters: '', cost: '' });
    } catch (err) {
      setError('Invalid entry payload');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/expenses?vehicleId=${expData.vehicleId}&type=${expData.type}&amount=${expData.amount}&description=${expData.description}`);
      setShowExpenseModal(false);
      fetchData();
      setExpData({ vehicleId: '', type: 'Toll', amount: '', description: '' });
    } catch (err) {
      setError('Invalid entry payload');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Expense Ledger</h1>
          <p className="text-gray-500">Record fuel purchases and operational route costs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFuelModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-blue-500/10">
            Log Fuel
          </button>
          <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-500/10">
            Log Expense
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700/60 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 uppercase tracking-wider text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {expenses.map((e) => (
              <tr key={e.id} className="text-gray-700 dark:text-gray-200">
                <td className="px-6 py-4 font-medium">{e.vehicle.nameModel} ({e.vehicle.registrationNumber})</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    e.type === 'Fuel' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10' :
                    e.type === 'Maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10'
                  }`}>{e.type}</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${e.amount}</td>
                <td className="px-6 py-4">{e.expenseDate}</td>
                <td className="px-6 py-4 text-gray-400">{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFuelModal && (
        <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <form onSubmit={handleFuelSubmit} className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-8 border dark:border-slate-700 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Log Fuel Addition</h2>
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-sm flex gap-3"><ShieldAlert />{error}</div>}

            <select required value={fuelData.vehicleId} onChange={(e) => setFuelData({...fuelData, vehicleId: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white">
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>)}
            </select>
            <input placeholder="Liters Added" type="number" required value={fuelData.liters} onChange={(e) => setFuelData({...fuelData, liters: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="Total Cost ($)" type="number" required value={fuelData.cost} onChange={(e) => setFuelData({...fuelData, cost: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowFuelModal(false)} className="flex-1 border dark:border-slate-700 font-semibold py-3 rounded-2xl dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl">Save</button>
            </div>
          </form>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <form onSubmit={handleExpenseSubmit} className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-8 border dark:border-slate-700 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Log Operational Cost</h2>
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-sm flex gap-3"><ShieldAlert />{error}</div>}

            <select required value={expData.vehicleId} onChange={(e) => setExpData({...expData, vehicleId: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white">
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>)}
            </select>
            <select required value={expData.type} onChange={(e) => setExpData({...expData, type: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white">
              <option value="Toll">Toll</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
            <input placeholder="Amount ($)" type="number" required value={expData.amount} onChange={(e) => setExpData({...expData, amount: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />
            <input placeholder="Expense Description" required value={expData.description} onChange={(e) => setExpData({...expData, description: e.target.value})} className="w-full border dark:border-slate-700 bg-transparent rounded-2xl p-3 text-sm focus:outline-none dark:text-white" />

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 border dark:border-slate-700 font-semibold py-3 rounded-2xl dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}