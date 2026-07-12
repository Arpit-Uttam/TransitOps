import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Truck,
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Compass,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/kpis');
      setKpis(response.data);
    } catch (err) {
      console.error('Error loading dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  const chartData = [
    { name: 'Jan', utilization: 45, costs: 2400 },
    { name: 'Feb', utilization: 50, costs: 2210 },
    { name: 'Mar', utilization: 55, costs: 2290 },
    { name: 'Apr', utilization: 58, costs: 2000 },
    { name: 'May', utilization: 62, costs: 2181 },
    { name: 'Jun', utilization: 60, costs: 2500 },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Active Vehicles',
      value: kpis?.activeVehicles ?? 0,
      icon: Truck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Available Vehicles',
      value: kpis?.availableVehicles ?? 0,
      icon: Compass,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'In Maintenance',
      value: kpis?.vehiclesInMaintenance ?? 0,
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'Active Trips',
      value: kpis?.activeTrips ?? 0,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',
    },
    {
      label: 'Drivers On Duty',
      value: kpis?.driversOnDuty ?? 0,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10',
    },
    {
      label: 'Fleet Utilization',
      value: `${kpis?.fleetUtilization ?? 0}%`,
      icon: TrendingUp,
      color: 'text-pink-600 bg-pink-50 dark:bg-pink-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time metrics and operations tracker
          </p>
        </div>
        <button
          onClick={fetchKpis}
          className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {c.label}
              </span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {c.value}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.color}`}>
              <c.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 h-96 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Fleet Utilization (%)
          </h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3B82F6"
                  fillOpacity={0.1}
                  fill="url(#colorUv)"
                  strokeWidth={2.5}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 h-96 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Operating Cost Trends ($)
          </h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="costs" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
