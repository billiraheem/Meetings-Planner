import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  name?: string
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput: React.FC<InputProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  required = false,
  className,
  name,
  error,
  disabled = false,
  onBlur,
}) => {
  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={name} className="input-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        id={name}
        name={name}
        disabled={disabled}
        className={`custom-input ${error ? 'input-error' : ''}`}
        onBlur={onBlur}
      />
      {error && <div className="error-message">{error}</div>}
      {disabled && <div className="disabled-message">Complete previous fields first</div>}
    </div>
  );
};