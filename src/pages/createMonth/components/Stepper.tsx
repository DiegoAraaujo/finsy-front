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
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold ${currentStep === 1 ? "bg-button/20 text-primary" : "text-success bg-success/20"}`}
      >
        {currentStep === 2 ? (
          <i className="bi bi-check" aria-hidden="true" />
        ) : (
          1
        )}
      </button>
      <span
        className={`h-1 flex-1 ${currentStep === 2 ? "bg-success" : "bg-surface-subtle"} `}
      />
      <button
        type="button"
        aria-label="Ir para o passo 2 (categorias)"
        aria-current={currentStep === 2 ? "step" : undefined}
        onClick={() => onStepChange(2)}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold ${currentStep === 2 ? "bg-primary/20 text-primary" : "bg-surface-subtle text-secundary"}`}
      >
        2
      </button>
    </div>
  );
};

export default Stepper;
