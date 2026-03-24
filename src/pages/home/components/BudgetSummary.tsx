interface BudgetSummaryProps {
  salary: number;
  expenses: number;
}

const BudgetSummary = ({ salary, expenses }: BudgetSummaryProps) => {
  const remaining = salary - expenses;

  const progress = salary ? Math.min((expenses / salary) * 100, 100) : 0;

  const isOverBudget = expenses > salary;
  const isOutOfMoney = remaining <= 0;

  return (
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-center font-semibold text-gray-400">
          {isOutOfMoney ? "Sem dinheiro" : "Disponível"}
        </p>

        <p
          className={`text-5xl font-bold ${
            isOutOfMoney ? "text-red-600" : "text-blue-700"
          }`}
        >
          R$ {remaining.toFixed(2)}
        </p>
      </div>

      <div className="flex w-full max-w-48 flex-col gap-1">
        <div className="h-1.5 w-full rounded-2xl bg-gray-200">
          <div
            className={`h-full ${
              isOverBudget || isOutOfMoney ? "bg-red-600" : "bg-blue-600"
            } rounded-2xl`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-center text-xs text-gray-400">
          {Math.round(progress)}% usado
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;
