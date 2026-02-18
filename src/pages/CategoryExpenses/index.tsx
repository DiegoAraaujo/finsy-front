import PageHeaderBackground from "../../components/PageHeaderBackground";
import BudgetSummary from "./components/BudgetSummary";
import ExpenseList from "./components/ExpenseList";
import Header from "./components/Header";
import SummaryItemCard from "./components/SummaryItemCard";

const CategoryExpenses = () => {
  return (
    <>
      <div className="relative h-64">
        <PageHeaderBackground />
        <Header categoryName="Alimetação" status="ACIMA" />
        <BudgetSummary />
      </div>
      <div className="flex justify-around gap-4 border-b border-gray-200 py-2">
        <SummaryItemCard label="Sálario" value={20} textColor="text-gray-900" />
        <SummaryItemCard label="Gastos" value={53} textColor="text-gray-900" />
        <SummaryItemCard
          label="Saldo"
          value={31}
          textColor={5 - 2 >= 0 ? "text-emerald-600" : "text-red-600"}
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <ExpenseList />
        <button className="w-full rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white">
          <i className="bi bi-plus" /> Registrar Gasto
        </button>
      </div>
    </>
  );
};

export default CategoryExpenses;
