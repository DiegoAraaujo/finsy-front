import { useState } from "react";

import AddCategoryModal from "./AddCategoryModal";
import Button from "../../../components/Button";
import BudgetCategories from "./BudgetCategories";
import BudgetSummary from "./BudgetSummary";
import type { category } from "../interface";

interface Step2Props {
  salary: number;
  totalAllocated: number;
  categories: category[];
  isCreatingMonth: boolean;
  availableBudget: number;
  addCategory: (name: string, spendingLimit: number) => void;
  removeCategory: (name: string) => void;
  onCreateMonth: () => void;
}
const Step2 = ({
  salary,
  totalAllocated,
  categories,
  isCreatingMonth,
  availableBudget,
  addCategory,
  removeCategory,
  onCreateMonth,
}: Step2Props) => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);

  const isValid =
    salary > 0 && categories.length > 0 && totalAllocated === salary;

  return (
    <>
      {isAddCategoryModalOpen && (
        <div
          aria-label="Modal para adicionar categoria"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAddCategoryModalOpen(false)}
          className="fixed top-0 left-0 z-50 flex h-dvh w-dvw items-center justify-center bg-black/50 p-4"
        >
          <AddCategoryModal
            availableBudget={availableBudget}
            addCategory={addCategory}
            onClose={() => setIsAddCategoryModalOpen(false)}
          />
        </div>
      )}

      <div>
        <p className="text-center text-xl font-semibold">Divida seu salário</p>
        <p className="text-sm text-gray-500">
          Quanto você quer destinar para cada área?
        </p>
      </div>

      <BudgetSummary salary={salary} totalAllocated={totalAllocated} />

      <BudgetCategories
        categories={categories}
        removeCategory={removeCategory}
      />

      <button
        disabled={availableBudget <= 0}
        onClick={() => setIsAddCategoryModalOpen(true)}
        className={`w-full cursor-pointer rounded-2xl border border-gray-200 bg-blue-100 p-2 font-semibold text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:translate-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none`}
      >
        Adicionar Categoria
      </button>

      <Button
        onClick={onCreateMonth}
        loading={isCreatingMonth}
        loadingLabel="Preparando seu mês..."
        label={
          isValid
            ? "Começar a usar"
            : `Faltam R$ ${(salary - totalAllocated).toFixed(2)}`
        }
        disabled={!isValid}
      />
    </>
  );
};

export default Step2;
