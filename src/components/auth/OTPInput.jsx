import React, { useRef, useEffect } from 'react';

const OTPInput = ({ count = 6, value = Array(6).fill(""), onChange, error }) => {
  const inputs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputs.current[0]) inputs.current[0].focus();
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newValue = [...value];
    // Only take the last digit if multiple are entered (e.g. paste)
    newValue[index] = val.slice(-1);
    onChange(newValue);

    // Auto-focus next input
    if (val && index < count - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, count).split('');
    const newValue = [...value];
    pastedData.forEach((char, i) => {
      if (!isNaN(char)) newValue[i] = char;
    });
    onChange(newValue);
    
    // Focus last filled or next empty
    const lastIdx = Math.min(pastedData.length, count - 1);
    inputs.current[lastIdx].focus();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 sm:space-x-3 mb-2" onPaste={handlePaste}>
        {value.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`w-10 h-12 sm:w-12 sm:h-14 lg:w-14 lg:h-16 text-center text-xl sm:text-2xl font-bold bg-slate-50 border-2 ${error ? 'border-red-500' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100'} rounded-xl outline-none transition-all`}
          />
        ))}
      </div>
      {error && <p className="text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>}
    </div>
  );
};

export default OTPInput;
