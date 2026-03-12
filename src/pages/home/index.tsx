import CategoriesSection from "./components/CategoriesSection";
import BudgetSummary from "./components/BudgetSummary";
import Header from "./components/Header";
import SummaryItemCard from "./components/SummaryItemCard";
import PageHeaderBackground from "../../components/PageHeaderBackground";
import Loading from "../../components/Loading";
import useFinances from "../../hooks/useFinances";
import useCategories from "../../hooks/useCategories";

const Home = () => {
  const { categories, categoriesLoading, categoriesError } = useCategories();
  const { financialSummary, financesLoading, financesError } = useFinances();

  if (categoriesLoading || financesLoading) return <Loading />;
  if (categoriesError || financesError) return <p>Erro ao carregar</p>;

  return (
    <>
      <div className="relative h-64">
        <Header />
        <BudgetSummary />
      </div>

      {financialSummary && (
        <div className="flex justify-around gap-4 border-b border-gray-200 py-2">
          <SummaryItemCard
            label="Salário"
            value={financialSummary.salary}
            textColor="text-gray-900"
          />
          <SummaryItemCard
            label="Gastos"
            value={financialSummary.expenses}
            textColor="text-gray-900"
          />
          <SummaryItemCard
            label="Saldo"
            value={financialSummary.salary - financialSummary.expenses}
            textColor={
              financialSummary.salary - financialSummary.expenses >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-2 p-4">
        {categories && <CategoriesSection categories={categories} />}
        <button className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <i className="bi bi-plus" /> Registrar Gasto
        </button>
      </div>
    </>
  );
};

export default Home;
