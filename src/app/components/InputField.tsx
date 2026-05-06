import React from "react";

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  name=""
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 text-xs text-[#2c2c33] placeholder:text-[#a4a4ad] outline-none transition focus:border-[#b7bcff] ${className}`}
    />
  );
};

export default InputField;
