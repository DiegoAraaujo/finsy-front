import ExpenseItem from "./ExpenseItem";

const ExpenseList = () => {
  return (
    <div className="z-10 flex flex-col gap-4 p-4">
      <p className="text-sm font-bold text-gray-500">Gastos (5)</p>
      <div className="flex flex-col gap-4">
        <ExpenseItem />
        <ExpenseItem />
        <ExpenseItem />
      </div>
    </div>
  );
};

export default ExpenseList;
