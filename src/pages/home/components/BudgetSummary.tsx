const BudgetSummary = () => {
  return (
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-center font-semibold text-gray-400">Disponível</p>
        <p className="text-5xl font-bold text-blue-700">R$ 20,58</p>
      </div>
      <div className="flex w-full max-w-48 flex-col gap-1">
        <div className="h-1.5 w-full rounded-2xl bg-gray-200">
          <div
            className={`h-full ${true ? "bg-blue-600" : "bg-red-600"} rounded-2xl`}
            style={{ width: `${20}%` }}
          ></div>
        </div>
        <p className="text-center text-xs text-gray-400">98% usado</p>
      </div>
    </div>
  );
};

export default BudgetSummary;
