import type { InputHTMLAttributes } from "react";

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "inputMode"
> & {
  value: number;
  onValueChange: (value: number) => void;
};

export default function CurrencyInput({
  value,
  onValueChange,
  ...props
}: Props) {
  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={formatter.format(value)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return;
        if (
          !/^\d$/.test(event.key) &&
          event.key !== "Backspace" &&
          event.key !== "Delete"
        )
          return;
        event.preventDefault();
        const input = event.currentTarget;
        const selectedAll =
          input.selectionStart === 0 &&
          input.selectionEnd === input.value.length;
        const cents = selectedAll ? 0 : Math.round(value * 100);
        const nextCents = /^\d$/.test(event.key)
          ? cents * 10 + Number(event.key)
          : Math.floor(cents / 10);
        if (nextCents > 999999999999) return;
        input.value = formatter.format(nextCents / 100);
        input.setSelectionRange(input.value.length, input.value.length);
        onValueChange(nextCents / 100);
      }}
      onChange={(event) => {
        const input = event.currentTarget;
        const digits = input.value.replace(/\D/g, "").replace(/^0+/, "");
        // Decimal(12, 2): at most ten integer digits and two decimal digits.
        if (digits.length > 12) {
          input.value = formatter.format(value);
          input.setSelectionRange(input.value.length, input.value.length);
          return;
        }
        const nextValue = Number(digits || "0") / 100;
        input.value = formatter.format(nextValue);
        input.setSelectionRange(input.value.length, input.value.length);
        onValueChange(nextValue);
      }}
    />
  );
}
