import React, { useState } from 'react';
import { UserPlus, Search, AlertTriangle, ShieldCheck, FileText, Phone, Mail, Clock } from 'lucide-react';

const INITIAL_DRIVERS = [
  { id: 1, name: 'Marcus Vance', licenseNo: 'DL-98765432', status: 'Active', renewalDate: '2026-11-14', phone: '+1 (555) 234-5678', email: 'm.vance@transitops.com', healthStatus: 'Fit' },
  { id: 2, name: 'Sarah Jenkins', licenseNo: 'DL-45612378', status: 'On Trip', renewalDate: '2026-08-02', phone: '+1 (555) 876-5432', email: 's.jenkins@transitops.com', healthStatus: 'Fit' },
  { id: 3, name: 'David Kojo', licenseNo: 'DL-11223344', status: 'Suspended', renewalDate: '2026-02-15', phone: '+1 (555) 345-6789', email: 'd.kojo@transitops.com', healthStatus: 'Pending Review' },
  { id: 4, name: 'Elena Rostova', licenseNo: 'DL-77665544', status: 'Active', renewalDate: '2026-07-28', phone: '+1 (555) 901-2345', email: 'e.rostova@transitops.com', healthStatus: 'Fit' },
];

export default function DriverListPage() {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', licenseNo: '', phone: '', email: '', renewalDate: '' });

  const isExpiringSoon = (dateStr) => {
    const renewal = new Date(dateStr);
    const today = new Date('2026-07-12');
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const handleCreateDriver = (e) => {
    e.preventDefault();
    const created = { ...newDriver, id: Date.now(), status: 'Active', healthStatus: 'Fit' };
    setDrivers([created, ...drivers]);
    setIsModalOpen(false);
    setNewDriver({ name: '', licenseNo: '', phone: '', email: '', renewalDate: '' });
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Driver Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage personnel rosters, track compliance, and monitor license status.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
          <UserPlus size={18} /> Onboard Driver
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drivers.filter(d => isExpiringSoon(d.renewalDate)).map(driver => (
          <div key={driver.id} className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-400">
            <AlertTriangle className="shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="text-sm flex-1"><span className="font-semibold">{driver.name}</span>'s commercial driver license (<span className="font-mono">{driver.licenseNo}</span>) expires soon on <span className="font-semibold">{driver.renewalDate}</span>. Action required.</div>
          </div>
        ))}
      </div>

      <div className="flex items-center max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20">
        <Search className="text-gray-400 mr-2" size={18} />
        <input type="text" placeholder="Search by name or license number..." className="w-full bg-transparent border-none text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <div key={driver.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            <div className="p-5 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{driver.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 mt-1"><FileText size={12} />{driver.licenseNo}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${driver.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : driver.status === 'On Trip' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'}`}>{driver.status}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>{driver.phone}</span></div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /><span className="truncate">{driver.email}</span></div>
                <div className="flex justify-between text-xs mt-4 pt-2 border-t border-dashed border-gray-100 dark:border-slate-800">
                  <div className="flex flex-col"><span className="text-gray-400">License Renewal</span><span className={`font-semibold mt-0.5 ${isExpiringSoon(driver.renewalDate) ? 'text-amber-600' : 'text-gray-700 dark:text-gray-200'}`}>{driver.renewalDate}</span></div>
                  <div className="flex flex-col items-end"><span className="text-gray-400">Medical Clearance</span><span className="flex items-center gap-1 mt-0.5 font-medium text-gray-700 dark:text-gray-200">{driver.healthStatus === 'Fit' ? <ShieldCheck size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}{driver.healthStatus}</span></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Onboard New Operator</h2></div>
            <form onSubmit={handleCreateDriver} className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Name</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">License Number</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white" value={newDriver.licenseNo} onChange={e => setNewDriver({...newDriver, licenseNo: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Phone</label><input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email</label><input type="email" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={newDriver.email} onChange={e => setNewDriver({...newDriver, email: e.target.value})} /></div>
              </div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">License Expiration Date</label><input type="date" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white" value={newDriver.renewalDate} onChange={e => setNewDriver({...newDriver, renewalDate: e.target.value})} /></div>
              <div className="flex gap-3 justify-end pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">Save Driver</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
