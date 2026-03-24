import { useMemo, useState } from "react";
import type { Category } from "../../pages/createMonth/interface";
import { toast } from "sonner";
import { normalizeText } from "../../utils/normalizeText";
import { formatCurrency } from "../../utils/formatCurrency";

const useCreateMonth = () => {
  const [salary, setSalary] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
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
      toast.warning("O salário não pode ser menor que o total já alocado.");
    }

    setSalary(newSalary);
  };

  return {
    salary,
    categories,
    step,
    totalAllocated,
    availableBudget,
    addCategory,
    removeCategory,
    handleStepChange,
    handleSalaryChange,
  };
};

export default useCreateMonth;
