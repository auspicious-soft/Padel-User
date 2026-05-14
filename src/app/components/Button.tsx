import React from 'react';

interface ArrowButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
   type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ text, onClick, type = 'button', disabled = false, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-10 w-full cursor-pointer rounded-full bg-[#7f87f6] text-sm font-medium text-white transition hover:bg-[#7079ef] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {text}
    </button>
  );
};

export default ArrowButton;
