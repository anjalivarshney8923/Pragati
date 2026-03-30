import React, { useState, useEffect } from 'react';
import { RefreshCcw, ShieldCheck, AlertCircle } from 'lucide-react';

const CAPTCHA = ({ onVerify, error }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let code = '';
    for (let i = 0; i < 6; i++) {
       code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toUpperCase() === captchaCode) {
       setIsVerified(true);
       onVerify(true);
    } else {
       setIsVerified(false);
       onVerify(false);
       generateCaptcha();
    }
  };

  return (
    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all focus-within:ring-2 focus-within:ring-slate-100">
      <div className="flex items-center justify-between mb-4">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Verification CAPTCHA</label>
        <button 
          type="button"
          onClick={generateCaptcha}
          className="p-1.5 text-blue-600 bg-white border border-blue-100 hover:bg-blue-50 hover:border-blue-200 rounded-lg shadow-sm transition-all flex items-center mb-1 group"
        >
          <RefreshCcw className="w-4 h-4 mr-1 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] uppercase font-bold tracking-tighter">REFRESH</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full">
        {/* Visual Mock of Captcha with distortion style */}
        <div className="w-full sm:w-40 h-10 bg-white border border-slate-300 rounded flex items-center justify-center font-serif text-2xl font-bold italic tracking-[0.2em] relative overflow-hidden shadow-inner select-none pointer-events-none">
           {/* Background noise grid */}
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_1px,transparent_1px),linear-gradient(-45deg,#000_1px,transparent_1px)] bg-[size:10px_10px]" />
           {/* Random noise lines */}
           <div className="absolute w-full h-px bg-slate-300 transform rotate-12" />
           <div className="absolute w-full h-px bg-slate-400 transform -rotate-6" />
           <span className="relative z-10 text-slate-800 mix-blend-multiply filter blur-[0.3px]">{captchaCode}</span>
        </div>

        <div className="flex flex-grow w-full space-x-2">
           <input 
              type="text" 
              maxLength={6}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="ENTER TEXT"
              className={`flex-grow h-10 px-3 bg-white border ${error ? 'border-red-400' : 'border-slate-300 focus:border-blue-600'} rounded text-sm uppercase tracking-widest font-bold placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none transition-all`}
           />
           <button 
              type="button"
              onClick={handleVerify}
              disabled={isVerified}
              className={`h-10 px-4 rounded font-bold text-xs uppercase transition-all shadow-sm ${isVerified ? 'bg-[#138808] text-white cursor-default' : 'bg-slate-800 text-white hover:bg-slate-900 active:scale-95'}`}
           >
              {isVerified ? (
                 <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1" /> VERIFIED</span>
              ) : "CHECK"}
           </button>
        </div>
      </div>
      {error && !isVerified && (
        <div className="mt-2 flex items-center space-x-1 text-[10px] font-bold text-red-500 uppercase tracking-tight">
          <AlertCircle className="w-3 h-3" />
          <span>Incorrect code. Please try again.</span>
        </div>
      )}
    </div>
  );
};

export default CAPTCHA;
