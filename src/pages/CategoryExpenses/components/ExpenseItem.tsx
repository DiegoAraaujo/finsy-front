const ExpenseItem = () => {
  return (
    <div className="flex justify-between rounded-t-lg border-t border-gray-300 py-4">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-4">
          <p className="text-xl font-bold">R$ 0.16</p>
          <p className="text-sm font-medium text-gray-500">Cartão de Crédito</p>
        </span>
        <span className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <p>19 de fev.</p>
          <p>Bar</p>
        </span>
      </div>
      <button className="cursor-pointer text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-red-600">
        <i className="bi bi-trash" />
      </button>
    </div>
  );
};

export default ExpenseItem;
