import React from 'react';
import { CheckCheck } from 'lucide-react';

export default function ChatBubble({ message, isOutgoing, timestamp }) {
  const formatMessage = (text) => {
    // Convert *bold*, _italic_, line breaks
    return text
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-2 animate-fadeIn`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
          isOutgoing
            ? 'message-bubble-sent'
            : 'message-bubble-received'
        }`}
      >
        <div
          className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
        <div className={`flex items-center gap-1 mt-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400">
            {timestamp ? new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          {isOutgoing && <CheckCheck size={12} className="text-blue-500" />}
        </div>
      </div>
    </div>
  );
}
