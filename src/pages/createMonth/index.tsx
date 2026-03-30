import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useCreateMonthForm from "../../hooks/month/useCreateMonthForm";
import { useCreateMonthMutation } from "../../hooks/month/useCreateMonthMutation";

import Stepper from "./components/Stepper";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";

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
  } = useCreateMonthForm();

  const { mutateAsync: createMonthMutate, isPending } =
    useCreateMonthMutation();

  const navigate = useNavigate();

  const handleCreateMonth = async () => {
    if (isPending) return;

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
      await createMonthMutate({ salary, categories });
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
          isCreatingMonth={isPending}
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
