import { useState } from "react";

import AddCategoryModal from "./AddCategoryModal";
import Button from "../../../components/Button";
import BudgetCategories from "./BudgetCategories";
import BudgetSummary from "./BudgetSummary";
import type { category } from "../interface";

interface Step2Props {
  addCategory: (name: string, spendingLimit: number) => void;
  removeCategory: (name: string) => void;
  salary: number;
  totalAllocated: number;
  availableBudget: number;
  categories: category[];
}
const Step2 = ({
  salary,
  categories,
  addCategory,
  removeCategory,
  availableBudget,
  totalAllocated,
}: Step2Props) => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);

  return (
    <>
      {isAddCategoryModalOpen && (
        <div
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
        onClick={() => setIsAddCategoryModalOpen(true)}
        className={`w-full cursor-pointer rounded-2xl border border-gray-200 bg-blue-100 p-2 font-semibold text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:transform-none disabled:opacity-60`}
      >
        Adionar Categoria
      </button>

      <Button
        label="Começar a usar"
        disabled={salary <= 0 || categories.length === 0}
      />
    </>
  );
};

export default Step2;
