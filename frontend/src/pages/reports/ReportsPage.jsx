import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, RefreshCw, BarChart, ArrowUpDown } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('roi');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/roi');
      setReports(res.data);
    } catch (err) {
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = () => {
    window.open('/api/reports/export/csv', '_blank');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Fleet Profitability & Efficiency</h1>
          <p className="text-gray-500">Overview of operational costs, ROI yields, and fuel metrics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchReports} className="p-3 bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl hover:bg-gray-100 transition-all">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all">
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700/60 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 uppercase tracking-wider text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('nameModel')}>
                <div className="flex items-center gap-2">Vehicle <ArrowUpDown className="w-4 h-4" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('fuelCost')}>
                <div className="flex items-center gap-2">Fuel Costs <ArrowUpDown className="w-4 h-4" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('maintenanceCost')}>
                <div className="flex items-center gap-2">Maint Costs <ArrowUpDown className="w-4 h-4" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('revenue')}>
                <div className="flex items-center gap-2">Revenue <ArrowUpDown className="w-4 h-4" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('roi')}>
                <div className="flex items-center gap-2">ROI Value <ArrowUpDown className="w-4 h-4" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('fuelEfficiency')}>
                <div className="flex items-center gap-2">Efficiency <ArrowUpDown className="w-4 h-4" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">Loading fleet metrics...</td>
              </tr>
            ) : sortedReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">No vehicle data logged.</td>
              </tr>
            ) : (
              sortedReports.map((r) => (
                <tr key={r.vehicleId} className="text-gray-700 dark:text-gray-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="px-6 py-4 font-semibold">{r.nameModel} ({r.registrationNumber})</td>
                  <td className="px-6 py-4 font-medium">${r.fuelCost.toFixed(2)}</td>
                  <td className="px-6 py-4 font-medium">${r.maintenanceCost.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${r.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-bold ${r.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {(r.roi * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{r.fuelEfficiency} km/L</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}