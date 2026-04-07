import Button from "../../../components/Button";

interface Step1Props {
  salary: number;
  onSalaryChange: (value: number) => void;
  onStepChange: (value: number) => void;
}

const Step1 = ({ salary, onSalaryChange, onStepChange }: Step1Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const numeric = Number(onlyNumbers) / 100;
    onSalaryChange(numeric);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onStepChange(2);
  };

  return (
    <>
      <div>
        <p className="text-center font-bold">Qual é o seu salário mensal?</p>
        <p className="text-secundary text-xs">
          considere o valor líquido(o que cai na conta)
        </p>
      </div>
      <form className="flex w-full flex-col gap-4 p-8" onSubmit={handleSubmit}>
        <div className="border-surface-subtle flex items-center rounded-2xl border p-4">
          <p className="text-secundary text-sm">R$</p>
          <input
            inputMode="numeric"
            aria-label="Salário mensal"
            value={salary.toFixed(2)}
            onChange={handleChange}
            placeholder="0,00"
            type="text"
            className="flex-1 text-center text-sm focus:outline-0"
          />
        </div>
        <Button type="submit" label="Continuar" disabled={salary <= 0} />
      </form>
    </>
  );
};

export default Step1;
