import { useMemo, useState } from "react";

import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Stepper from "./components/Stepper";
import { toast } from "sonner";
import { normalizeText } from "../../utils/normalizeText";
import type { category } from "./interface";
import { formatCurrency } from "../../utils/formatCurrency";

const CreateMonth = () => {
  const [salary, setSalary] = useState<number>(0);
  const [categories, setCategories] = useState<category[]>([]);
  const [step, setStep] = useState<number>(1);

  const totalAllocated = useMemo(
    () => categories.reduce((acc, c) => c.spendingLimit + acc, 0),
    [categories],
  );

  const availableBudget = useMemo(
    () => salary - totalAllocated,
    [salary, totalAllocated],
  );

  const addCategory = (name: string, spendingLimit: number) => {
    if (!name.trim()) {
      return toast.warning("Informe um nome para a categoria.");
    }

    if (spendingLimit <= 0) {
      return toast.warning("Informe um valor válido para a categoria.");
    }

    const categoryExists = categories.some(
      (c) => normalizeText(c.name) === normalizeText(name),
    );

    if (categoryExists)
      return toast.warning(`Você já adicionou a categoria "${name}".`);

    if (spendingLimit > availableBudget)
      return toast.warning(
        `Valor excede o orçamento disponível (${formatCurrency(availableBudget)}).`,
      );

    setCategories((prev) => [...prev, { name, spendingLimit }]);
    toast.success(`${name} foi adicionada às suas categorias.`);
  };

  const removeCategory = (name: string) => {
    setCategories((prev) =>
      prev.filter((p) => normalizeText(p.name) !== normalizeText(name)),
    );
    toast.success(`${name} foi removida das suas categorias.`);
  };

  const handleStepChange = (nextStep: number) => {
    if (nextStep === 2 && salary <= 0) {
      toast.warning("Defina seu salário antes de continuar.");
      return;
    }

    setStep(nextStep);
  };

  const handleSalaryChange = (newSalary: number) => {
    if (newSalary < totalAllocated) {
      toast.warning("Seu orçamento está acima do salário.");
    }

    setSalary(newSalary);
  };

  return (
    <section className="m-auto flex h-full w-full max-w-100 flex-col items-center gap-4">
      <Stepper currentStep={step} onStepChange={handleStepChange} />
      {step === 1 && (
        <Step1
          salary={salary}
          onSalaryChange={handleSalaryChange}
          onStepChange={handleStepChange}
        />
      )}
      {step === 2 && (
        <Step2
          salary={salary}
          availableBudget={availableBudget}
          totalAllocated={totalAllocated}
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
        />
      )}
    </section>
  );
};

export default CreateMonth;
