import React from 'react';
import { Phone, MessageSquare, Edit } from 'lucide-react';

const urgencyColors = {
  hot: 'bg-red-100 text-red-700 border-red-200',
  warm: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cold: 'bg-blue-100 text-blue-700 border-blue-200',
};

const statusColors = {
  new: 'bg-gray-100 text-gray-600',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-600',
};

export default function LeadCard({ lead, onUpdate }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-500">{lead.mobile}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${urgencyColors[lead.urgency] || urgencyColors.cold}`}>
            {lead.urgency?.toUpperCase() || 'COLD'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[lead.status] || statusColors.new}`}>
            {lead.status?.replace('_', ' ')}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Interest:</span> {lead.product_interest}
      </p>
      {lead.notes && <p className="text-xs text-gray-400 mb-3 italic">{lead.notes}</p>}
      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <a
          href={`tel:${lead.mobile}`}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
        >
          <Phone size={12} /> Call
        </a>
        <a
          href={`https://wa.me/91${lead.mobile}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
        >
          <MessageSquare size={12} /> WhatsApp
        </a>
        {onUpdate && (
          <button
            onClick={() => onUpdate(lead)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Edit size={12} /> Update
          </button>
        )}
      </div>
    </div>
  );
}
