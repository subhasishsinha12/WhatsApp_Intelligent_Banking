import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { chatAPI } from '../services/api';
import ChatBubble from '../components/ChatBubble';

export default function ChatSimulator() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [typing, setTyping] = useState(false);
  const [mobile, setMobile] = useState('9876543210');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const res = await chatAPI.newSession(mobile);
      setSessionId(res.data.session_id);
      // Send initial hi to trigger welcome
      sendMessageToAPI('Hi', res.data.session_id);
    } catch (err) {
      console.error('Failed to create session:', err);
      // Use timestamp as fallback session ID
      const fallbackId = `session_${Date.now()}`;
      setSessionId(fallbackId);
      sendMessageToAPI('Hi', fallbackId);
    }
  };

  const sendMessageToAPI = async (text, sid) => {
    const effectiveSid = sid || sessionId;
    try {
      setTyping(true);

      // Add user message to UI (skip for initial Hi)
      if (text !== 'Hi' || sid !== sessionId) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text,
          isOutgoing: true,
          timestamp: new Date(),
        }]);
      }

      // Small delay for UX
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

      const res = await chatAPI.simulate(text, effectiveSid, mobile);
      const data = res.data;

      if (data.session_id) setSessionId(data.session_id);
      if (data.language) setLanguage(data.language);

      // Add bot responses
      for (let i = 0; i < data.responses.length; i++) {
        await new Promise(r => setTimeout(r, i * 300));
        setMessages(prev => [...prev, {
          id: Date.now() + i,
          text: data.responses[i],
          isOutgoing: false,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⚠️ Connection error. Please ensure the backend server is running on port 5000.\n\nError: ${err.message}`,
        isOutgoing: false,
        timestamp: new Date(),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    sendMessageToAPI(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = async () => {
    if (sessionId) {
      try { await chatAPI.reset(sessionId); } catch {}
    }
    setMessages([]);
    setSessionId(null);
    initSession();
  };

  const quickReplies = ['Hi', '1', '2', '3', '0', 'Balance', 'Loan', 'Help'];

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Phone frame */}
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800">
          <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: '780px' }}>
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
              <a href="/" className="text-white">
                <ArrowLeft size={18} />
              </a>
              <div className="w-9 h-9 bg-green-400 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                🏦
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">WhatsApp Banking</p>
                <p className="text-green-200 text-xs">
                  {typing ? 'typing...' : 'online'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Phone size={16} />
                <Video size={16} />
                <MoreVertical size={16} />
              </div>
            </div>

            {/* Controls bar */}
            <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white flex-1 max-w-[120px]"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white flex-1"
              />
              <button
                onClick={handleReset}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                title="Reset conversation"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-bg flex-1 overflow-y-auto px-3 py-3" style={{ height: 'calc(100% - 175px)' }}>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400 text-xs">
                    <p className="text-3xl mb-2">🏦</p>
                    <p>Starting WhatsApp Banking...</p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.text}
                  isOutgoing={msg.isOutgoing}
                  timestamp={msg.timestamp}
                />
              ))}

              {typing && (
                <div className="flex justify-start mb-2">
                  <div className="message-bubble-received px-3 py-2 rounded-lg">
                    <div className="flex gap-1 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="bg-[#f0f2f5] px-2 py-1.5 flex gap-1.5 overflow-x-auto border-t border-gray-200 scrollbar-hide">
              {quickReplies.map((r) => (
                <button
                  key={r}
                  onClick={() => { setInput(r); }}
                  className="flex-shrink-0 text-xs bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-100"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="bg-[#f0f2f5] px-2 pb-3 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full border border-gray-300 flex items-center px-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    rows={1}
                    className="flex-1 py-2 text-sm resize-none outline-none max-h-20 bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <Send size={16} className="text-white ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Link to dashboard */}
        <div className="text-center mt-4">
          <a href="/login" className="text-white text-xs opacity-70 hover:opacity-100">
            Staff Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
