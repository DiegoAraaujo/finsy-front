import { useMemo, useState } from "react";

import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Stepper from "./components/Stepper";
import { toast } from "sonner";
import { normalizeText } from "../../utils/normalizeText";
import type { category } from "./interface";

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
    const categoryExists = categories.some(
      (c) => normalizeText(c.name) === normalizeText(name),
    );

    if (categoryExists) return toast.warning("categoria já foi adicionada");

    if (spendingLimit > availableBudget)
      return toast.warning(
        `restam apenas R$ ${availableBudget} para distribuir`,
      );

    setCategories((prev) => [...prev, { name, spendingLimit }]);
    toast.success(`${name} foi adiconado a suas categorias de gasto`);
  };

  const removeCategory = (name: string) => {
    setCategories((prev) => prev.filter((p) => p.name !== name));
    toast.success(`${name} removido das suas categorias`);
  };

  return (
    <section className="m-auto flex h-full w-full max-w-100 flex-col items-center gap-4">
      <Stepper currentStep={step} onStepChange={setStep} salary={salary} />
      {step === 1 && (
        <Step1
          salary={salary}
          onSalaryChange={setSalary}
          onStepChange={setStep}
        />
      )}
      {step === 2 && (
        <Step2
          salary={Number(salary)}
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
