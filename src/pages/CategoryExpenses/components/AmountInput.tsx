interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

const AmountInput = ({ value, onChange }: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const numeric = Number(onlyNumbers) / 100;
    onChange(numeric);
  };

  return (
    <div>
      <label className="text-secundary text-sm font-medium">Valor</label>

      <div className="border-surface-subtle flex w-full justify-center gap-4 rounded-2xl border p-2">
        <p className="text-secundary text-sm">R$</p>
        <input
          onChange={handleChange}
          value={value.toFixed(2)}
          inputMode="numeric"
          type="text"
          className="flex-1 text-center focus:outline-none"
        />
      </div>
    </div>
  );
};

export default AmountInput;
