import useCreateMonth from "../../hooks/useCreateMonth";

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
  } = useCreateMonth();

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
