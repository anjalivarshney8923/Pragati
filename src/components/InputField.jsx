import React from 'react';

const InputField = React.forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`block w-full rounded-md border-slate-300 py-2.5 px-3 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A] sm:text-sm transition-colors
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 animate-pulse">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
