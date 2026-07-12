import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Truck, Play, CheckCircle, X } from 'lucide-react';

export default function TripDispatchPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selected, setSelected] = useState({ vehicleId: '', driverId: '', cargoWeight: '' });

  const fetchAll = async () => {
    const [tRes, vRes, dRes] = await Promise.all([api.get('/trips'), api.get('/vehicles'), api.get('/drivers')]);
    setTrips(tRes.data);
    setVehicles(vRes.data);
    setDrivers(dRes.data.filter(d => d.status === 'Available'));
  };

  useEffect(() => { fetchAll(); }, []);

  const createTrip = async () => {
    if (!selected.vehicleId || !selected.driverId) return;
    await api.post('/trips', { vehicleId: selected.vehicleId, driverId: selected.driverId, cargoWeight: Number(selected.cargoWeight) });
    setSelected({ vehicleId: '', driverId: '', cargoWeight: '' });
    fetchAll();
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
          <h1 className="text-3xl font-extrabold">Trip Dispatch Board</h1>
          <p className="text-gray-500">Create, dispatch, and monitor active trips</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border dark:border-slate-800">
          <h3 className="font-semibold mb-2">Create Trip</h3>
          <div className="space-y-3">
            <select className="w-full p-2 border rounded" value={selected.vehicleId} onChange={e => setSelected({...selected, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.filter(v => v.status === 'Available').map(v => <option key={v.id} value={v.id}>{v.registrationNumber} — {v.make}</option>)}
            </select>
            <select className="w-full p-2 border rounded" value={selected.driverId} onChange={e => setSelected({...selected, driverId: e.target.value})}>
              <option value="">Select Driver</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name} — {d.licenseNumber}</option>)}
            </select>
            <input className="w-full p-2 border rounded" placeholder="Cargo weight (kg)" value={selected.cargoWeight} onChange={e => setSelected({...selected, cargoWeight: e.target.value})} />
            <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={createTrip}><Truck className="inline mr-2" />Create Trip</button>
          </div>
        </div>

        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-4 border dark:border-slate-800 overflow-auto max-h-[60vh]">
          <h3 className="font-semibold mb-2">All Trips</h3>
          <ul className="space-y-3">
            {trips.map(trip => (
              <li key={trip.id} className="p-3 rounded-lg border dark:border-slate-700 flex justify-between items-center">
                <div>
                  <div className="font-bold">Trip #{trip.id} — {trip.status}</div>
                  <div className="text-sm text-gray-500">Vehicle: {trip.vehicle?.registrationNumber || '—'} • Driver: {trip.driver?.name || '—'}</div>
                  <div className="text-xs text-gray-400">Cargo: {trip.cargoWeight} kg • Planned: {trip.plannedDistance || '—'} km</div>
                </div>
                <div className="flex gap-2">
                  {trip.status === 'Draft' && <button onClick={() => dispatchTrip(trip.id)} className="px-3 py-2 bg-emerald-600 text-white rounded"><Play className="w-4 h-4 inline" /> Dispatch</button>}
                  {trip.status === 'Dispatched' && <button onClick={() => completeTrip(trip.id)} className="px-3 py-2 bg-blue-600 text-white rounded"><CheckCircle className="w-4 h-4 inline" /> Complete</button>}
                  {trip.status !== 'Completed' && <button onClick={() => cancelTrip(trip.id)} className="px-3 py-2 bg-rose-500 text-white rounded"><X className="w-4 h-4 inline" /> Cancel</button>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
