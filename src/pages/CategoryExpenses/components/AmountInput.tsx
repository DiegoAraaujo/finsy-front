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
      <label className="text-sm font-medium text-gray-500">Valor</label>

      <div className="flex w-full justify-center gap-4 rounded-2xl border border-gray-300 p-2">
        <p className="text-sm text-gray-500">R$</p>
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
