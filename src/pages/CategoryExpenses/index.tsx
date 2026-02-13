import PageHeaderBackground from "../../components/PageHeaderBackground";
import BudgetSummary from "./components/BudgetSummary";
import ExpenseList from "./components/ExpenseList";
import Header from "./components/Header";
import SummaryItemCard from "./components/SummaryItemCard";

const CategoryExpenses = () => {
  return (
    <section className="relative m-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <div className="relative h-64">
        <PageHeaderBackground/>
        <Header categoryName="Alimetação" status="ACIMA" />
        <BudgetSummary />
      </div>
      <div className="flex justify-around gap-4 border-b border-gray-200 py-2">
        <SummaryItemCard label="Sálario" value={20} />
        <SummaryItemCard label="Gastos" value={53} />
        <SummaryItemCard label="Saldo" value={31} />
      </div>

      <ExpenseList />
      <button className="rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white">
        <i className="bi bi-plus" /> Adicionar gasto
      </button>
    </section>
  );
};

export default CategoryExpenses;
