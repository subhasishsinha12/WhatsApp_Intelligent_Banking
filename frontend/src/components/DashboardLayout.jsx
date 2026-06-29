import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, Ticket, UserCheck, BarChart3,
  Settings, MessageSquare, LogOut, Menu, X, Building2
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/tickets', icon: Ticket, label: 'Tickets' },
  { path: '/customers', icon: UserCheck, label: 'Customers' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin', icon: Settings, label: 'Admin' },
];

export default function DashboardLayout() {
  const { state, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-brand-dark flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-white border-opacity-10">
          <div className="w-8 h-8 bg-brand-whatsapp rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">WhatsApp</p>
              <p className="text-green-400 text-xs">Banking System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`
              }
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}

          <NavLink
            to="/chat"
            target="_blank"
            className={`sidebar-link ${!sidebarOpen ? 'justify-center px-2' : ''}`}
            title="Chat Simulator"
          >
            <MessageSquare size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Chat Simulator</span>}
          </NavLink>
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-white border-opacity-10">
          {sidebarOpen && state.user && (
            <div className="mb-3 px-2">
              <p className="text-white text-sm font-medium truncate">{state.user.name}</p>
              <p className="text-gray-400 text-xs capitalize">{state.user.role?.replace('_', ' ')}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 ${!sidebarOpen ? 'justify-center px-2' : ''}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-gray-800 font-semibold text-sm">
              Branch: {state.user?.branch_code || 'MumbaiMain'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">System Online</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
