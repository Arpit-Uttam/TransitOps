import React, { useState } from 'react';
import { Send, MapPin, Navigation, User, Truck, ClipboardList, CheckCircle } from 'lucide-react';

const INITIAL_TRIPS = [
  { id: 'TRP-401', vehicle: 'VT-7701 (Flatbed)', driver: 'Marcus Vance', origin: 'Terminal A - Houston', destination: 'Logistics Hub - Austin', status: 'Dispatched', departs: '10:30 AM' },
  { id: 'TRP-402', vehicle: 'VT-1109 (Reefer)', driver: 'Sarah Jenkins', origin: 'Port Sector 4 - NOLA', destination: 'Cold Chain Base - Dallas', status: 'In Transit', departs: '08:15 AM' },
];

const AVAILABLE_VEHICLES = ['VT-3302 (Box Truck)', 'VT-5541 (Dry Van)', 'VT-9902 (Flatbed)'];
const AVAILABLE_DRIVERS = ['Elena Rostova', 'Jonathan Briggs'];

export default function TripDispatchPage() {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [dispatchForm, setDispatchForm] = useState({ vehicle: '', driver: '', origin: '', destination: '', departs: '' });
  const [notification, setNotification] = useState(null);

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!dispatchForm.vehicle || !dispatchForm.driver) return;
    const newTrip = { id: `TRP-${Math.floor(100 + Math.random() * 900)}`, ...dispatchForm, status: 'Dispatched' };
    setTrips([newTrip, ...trips]);
    setDispatchForm({ vehicle: '', driver: '', origin: '', destination: '', departs: '' });
    setNotification(`Successfully Dispatched operational run ${newTrip.id}`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Navigation size={18} className="text-brand-500" />Dispatch Control Desk</h2>
            <p className="text-xs text-gray-500 mt-1">Issue routing manifests and assign personnel.</p>
          </div>
          <form onSubmit={handleDispatch} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Select Asset</label>
              <select required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={dispatchForm.vehicle} onChange={e => setDispatchForm({...dispatchForm, vehicle: e.target.value})}>
                <option value="">-- Choose Asset --</option>
                {AVAILABLE_VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Assign Operator</label>
              <select required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={dispatchForm.driver} onChange={e => setDispatchForm({...dispatchForm, driver: e.target.value})}>
                <option value="">-- Choose Driver --</option>
                {AVAILABLE_DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Origin Node</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={dispatchForm.origin} onChange={e => setDispatchForm({...dispatchForm, origin: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Destination Node</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={dispatchForm.destination} onChange={e => setDispatchForm({...dispatchForm, destination: e.target.value})} /></div>
            </div>
            <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Departure Schedule</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={dispatchForm.departs} onChange={e => setDispatchForm({...dispatchForm, departs: e.target.value})} /></div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"><Send size={16} />Commit & Dispatch Run</button>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Live Operations Dispatch Board</h1>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold font-mono">{trips.length} Active Runs</span>
        </div>

        {notification && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-800 dark:text-emerald-400 text-sm">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-500" /><span>{notification}</span>
          </div>
        )}

        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 dark:bg-slate-800 rounded-lg text-brand-600 dark:text-brand-400"><ClipboardList size={20} /></div>
                  <div><span className="text-xs uppercase font-mono tracking-wider text-gray-400">Trip ID</span><h3 className="font-bold text-gray-900 dark:text-white">{trip.id}</h3></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-gray-100">Departs: {trip.departs}</span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${trip.status === 'In Transit' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>{trip.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-950 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Truck size={16} className="text-gray-400" /><span className="font-mono text-xs">{trip.vehicle}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><User size={16} className="text-gray-400" /><span className="font-medium">{trip.driver}</span></div>
              </div>
              <div className="relative flex items-center justify-between pt-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold"><MapPin size={12} className="text-emerald-500" /> Origin</div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white pl-4">{trip.origin}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-400 uppercase font-semibold">Destination <MapPin size={12} className="text-rose-500" /></div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white pr-4">{trip.destination}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
