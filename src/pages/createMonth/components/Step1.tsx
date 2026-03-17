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

  return (
    <>
      <div>
        <p className="text-xl font-semibold">Qual é o seu salário mensal?</p>
        <p className="text-sm text-gray-500">
          considere o valor líquido(o que cai na conta)
        </p>
      </div>
      <div className="flex w-full justify-center gap-4 rounded-2xl border border-gray-300 p-4">
        <p className="text-xl text-gray-500">R$</p>
        <input
          inputMode="numeric"
          value={salary.toFixed(2)}
          onChange={handleChange}
          type="text"
          className="flex-1 text-center text-xl focus:outline-0"
        />
      </div>
      <Button
        label="Continuar"
        disabled={Number(salary) <= 0}
        onClick={() => onStepChange(2)}
      />
    </>
  );
};

export default Step1;
