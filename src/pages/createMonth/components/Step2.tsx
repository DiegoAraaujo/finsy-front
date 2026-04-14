import { useState } from "react";

import type { Category } from "../interface";

import Button from "../../../components/Button";

import AddCategoryModal from "./AddCategoryModal";
import BudgetCategories from "./BudgetCategories";
import BudgetSummary from "./BudgetSummary";

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
    <div className="flex w-full flex-col items-center gap-4 pb-8">
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
        <p className="text-center font-bold">Divida seu salário</p>
        <p className="text-secundary text-xs">
          Quanto você quer destinar para cada área?
        </p>
      </div>

      <BudgetSummary salary={salary} totalAllocated={totalAllocated} />

      <BudgetCategories
        categories={categories}
        removeCategory={removeCategory}
      />

      <Button
        type="button"
        label="Adicionar Categoria"
        backgroundColor="bg-primary/10"
        textColor="text-primary"
        onClick={() => setIsAddCategoryModalOpen(true)}
        disabled={availableBudget <= 0}
      />
      <Button
        onClick={onCreateMonth}
        type="submit"
        loading={isCreatingMonth}
        loadingLabel="Preparando seu mês..."
        label={
          isValid
            ? "Começar a usar"
            : `Faltam R$ ${(salary - totalAllocated).toFixed(2)}`
        }
        disabled={!isValid}
      />
    </div>
  );
};

export default Step2;
