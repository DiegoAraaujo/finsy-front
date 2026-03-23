import useCreateMonth from "../../hooks/month/useCreateMonth";

import Stepper from "./components/Stepper";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import { createMonth } from "../../services/monthService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateMonth = () => {
  const {
    addCategory,
    availableBudget,
    categories,
    handleSalaryChange,
    handleStepChange,
    removeCategory,
    salary,
    step,
    totalAllocated,
  } = useCreateMonth();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateMonth = async () => {
    if (loading) return;
    if (salary <= 0) {
      return toast.warning("Informe um salário válido.");
    }

    if (totalAllocated > salary) {
      return toast.warning("Você distribuiu mais do que o salário disponível.");
    }

    if (totalAllocated < salary) {
      return toast.warning("Distribua todo o salário antes de continuar.");
    }

    try {
      setLoading(true);
      await createMonth(salary, categories);
      toast.success("Mês criado com sucesso!");
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
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
          isCreatingMonth={loading}
          availableBudget={availableBudget}
          totalAllocated={totalAllocated}
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
          onCreateMonth={handleCreateMonth}
        />
      )}
    </section>
  );
};

export default CreateMonth;
