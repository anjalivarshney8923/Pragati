import React, { useRef, useState, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (value) {
      setOtp(value.split('').concat(Array(length - value.length).fill('')));
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const { value: val } = e.target;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-between w-full max-w-xs mx-auto space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={data}
          ref={(input) => (inputsRef.current[index] = input)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
