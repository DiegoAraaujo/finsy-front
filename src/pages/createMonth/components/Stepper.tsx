interface StepperProps {
  currentStep: number;
  salary: number;
  onStepChange: (value: number) => void;
}

const Stepper = ({ currentStep, onStepChange, salary }: StepperProps) => {
  return (
    <div className="flex w-32 items-center gap-2">
      <span
        onClick={() => onStepChange(1)}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold ${currentStep === 1 ? "bg-blue-200 text-blue-700" : "bg-green-200 text-green-600"}`}
      >
        {currentStep === 2 ? <i className="bi bi-check"></i> : 1}
      </span>
      <span
        className={`h-1 flex-1 ${currentStep === 2 ? "bg-green-600" : "bg-gray-300"} `}
      />
      <span
        onClick={salary > 0 ? () => onStepChange(2) : () => {}}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold ${currentStep === 2 ? "bg-blue-200 text-blue-700" : "bg-gray-300 text-gray-500"}`}
      >
        2
      </span>
    </div>
  );
};

export default Stepper;
