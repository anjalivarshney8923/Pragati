import React from 'react';

const TextArea = ({ label, id, required, rows = 4, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue outline-none transition-all placeholder:text-slate-400 bg-white shadow-sm resize-y"
        {...props}
      />
    </div>
  );
};

export default TextArea;
