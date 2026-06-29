import React, { useEffect, useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { ticketsAPI } from '../services/api';

const PRIORITY_STYLES = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const STATUS_STYLES = {
  open: 'badge-open',
  in_progress: 'badge-in-progress',
  resolved: 'badge-resolved',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  useEffect(() => { loadTickets(); }, [filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketsAPI.getAll(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)));
      setTickets(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (ticket, status) => {
    try {
      const res = await ticketsAPI.update(ticket.id, { status });
      setTickets(prev => prev.map(t => t.id === ticket.id ? res.data.data : t));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Tickets</h1>
          <p className="text-gray-500 text-sm mt-0.5">{tickets.length} tickets</p>
        </div>
        <button onClick={loadTickets} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><RefreshCw size={16} /></button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none">
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Open', count: tickets.filter(t => t.status === 'open').length, color: 'bg-gray-50 border-gray-200' },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length, color: 'bg-yellow-50 border-yellow-200' },
          { label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length, color: 'bg-green-50 border-green-200' },
          { label: 'Critical', count: tickets.filter(t => t.priority === 'critical').length, color: 'bg-red-50 border-red-200' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold text-gray-800">{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Ticket No.</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs text-gray-700">{ticket.ticket_number}</td>
                    <td className="table-cell text-gray-700">{ticket.category}</td>
                    <td className="table-cell max-w-xs">
                      <p className="text-gray-700 truncate">{ticket.description}</p>
                    </td>
                    <td className="table-cell">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority] || ''}`}>
                        {ticket.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket, e.target.value)}
                        className="text-xs border-0 bg-transparent cursor-pointer focus:outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="table-cell text-gray-400 text-xs">
                      {new Date(ticket.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No tickets found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
