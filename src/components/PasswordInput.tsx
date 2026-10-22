import { cn } from "@/lib/utils";
import { useState } from "react";
interface PasswordInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  minLength?: number;
}
const PasswordInput = ({
  id,
  label,
  onChange,
  value,
  placeholder,
  minLength = 1,
}: PasswordInputProps) => {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-secundary text-sm font-medium">
        {label}
      </label>
      <div
        className={cn(
          "input-control [&:focus-within]:border-primary border-surface-subtle bg-background flex gap-4 rounded-2xl border p-2 [&_>_input:focus-visible]:outline-none",
        )}
      >
        <i className="bi bi-lock text-primary"></i>
        <input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type={visiblePassword ? "text" : "password"}
          id={id}
          required
          minLength={minLength}
          maxLength={72}
          className="flex-1 text-sm focus:outline-0"
          placeholder={placeholder}
        />
        <button
          type="button"
          aria-label={visiblePassword ? "Ocultar senha" : "Mostrar senha"}
          className="cursor-pointer"
          onClick={() => setVisiblePassword(!visiblePassword)}
        >
          <i
            aria-hidden="true"
            className={`${visiblePassword ? "bi bi-eye-slash" : "bi bi-eye"} text-secundary`}
          />
        </button>
      </div>
    </div>
  );
};
export default PasswordInput;
