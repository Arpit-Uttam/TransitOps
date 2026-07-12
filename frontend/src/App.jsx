import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import VehicleListPage from './pages/vehicles/VehicleListPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import DriverListPage from './pages/drivers/DriverListPage';
import TripDispatchPage from './pages/trips/TripDispatchPage';
import ExpenseTrackerPage from './pages/expenses/ExpenseTrackerPage';
import ReportsPage from './pages/reports/ReportsPage';

// Import Components
import Sidebar from './components/Sidebar';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Layout wrapper
function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main dashboard content area */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/drivers" element={<DriverListPage />} />
            <Route path="/trips" element={<TripDispatchPage />} />
            <Route path="/expenses" element={<ExpenseTrackerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Route Gate Guard
function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Guard
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login portal */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected operations platform */}
          <Route 
            path="/*" 
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
