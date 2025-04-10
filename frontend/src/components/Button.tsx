import React  from 'react';

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean
  children: React.ReactNode;
  // style?: React.CSSProperties;
}

export const CustomButton: React.FC<ButtonProps> = ({ text, onClick, type = 'button', className, icon, disabled, children }) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick} disabled={disabled}>
        {icon} {children} {text}
    </button>
  );
};