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
  Cell,
} from 'recharts';
import { Truck, Users, Calendar, AlertTriangle, TrendingUp, Compass, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    fleetUtilization: 0.0,
  });
  const [loading, setLoading] = useState(true);

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/kpis');
      setKpis(response.data);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
    const interval = setInterval(fetchKpis, 30000);
    return () => clearInterval(interval);
  }, []);

  const trendData = [
    { name: '09:00', utilization: kpis.fleetUtilization * 0.9, cost: 450 },
    { name: '10:00', utilization: kpis.fleetUtilization * 0.95, cost: 680 },
    { name: '11:00', utilization: kpis.fleetUtilization, cost: 920 },
    { name: '12:00', utilization: kpis.fleetUtilization * 1.05, cost: 1100 },
    { name: '13:00', utilization: kpis.fleetUtilization * 0.98, cost: 1250 },
  ];

  const cards = [
    {
      label: 'Active Vehicles',
      value: kpis.activeVehicles,
      change: 'Dispatched on roads',
      icon: Truck,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      label: 'Available Vehicles',
      value: kpis.availableVehicles,
      change: 'Idle in yard',
      icon: Compass,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    {
      label: 'In Maintenance',
      value: kpis.vehiclesInMaintenance,
      change: 'Under mechanical repair',
      icon: AlertTriangle,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    {
      label: 'Active Trips',
      value: kpis.activeTrips,
      change: 'Transit routes running',
      icon: Calendar,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    {
      label: 'Drivers On Duty',
      value: kpis.driversOnDuty,
      change: 'Clocked-in operators',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    },
    {
      label: 'Fleet Utilization',
      value: `${kpis.fleetUtilization}%`,
      change: 'Total asset occupancy',
      icon: TrendingUp,
      color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            TransitOps Control Desk
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Live updates of fleet and route dispatch analytics
          </p>
        </div>
        <button
          onClick={fetchKpis}
          disabled={loading}
          className="p-3 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-all shadow-inner border border-gray-200/40 dark:border-slate-800"
        >
          <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-between`}
          >
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                {c.label}
              </span>
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {c.value}
              </div>
              <span className="text-xs text-gray-400 block">{c.change}</span>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${c.color}`}>
              <c.icon className="w-7 h-7" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 h-96 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Active Utilization Rate (%)
            </h2>
            <p className="text-xs text-gray-400">
              Live tracker monitoring active load operations
            </p>
          </div>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUtil)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/60 h-96 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Hourly Operating Costs ($)
            </h2>
            <p className="text-xs text-gray-400">
              Sum of fuel additions, tolls, and maintenance
            </p>
          </div>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="cost" fill="#6366F1" radius={[8, 8, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#3B82F6' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
