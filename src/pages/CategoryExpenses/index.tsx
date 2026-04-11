import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetCategoryById } from "../../hooks/category/useGetCategoryById";
import { useGetExpensesByCategoryId } from "../../hooks/expense/useGetExpensesByCategoryId";

import Loading from "../../components/Loading";

import AddExpenseModal from "./components/AddExpenseModal";
import ExpenseList from "./components/ExpenseList";
import Header from "../../components/Header";
import ErrorState from "../../components/ErrorState";
import BudgetSummary from "../../components/BudgetSummary";
import SummaryItemCard from "../../components/SummaryItemCard";

const CategoryExpenses = () => {
  const [addExpenseModalOpen, setIsAddExpenseModalOpen] =
    useState<boolean>(false);
  const { id } = useParams();

  const {
    data: category,
    isLoading: loadingCategory,
    isError: errorCategory,
  } = useGetCategoryById(Number(id));

  const {
    data: expenses,
    isLoading: loadingExpenses,
    isError: errorExpenses,
  } = useGetExpensesByCategoryId(Number(id));

  if (loadingCategory || loadingExpenses) {
    return <Loading />;
  }

  if (errorExpenses || errorCategory)
    return (
      <ErrorState message="Não conseguimos carregar seus dados no momento. Verifique sua conexão ou tente novamente." />
    );
  if (!category || !expenses) {
    return <ErrorState message="Dados não encontrados." />;
  }
  
  const totalExpenses = expenses.reduce((acc, c) => c.amount + acc, 0);
  const currentBalance = category.spendingLimit - totalExpenses;

  return (
    <div className="relative flex h-full flex-col">
      {addExpenseModalOpen && (
        <div
          aria-label="Modal para adicionar gasto"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAddExpenseModalOpen(false)}
          className="fixed top-0 left-0 z-50 flex h-dvh w-dvw items-center justify-center bg-black/50 p-4"
        >
          <AddExpenseModal
            onClose={() => setIsAddExpenseModalOpen(false)}
            categoryId={category.id}
          />
        </div>
      )}
      <Header
        title={category.name}
        backTo="home"
        subtitle="Detalhes da Categoria"
      />
      <BudgetSummary
        salary={currentBalance}
        expenses={totalExpenses}
        isCurrentMonth={true}
      />
      <div className="border-surface-subtle relative z-10 flex justify-around gap-4 border-b py-2">
        <SummaryItemCard label="Reservado" value={category.spendingLimit} />
        <SummaryItemCard label="gastos" value={totalExpenses} />
        <SummaryItemCard
          label="Saldo"
          value={category.spendingLimit - totalExpenses}
          textColor={
            category.spendingLimit >= totalExpenses
              ? "text-success"
              : "text-danger"
          }
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <ExpenseList
          expenses={expenses}
          categoryId={Number(id)}
          onRegisterExpense={() => setIsAddExpenseModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default CategoryExpenses;
