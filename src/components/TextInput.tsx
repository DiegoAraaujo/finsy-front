import { useState } from "react";

interface TextInputProps {
  label: string;
  type?: string;
  id: string;
  placeholder?: string;
  icon?: string;
  value: string;
  autoFocus?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
}

const TextInput = ({
  label,
  type = "text",
  id,
  placeholder,
  icon,
  onChange,
  value,
  maxLength,
  autoFocus,
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-secundary font-medium">
        {label}
      </label>

      <div
        className={`border-surface-subtle bg-background flex gap-4 rounded-2xl border p-2`}
      >
        {icon && <i className={`bi ${icon} text-primary`} />}
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          id={id}
          className="flex-1 text-sm focus:outline-0"
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default TextInput;
