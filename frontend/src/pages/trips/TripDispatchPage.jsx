import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Truck, Play, CheckCircle, X } from 'lucide-react';

export default function TripDispatchPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selected, setSelected] = useState({ 
    vehicleId: '', 
    driverId: '', 
    cargoWeight: '', 
    source: '', 
    destination: '', 
    plannedDistance: '' 
  });
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [tRes, vRes, dRes] = await Promise.all([
        api.get('/trips'), 
        api.get('/vehicles'), 
        api.get('/drivers')
      ]);
      setTrips(tRes.data);
      setVehicles(vRes.data);
      setDrivers(dRes.data.filter(d => d.status === 'Available'));
    } catch (err) {
      console.error("Error fetching dispatch data:", err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const createTrip = async () => {
    setError('');
    if (!selected.vehicleId || !selected.driverId || !selected.source || !selected.destination || !selected.plannedDistance) {
      setError("Please fill in all details before scheduling a trip.");
      return;
    }
    
    try {
      await api.post('/trips', { 
        vehicle: { id: Number(selected.vehicleId) }, 
        driver: { id: Number(selected.driverId) }, 
        cargoWeight: Number(selected.cargoWeight),
        source: selected.source,
        destination: selected.destination,
        plannedDistance: Number(selected.plannedDistance)
      });
      setSelected({ vehicleId: '', driverId: '', cargoWeight: '', source: '', destination: '', plannedDistance: '' });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating trip: check capacities or expired licenses.");
    }
  };

  const dispatchTrip = async (tripId) => {
    await api.put(`/trips/${tripId}/dispatch`);
    fetchAll();
  };

  const completeTrip = async (tripId) => {
    // for demo, use approximate values
    await api.put(`/trips/${tripId}/complete?actualDistance=120&fuelConsumed=18`);
    fetchAll();
  };

  const cancelTrip = async (tripId) => {
    await api.put(`/trips/${tripId}/cancel`);
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Trip Dispatch Board</h1>
          <p className="text-gray-500">Create, dispatch, and monitor active trips</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-2xl text-sm border border-red-200 dark:border-red-900/40">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-lg dark:text-white">Create Trip Route</h3>
          <div className="space-y-3">
            <select className="w-full p-3 border dark:border-slate-700 rounded-2xl bg-transparent dark:text-white text-sm focus:outline-none" value={selected.vehicleId} onChange={e => setSelected({...selected, vehicleId: e.target.value})}>
              <option value="" className="dark:bg-slate-900">Select Available Vehicle</option>
              {vehicles.filter(v => v.status === 'Available').map(v => <option key={v.id} value={v.id} className="dark:bg-slate-900">{v.registrationNumber} — {v.nameModel}</option>)}
            </select>
            
            <select className="w-full p-3 border dark:border-slate-700 rounded-2xl bg-transparent dark:text-white text-sm focus:outline-none" value={selected.driverId} onChange={e => setSelected({...selected, driverId: e.target.value})}>
              <option value="" className="dark:bg-slate-900">Select Available Driver</option>
              {drivers.map(d => <option key={d.id} value={d.id} className="dark:bg-slate-900">{d.name} — {d.licenseNumber}</option>)}
            </select>

            <input className="w-full p-3 border dark:border-slate-700 bg-transparent rounded-2xl dark:text-white text-sm focus:outline-none" type="number" placeholder="Cargo Weight (kg)" value={selected.cargoWeight} onChange={e => setSelected({...selected, cargoWeight: e.target.value})} />
            <input className="w-full p-3 border dark:border-slate-700 bg-transparent rounded-2xl dark:text-white text-sm focus:outline-none" placeholder="Source Location" value={selected.source} onChange={e => setSelected({...selected, source: e.target.value})} />
            <input className="w-full p-3 border dark:border-slate-700 bg-transparent rounded-2xl dark:text-white text-sm focus:outline-none" placeholder="Destination Location" value={selected.destination} onChange={e => setSelected({...selected, destination: e.target.value})} />
            <input className="w-full p-3 border dark:border-slate-700 bg-transparent rounded-2xl dark:text-white text-sm focus:outline-none" type="number" placeholder="Planned Distance (km)" value={selected.plannedDistance} onChange={e => setSelected({...selected, plannedDistance: e.target.value})} />
            
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm" onClick={createTrip}>
              <Truck className="w-4 h-4" /> Create Trip
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border dark:border-slate-800 overflow-auto max-h-[65vh]">
          <h3 className="font-extrabold text-lg mb-4 dark:text-white">Active Dispatch Logs</h3>
          <ul className="space-y-3">
            {trips.length === 0 ? (
              <div className="text-gray-400 dark:text-slate-500 text-sm py-4 text-center">No trip routes logged.</div>
            ) : (
              trips.map(trip => (
                <li key={trip.id} className="p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-800/10">
                  <div>
                    <div className="font-bold dark:text-white">Trip #{trip.id} — 
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        trip.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800' :
                        trip.status === 'Dispatched' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10' :
                        trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10' : 'bg-red-100 text-red-700 dark:bg-red-500/10'
                      }`}>{trip.status}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1.5">Vehicle: {trip.vehicle?.nameModel} ({trip.vehicle?.registrationNumber || '—'}) • Driver: {trip.driver?.name || '—'}</div>
                    <div className="text-xs text-gray-400 mt-1">Cargo: {trip.cargoWeight} kg • Route: {trip.source} → {trip.destination} ({trip.plannedDistance || '—'} km)</div>
                  </div>
                  <div className="flex gap-2">
                    {trip.status === 'Draft' && <button onClick={() => dispatchTrip(trip.id)} className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all">Dispatch</button>}
                    {trip.status === 'Dispatched' && <button onClick={() => completeTrip(trip.id)} className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all">Complete</button>}
                    {trip.status !== 'Completed' && trip.status !== 'Cancelled' && <button onClick={() => cancelTrip(trip.id)} className="px-3.5 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white rounded-xl transition-all">Cancel</button>}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
