interface Props {
  value: string;
  onChange: (value: string) => void;
}

const DateInput = ({ value, onChange }: Props) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const minDate = `${year}-${month}-01`;
  const maxDate = today.toISOString().split("T")[0];

  return (
    <input
      type="date"
      value={value}
      min={minDate}
      max={maxDate}
      onChange={(e) => onChange(e.target.value)}
      className="border-surface-subtle focus:outline-primary rounded-2xl border p-2 text-sm"
    />
  );
};

export default DateInput;
