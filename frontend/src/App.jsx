import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import ChatSimulator from './pages/ChatSimulator';
import LeadsPage from './pages/LeadsPage';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import CustomersPage from './pages/CustomersPage';
import LiveMonitorPage from './pages/LiveMonitorPage';

const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  if (!state.user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const { state } = useApp();
  return (
    <Routes>
      <Route path="/login" element={state.user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/chat" element={<ChatSimulator />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AnalyticsPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="monitor" element={<LiveMonitorPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
