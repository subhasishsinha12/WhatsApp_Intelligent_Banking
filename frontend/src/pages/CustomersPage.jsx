import React, { useEffect, useState } from 'react';
import { customersAPI } from '../services/api';
import { RefreshCw, User } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await customersAPI.getAll();
      setCustomers(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search) ||
    c.account_number?.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">{customers.length} registered customers</p>
        </div>
        <button onClick={loadCustomers} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><RefreshCw size={16} /></button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, mobile, or account number..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Mobile</th>
                  <th className="table-header">Account Number</th>
                  <th className="table-header">Language</th>
                  <th className="table-header">Balance</th>
                  <th className="table-header">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-600">{c.mobile}</td>
                    <td className="table-cell font-mono text-xs text-gray-600">{c.account_number}</td>
                    <td className="table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">{c.language || 'en'}</span>
                    </td>
                    <td className="table-cell font-medium text-gray-900">
                      ₹{(c.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="table-cell text-gray-400 text-xs">
                      {new Date(c.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
