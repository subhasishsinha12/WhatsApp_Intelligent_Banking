import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';
import { Building2, Eye, EyeOff, MessageSquare } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { email: 'rajesh.kumar@bank.com', role: 'Branch Head' },
    { email: 'amit.patel@bank.com', role: 'RM' },
    { email: 'priya.sharma@bank.com', role: 'Admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form.email, form.password);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email) => {
    setForm({ email, password: 'password123' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-gray-900 to-brand-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-whatsapp rounded-2xl mb-4 shadow-lg">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">WhatsApp Banking</h1>
          <p className="text-gray-400 mt-1">Branch Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Login</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your.email@bank.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-green-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3 font-medium">DEMO ACCOUNTS (password: password123)</p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc.email)}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg flex justify-between items-center transition-colors"
                >
                  <span className="text-gray-700">{acc.email}</span>
                  <span className="text-gray-400">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat simulator link */}
          <div className="mt-4 text-center">
            <a
              href="/chat"
              className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-800 font-medium"
            >
              <MessageSquare size={12} />
              Try WhatsApp Chat Simulator (no login needed)
            </a>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          AI-Powered WhatsApp Banking System v1.0
        </p>
      </div>
    </div>
  );
}
