import { useState } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}
const PasswordInput = ({
  id,
  label,
  onChange,
  value,
  placeholder,
}: PasswordInputProps) => {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-secundary font-medium">
        {label}
      </label>
      <div
        className={`${isFocused ? "border-primary/70" : "border-surface-subtle"} bg-background flex gap-4 rounded-2xl border p-2`}
      >
        <i className="bi bi-lock text-primary"></i>
        <input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type={visiblePassword ? "text" : "password"}
          id={id}
          className="flex-1 text-sm focus:outline-0"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setVisiblePassword(!visiblePassword)}
        >
          <i
            className={`${visiblePassword ? "bi bi-eye-slash" : "bi bi-eye"} text-secundary`}
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
