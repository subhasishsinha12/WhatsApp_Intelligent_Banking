import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Ticket, MessageSquare, TrendingUp, Flame, Thermometer, Snowflake } from 'lucide-react';
import KPICard from '../components/KPICard';
import { analyticsAPI, leadsAPI } from '../services/api';

const COLORS = ['#006644', '#25D366', '#FF6B35', '#1a1a2e', '#6366f1', '#f59e0b'];

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState(null);
  const [leadsData, setLeadsData] = useState(null);
  const [convData, setConvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kpiRes, leadsRes, convRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getLeads(),
        analyticsAPI.getConversations(),
      ]);
      setKpis(kpiRes.data.data);
      setLeadsData(leadsRes.data.data);
      setConvData(convRes.data.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      // Fallback demo data
      setKpis({ total_leads: 15, new_leads_this_month: 8, conversion_rate: 13.3, open_tickets: 7, critical_tickets: 2, active_conversations: 3, hot_leads: 5, warm_leads: 6, cold_leads: 4 });
    } finally {
      setLoading(false);
    }
  };

  const productChartData = leadsData?.by_product
    ? Object.entries(leadsData.by_product).map(([k, v]) => ({ name: k, count: v }))
    : [
        { name: 'Home Loan', count: 5 },
        { name: 'Auto Loan', count: 4 },
        { name: 'Education Loan', count: 3 },
        { name: 'Fixed Deposit', count: 3 },
        { name: 'NRI Services', count: 2 },
        { name: 'Others', count: 3 },
      ];

  const statusChartData = leadsData?.by_status
    ? Object.entries(leadsData.by_status).map(([k, v]) => ({ name: k, value: v }))
    : [{ name: 'new', value: 7 }, { name: 'contacted', value: 4 }, { name: 'qualified', value: 3 }, { name: 'converted', value: 1 }];

  const dailyData = convData?.daily_volume || Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    count: Math.floor(Math.random() * 50) + 10,
  }));

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Branch: MumbaiMain | Real-time insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Leads" value={kpis?.total_leads || 0} subtitle={`${kpis?.new_leads_this_month || 0} new this month`} icon={Users} color="green" trend={12} />
        <KPICard title="Conversion Rate" value={`${kpis?.conversion_rate || 0}%`} subtitle="Leads converted" icon={TrendingUp} color="blue" trend={3} />
        <KPICard title="Active Conversations" value={kpis?.active_conversations || 0} subtitle="Right now" icon={MessageSquare} color="purple" />
        <KPICard title="Open Tickets" value={kpis?.open_tickets || 0} subtitle={`${kpis?.critical_tickets || 0} critical`} icon={Ticket} color="red" />
      </div>

      {/* Lead urgency mini cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <Flame className="text-red-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-red-700">{kpis?.hot_leads || 0}</p>
            <p className="text-xs text-red-500">Hot Leads</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <Thermometer className="text-yellow-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-yellow-700">{kpis?.warm_leads || 0}</p>
            <p className="text-xs text-yellow-500">Warm Leads</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Snowflake className="text-blue-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-blue-700">{kpis?.cold_leads || 0}</p>
            <p className="text-xs text-blue-500">Cold Leads</p>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product-wise leads bar chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Product-wise Leads</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#006644" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead status pie chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Lead Status Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {statusChartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversation volume line chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Conversation Volume (Last 14 days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#25D366" strokeWidth={2} dot={{ fill: '#006644', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
