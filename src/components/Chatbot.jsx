import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';

const TOPICS = [
  { key: 'complaint',    label: { en: '📋 Raise Complaint',       hi: '📋 शिकायत दर्ज करें' } },
  { key: 'my complaint', label: { en: '📂 My Complaints',          hi: '📂 मेरी शिकायतें' } },
  { key: 'status',       label: { en: '🔍 Complaint Status',       hi: '🔍 शिकायत स्थिति' } },
  { key: 'fund',         label: { en: '💰 Village Funds',          hi: '💰 ग्राम निधि' } },
  { key: 'expenditure',  label: { en: '📊 Expenditure',            hi: '📊 व्यय' } },
  { key: 'scheme',       label: { en: '🏛️ Government Schemes',     hi: '🏛️ सरकारी योजनाएं' } },
  { key: 'register',     label: { en: '📝 Register',               hi: '📝 पंजीकरण' } },
  { key: 'login',        label: { en: '🔐 Login',                  hi: '🔐 लॉगिन' } },
  { key: 'aadhaar',      label: { en: '🪪 Aadhaar',                hi: '🪪 आधार' } },
  { key: 'otp',          label: { en: '📱 OTP',                    hi: '📱 ओटीपी' } },
  { key: 'panchayat',    label: { en: '🏘️ Panchayat',             hi: '🏘️ पंचायत' } },
  { key: 'help',         label: { en: '❓ Help',                   hi: '❓ मदद' } },
];

const Chatbot = () => {
  const [lang, setLang] = useState('en');

  const greeting = lang === 'hi'
    ? 'नमस्ते! 🙏 मैं प्रगति सहायक हूं। मैं आपको शिकायत, ग्राम निधि, सरकारी योजनाएं, पंजीकरण और अन्य सेवाओं में मदद कर सकता हूं। नीचे से विषय चुनें:'
    : 'Hello! 👋 I\'m the Pragati Assistant. I can help you with complaints, village funds, government schemes, registration, and more. Please select a topic below:';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: greeting }]);
  const [showTopics, setShowTopics] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    const newGreeting = newLang === 'hi'
      ? 'नमस्ते! 🙏 मैं प्रगति सहायक हूं। नीचे से विषय चुनें:'
      : 'Hello! 👋 I\'m the Pragati Assistant. Please select a topic below:';
    setMessages([{ from: 'bot', text: newGreeting }]);
    setShowTopics(true);
  };

  const handleTopic = async (topic) => {
    const userLabel = topic.label[lang];
    setMessages(prev => [...prev, { from: 'user', text: userLabel }]);
    setShowTopics(false);
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: topic.key, lang }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: lang === 'hi' ? 'कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।' : 'Could not connect. Please try again.'
      }]);
    } finally {
      setLoading(false);
      setShowTopics(true);
    }
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gov-blue px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white" />
              <div>
                <p className="text-white font-semibold text-sm leading-none">
                  {lang === 'hi' ? 'प्रगति सहायक' : 'Pragati Assistant'}
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {lang === 'hi' ? 'ऑनलाइन' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full transition-colors"
              >
                {lang === 'en' ? 'हिं' : 'EN'}
              </button>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-gov-blue text-white rounded-br-none'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none px-3 py-2 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Topic Selector */}
          {showTopics && !loading && (
            <div className="p-3 border-t border-slate-100 bg-white">
              <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                <ChevronDown size={12} />
                {lang === 'hi' ? 'विषय चुनें' : 'Select a topic'}
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {TOPICS.map(topic => (
                  <button
                    key={topic.key}
                    onClick={() => handleTopic(topic)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-gov-blue hover:text-white hover:border-gov-blue transition-all text-slate-600 whitespace-nowrap"
                  >
                    {topic.label[lang]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="w-14 h-14 bg-gov-blue text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default Chatbot;
