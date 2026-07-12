import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, RefreshCw, BarChart } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/roi');
      setReports(res.data);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Operational Reports</h1>
          <p className="text-gray-500">Track fuel efficiency rates and asset ROI values</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700/60 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-700 uppercase tracking-wider text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/30">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Fuel Costs</th>
              <th className="px-6 py-4">Maint Costs</th>
              <th className="px-6 py-4">Total Revenue</th>
              <th className="px-6 py-4">ROI Value</th>
              <th className="px-6 py-4">Fuel Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
            {reports.map((r) => (
              <tr key={r.vehicleId} className="text-gray-700 dark:text-gray-200">
                <td className="px-6 py-4 font-semibold">{r.nameModel} ({r.registrationNumber})</td>
                <td className="px-6 py-4 font-medium">${r.fuelCost}</td>
                <td className="px-6 py-4 font-medium">${r.maintenanceCost}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">${r.revenue}</td>
                <td className="px-6 py-4">
                  <span className={`font-mono font-bold ${r.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {(r.roi * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{r.fuelEfficiency} km/L</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}