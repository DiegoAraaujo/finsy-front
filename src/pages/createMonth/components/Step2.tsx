import { useState } from "react";

import AddCategoryModal from "./AddCategoryModal";
import Button from "../../../components/Button";
import BudgetCategories from "./BudgetCategories";
import BudgetSummary from "./BudgetSummary";
import type { Category } from "../interface";

interface Step2Props {
  salary: number;
  totalAllocated: number;
  categories: Category[];
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

      <Button
        label="Adicionar Categoria"
        backgroundColor="blue-100"
        textColor="blue-600"
        onClick={() => setIsAddCategoryModalOpen(true)}
        disabled={availableBudget <= 0}
      />
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
