import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { analyticsAPI } from '../services/api';

const STATE_COLORS = {
  MAIN_MENU: 'bg-green-100 text-green-800',
  AUTH_OTP: 'bg-yellow-100 text-yellow-800',
  LOANS_MENU: 'bg-blue-100 text-blue-800',
  COMPLAINT: 'bg-red-100 text-red-800',
  LEAD_CALLBACK: 'bg-purple-100 text-purple-800',
};

export default function LiveMonitorPage() {
  const [data, setData] = useState({ active_sessions: 0, total_sessions: 0, sessions: [] });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLive = async () => {
    try {
      const res = await analyticsAPI.getLive();
      setData(res.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Conversation Monitor</h1>
          <p className="text-sm text-gray-500">
            Auto-refreshes every 10s {lastUpdated && `· Last: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <button onClick={fetchLive} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          Refresh Now
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{data.active_sessions}</div>
          <div className="text-gray-500 text-sm">Active Sessions (30 min)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{data.total_sessions}</div>
          <div className="text-gray-500 text-sm">Total Sessions Today</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border-l-4 border-orange-500">
          <div className="text-3xl font-bold text-orange-600">
            {data.total_sessions > 0 ? Math.round((data.active_sessions / data.total_sessions) * 100) : 0}%
          </div>
          <div className="text-gray-500 text-sm">Active Rate</div>
        </div>
      </div>

      {/* Sessions table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
          <span className="font-semibold text-gray-700">Active Conversations</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : data.sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No active conversations right now.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Current State</th>
                <th className="px-6 py-3 text-left">Language</th>
                <th className="px-6 py-3 text-left">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.sessions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{s.mobile}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATE_COLORS[s.state] || 'bg-gray-100 text-gray-700'}`}>
                      {s.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{s.language || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(s.last_activity).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
