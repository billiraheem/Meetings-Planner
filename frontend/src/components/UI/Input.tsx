import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export const CustomInput: React.FC<InputProps> = ({ label, type, value, placeholder, onChange, required, className }) => {
  return (
    <div className={`input-group ${className}`}>
      <label>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={onChange} required={required} />
    </div>
  );
};