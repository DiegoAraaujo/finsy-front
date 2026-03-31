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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-gray-500">
        {label}
      </label>

      <div
        className={`flex gap-4 rounded-2xl border ${isFocused ? "border-blue-400" : "border-gray-200"} bg-white p-2`}
      >
        {icon && <i className={`bi ${icon} text-blue-400`} />}
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          id={id}
          className="flex-1 text-sm focus:outline-0"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default TextInput;
