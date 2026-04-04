import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Mail, MapPin, Search, ChevronDown, BookOpen, AlertCircle, FileText } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-blue-300">
      <button 
        onClick={onClick}
        className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
      >
        <span className="font-semibold text-slate-800 pr-4">{question}</span>
        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <div 
        className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
          {answer}
        </p>
      </div>
    </div>
  );
};

const HelpSupport = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      question: "How do I raise a new complaint?",
      answer: "Navigate to the 'Raise a Complaint' section from the sidebar. You can describe your issue, select the correct category (e.g., Water, Electricity), and even upload a photo of the problem. A unique tracking ID will be given to you immediately."
    },
    {
      question: "What happens if the Pradhan does not resolve my issue?",
      answer: "If your complaint remains unaddressed beyond the standard wait window (usually 3 to 15 days depending on severity), our system allows you to legally escalate the ticket to the Vibhag (Department) or directly to the Block Development Officer (BDO)."
    },
    {
      question: "Can I support a neighbor's complaint?",
      answer: "Yes! If you see a complaint in the 'Nearby Complaints' map that affects you (e.g., a broken streetlight on your street), you can click 'Support'. Complaints with high community support are prioritized by officials."
    },
    {
      question: "Is my personal data completely safe?",
      answer: "Absolutely. Pragati GramSetu uses secure Aadhaar-mapped face verification and strict data encryption. Your personal identity remains private and is only visible to authorized verification officers handling your case."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 bg-gradient-to-br from-[#1E3A8A] to-blue-700 relative overflow-hidden">
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
              <p className="text-blue-100 mt-1 font-medium">We are here to assist you 24/7</p>
            </div>
          </div>
          <p className="text-base text-blue-50 leading-relaxed max-w-2xl">
            Having trouble navigating the Pragati GramSetu portal? Need to follow up forcefully on a frozen complaint? Check our quick guides or reach out to the toll-free village helpline directly.
          </p>
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl z-0" />
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">WhatsApp Sahayata</h3>
          <p className="text-xs text-slate-500 mb-4 px-2">Message us directly for instant AI chatbot guidance.</p>
          <button className="mt-auto px-4 py-2 bg-green-50 text-green-700 w-full rounded-lg font-semibold text-sm border border-green-100 hover:bg-green-100 transition-colors">
            +91 98765 43210
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Toll-Free Helpline</h3>
          <p className="text-xs text-slate-500 mb-4 px-2">Call for urgent BDO escalations and platform support.</p>
          <button className="mt-auto px-4 py-2 bg-[#1E3A8A] text-white w-full rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm">
            1800-111-2222
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-7 h-7 text-orange-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Local Panchayat</h3>
          <p className="text-xs text-slate-500 mb-4 px-2">Visit your nearest Gram Panchayat office for offline help.</p>
          <button className="mt-auto px-4 py-2 bg-orange-50 text-orange-700 w-full rounded-lg font-semibold text-sm border border-orange-100 hover:bg-orange-100 transition-colors">
            Find Near Me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FAQs Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <BookOpen className="w-5 h-5 text-[#1E3A8A]" />
              Frequently Asked Questions
            </h3>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem 
                key={idx}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === idx}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>

        {/* Info & Rules Sidebar */}
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
              <AlertCircle className="w-4 h-4" />
              Before Complaining
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-yellow-700 leading-relaxed">
                <span className="font-bold">•</span>
                Ensure location services (GPS) are enabled to pin the exact problem site.
              </li>
              <li className="flex items-start gap-2 text-sm text-yellow-700 leading-relaxed">
                <span className="font-bold">•</span>
                Clear images are helpful! Upload photos of the broken pipe, road, etc.
              </li>
              <li className="flex items-start gap-2 text-sm text-yellow-700 leading-relaxed">
                <span className="font-bold">•</span>
                Do not file the same complaint twice as it triggers spam protection.
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <FileText className="w-8 h-8 text-blue-300 mb-3" />
              <h4 className="font-bold text-lg mb-2 mb-1">Download Manual</h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Prefer reading offline? Download the complete Pragati platform guide in PDF format. Available in Hindi and English.
              </p>
              <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-100 transition-colors w-full flex items-center justify-center gap-2">
                Download PDF
              </button>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-700 rounded-tl-full blur-2xl z-0" />
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default HelpSupport;
