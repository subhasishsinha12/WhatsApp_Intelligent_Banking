import React, { useState, useEffect } from 'react';
import { productsAPI, faqsAPI, campaignsAPI, staffAPI } from '../services/api';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const TABS = ['Products', 'FAQs', 'Campaigns', 'Staff'];

export default function AdminPage() {
  const [tab, setTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'Products') {
        const res = await productsAPI.getAll();
        setProducts(res.data.data);
      } else if (tab === 'FAQs') {
        const res = await faqsAPI.getAll();
        setFaqs(res.data.data);
      } else if (tab === 'Campaigns') {
        const res = await campaignsAPI.getAll();
        setCampaigns(res.data.data);
      } else if (tab === 'Staff') {
        const res = await staffAPI.getAll();
        setStaff(res.data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage system configuration</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 flex gap-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
      ) : (
        <>
          {tab === 'Products' && <ProductsTab products={products} onRefresh={loadData} />}
          {tab === 'FAQs' && <FAQsTab faqs={faqs} onRefresh={loadData} />}
          {tab === 'Campaigns' && <CampaignsTab campaigns={campaigns} onRefresh={loadData} />}
          {tab === 'Staff' && <StaffTab staff={staff} onRefresh={loadData} />}
        </>
      )}
    </div>
  );
}

function ProductsTab({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map(p => (
        <div key={p.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">{p.category}</span>
            </div>
            {p.interest_rate && (
              <span className="text-lg font-bold text-brand-green">{p.interest_rate}%</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">{p.description}</p>
          {p.features && (
            <div className="space-y-1">
              {Object.entries(p.features).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-gray-400 capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="text-gray-700 font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {p.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQsTab({ faqs, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'account', language: 'en', keywords: '' });

  const handleCreate = async () => {
    try {
      await faqsAPI.create({ ...form, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) });
      setShowForm(false);
      setForm({ question: '', answer: '', category: 'account', language: 'en', keywords: '' });
      onRefresh();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await faqsAPI.delete(id);
      onRefresh();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-brand-green text-white text-sm px-4 py-2 rounded-lg">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">New FAQ</h3>
          <div className="space-y-3">
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <div className="grid grid-cols-3 gap-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {['account', 'loans', 'deposits', 'cards', 'insurance', 'nri', 'digital', 'transfers', 'support'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
              <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="keywords, comma, separated" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2 bg-brand-green text-white rounded-lg text-sm">Save FAQ</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map(faq => (
          <div key={faq.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{faq.category}</span>
                  <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full uppercase">{faq.language}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(faq.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignsTab({ campaigns }) {
  return (
    <div className="space-y-3">
      {campaigns.map(c => (
        <div key={c.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{c.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {c.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.message_template}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Segment: <span className="text-gray-600">{c.target_segment}</span></span>
            <span>Start: <span className="text-gray-600">{new Date(c.start_date).toLocaleDateString('en-IN')}</span></span>
            <span>End: <span className="text-gray-600">{new Date(c.end_date).toLocaleDateString('en-IN')}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StaffTab({ staff }) {
  const roleColors = {
    branch_head: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
    rm: 'bg-green-100 text-green-700',
    officer: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Mobile</th>
            <th className="table-header">Role</th>
            <th className="table-header">Branch</th>
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staff.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium text-gray-900">{s.name}</td>
              <td className="table-cell text-gray-600 text-xs">{s.email}</td>
              <td className="table-cell text-gray-600">{s.mobile}</td>
              <td className="table-cell">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColors[s.role] || 'bg-gray-100 text-gray-600'}`}>
                  {s.role?.replace('_', ' ')}
                </span>
              </td>
              <td className="table-cell text-gray-600">{s.branch_code}</td>
              <td className="table-cell">
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
