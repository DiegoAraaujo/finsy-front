interface StepperProps {
  currentStep: number;
  onStepChange: (value: number) => void;
}

const Stepper = ({ currentStep, onStepChange }: StepperProps) => {
  return (
    <div className="flex w-32 items-center gap-2">
      <button
        type="button"
        aria-label="Ir para o passo 1 (definir salário)"
        aria-current={currentStep === 1 ? "step" : undefined}
        onClick={() => onStepChange(1)}
        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${currentStep === 1 ? "bg-blue-200 text-blue-700" : "bg-green-200 text-green-600"}`}
      >
        {currentStep === 2 ? (
          <i className="bi bi-check" aria-hidden="true" />
        ) : (
          1
        )}
      </button>
      <span
        className={`h-1 flex-1 ${currentStep === 2 ? "bg-green-600" : "bg-gray-300"} `}
      />
      <button
        type="button"
        aria-label="Ir para o passo 2 (categorias)"
        aria-current={currentStep === 2 ? "step" : undefined}
        onClick={() => onStepChange(2)}
        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${currentStep === 2 ? "bg-blue-200 text-blue-700" : "bg-gray-300 text-gray-500"}`}
      >
        2
      </button>
    </div>
  );
};

export default Stepper;
