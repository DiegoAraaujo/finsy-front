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
        <p className="text-xl font-semibold">Qual é o seu salário mensal?</p>
        <p className="text-sm text-gray-500">
          considere o valor líquido(o que cai na conta)
        </p>
      </div>
      <form
        className="flex w-full justify-center gap-4 rounded-2xl border border-gray-300 p-4"
        onSubmit={handleSubmit}
      >
        <p className="text-xl text-gray-500">R$</p>
        <input
          inputMode="numeric"
          aria-label="Salário mensal"
          value={salary.toFixed(2)}
          onChange={handleChange}
          placeholder="0,00"
          type="text"
          className="flex-1 text-center text-xl focus:outline-0"
        />
        <Button
          type="submit"
          label="Continuar"
          disabled={salary <= 0}
        />
      </form>
    </>
  );
};

export default Step1;
