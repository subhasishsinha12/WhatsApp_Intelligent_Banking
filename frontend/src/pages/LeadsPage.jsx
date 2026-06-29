import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, Edit, Plus, Filter, RefreshCw } from 'lucide-react';
import { leadsAPI } from '../services/api';

const URGENCY_STYLES = {
  hot: 'badge-hot',
  warm: 'badge-warm',
  cold: 'badge-cold',
};

const STATUS_STYLES = {
  new: 'badge-new',
  contacted: 'bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full',
  qualified: 'bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full',
  converted: 'badge-converted',
  lost: 'bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ urgency: '', status: '' });
  const [editLead, setEditLead] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await leadsAPI.getAll(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)));
      setLeads(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (lead, newStatus) => {
    try {
      const res = await leadsAPI.update(lead.id, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === lead.id ? res.data.data : l));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{leads.length} total leads</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadLeads} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-brand-green text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800">
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <select
          value={filters.urgency}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Urgency</option>
          <option value="hot">🔥 Hot</option>
          <option value="warm">🌡️ Warm</option>
          <option value="cold">❄️ Cold</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading leads...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Product Interest</th>
                  <th className="table-header">Urgency</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-400">{lead.mobile}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{lead.product_interest}</span>
                      {lead.notes && <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{lead.notes}</p>}
                    </td>
                    <td className="table-cell">
                      <span className={URGENCY_STYLES[lead.urgency] || 'badge-cold'}>
                        {lead.urgency === 'hot' ? '🔥' : lead.urgency === 'warm' ? '🌡️' : '❄️'} {lead.urgency?.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead, e.target.value)}
                        className={`text-xs border-0 bg-transparent cursor-pointer focus:outline-none font-medium ${STATUS_STYLES[lead.status] || ''}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="table-cell text-gray-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${lead.mobile}`} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Call">
                          <Phone size={14} />
                        </a>
                        <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noreferrer" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="WhatsApp">
                          <MessageSquare size={14} />
                        </a>
                        <button onClick={() => setEditLead(lead)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editLead && (
        <LeadEditModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSave={async (data) => {
            const res = await leadsAPI.update(editLead.id, data);
            setLeads(prev => prev.map(l => l.id === editLead.id ? res.data.data : l));
            setEditLead(null);
          }}
        />
      )}

      {/* Add Lead Modal */}
      {showForm && (
        <AddLeadModal
          onClose={() => setShowForm(false)}
          onSave={async (data) => {
            const res = await leadsAPI.create(data);
            setLeads(prev => [res.data.data, ...prev]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function LeadEditModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState({ status: lead.status, urgency: lead.urgency, notes: lead.notes || '' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-bold text-gray-900 mb-4">Update Lead: {lead.name}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 bg-brand-green text-white rounded-lg text-sm hover:bg-green-800">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', mobile: '', product_interest: 'Home Loan', urgency: 'cold', notes: '' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-bold text-gray-900 mb-4">Add New Lead</h3>
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Customer name' },
            { key: 'mobile', label: 'Mobile', type: 'tel', placeholder: '10-digit mobile' },
            { key: 'notes', label: 'Notes', type: 'text', placeholder: 'Optional notes' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Interest</label>
            <select value={form.product_interest} onChange={(e) => setForm({ ...form, product_interest: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {['Home Loan', 'Auto Loan', 'Education Loan', 'Personal Loan', 'Fixed Deposit', 'NRI Services', 'Credit Card', 'Insurance'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 bg-brand-green text-white rounded-lg text-sm hover:bg-green-800">Create Lead</button>
        </div>
      </div>
    </div>
  );
}
