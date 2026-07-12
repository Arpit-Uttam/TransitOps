import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  Wrench, 
  Users, 
  Compass, 
  Receipt, 
  BarChart3, 
  LogOut, 
  Sun, 
  Moon
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Vehicles', to: '/vehicles', icon: Truck },
    { name: 'Maintenance', to: '/maintenance', icon: Wrench },
    { name: 'Drivers', to: '/drivers', icon: Users },
    { name: 'Dispatch Board', to: '/trips', icon: Compass },
    { name: 'Expenses', to: '/expenses', icon: Receipt },
    { name: 'Reports', to: '/reports', icon: BarChart3 }
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide">TransitOps</h1>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase block">Operations Desk</span>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-3 my-4 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
              {user.firstName ? user.firstName[0] : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</h4>
              <span className="text-xs text-gray-400 font-medium truncate block">{user.role?.replace('ROLE_', '').replace('_', ' ')}</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {/* Dark Mode toggle */}
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-all text-left"
        >
          {darkMode ? (
            <>
              <Sun className="w-5 h-5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-indigo-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Log Out */}
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
