import { useState } from "react";

import Button from "../../../components/Button";
import TextInput from "../../../components/TextInput";

import { formatCurrency } from "../../../utils/formatCurrency";

import SuggestedCategories from "./SuggestedCategories";
interface AddCategoryModalProps {
  addCategory: (name: string, spendingLimit: number) => void;
  onClose: () => void;
  availableBudget: number;
}
const AddCategoryModal = ({
  availableBudget,
  addCategory,
  onClose,
}: AddCategoryModalProps) => {
  const [spendingLimit, setSpendingLimit] = useState<number>(0);
  const [categoryName, setCategoryName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCategory(categoryName.trim(), spendingLimit);
    setCategoryName("");
    setSpendingLimit(0);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const numeric = Number(onlyNumbers) / 100;
    setSpendingLimit(numeric);
  };

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      className="bg-background relative flex w-full max-w-100 flex-col gap-3 rounded-2xl p-4"
    >
      <button
        onClick={onClose}
        type="button"
        className="text-secundary hover:text-danger absolute top-4 right-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      >
        <i className="bi bi-x-lg" />
      </button>
      <p className="text-xl font-bold">Nova Categoria</p>
      <TextInput
        value={categoryName}
        label="Nome"
        id="category-name"
        onChange={setCategoryName}
        placeholder="Digite o nome da categoria"
        autoFocus={true}
      />

      <SuggestedCategories onSelectCategory={setCategoryName} />

      <p className="text-secundary">Destinar Valor</p>
      <p
        className={`${availableBudget > 0 ? "text-success" : "text-danger"} bg-surface-subtle rounded-2xl p-4 text-sm`}
      >
        Disponivel: {formatCurrency(availableBudget)}
      </p>
      <div className="border-surface-subtle flex w-full justify-center gap-4 rounded-2xl border p-4">
        <p className="text-secundary text-xl">R$</p>
        <input
          inputMode="numeric"
          value={spendingLimit.toFixed(2)}
          type="text"
          onChange={handleChange}
          className="flex-1 text-center text-xl focus:outline-0"
        />
      </div>
      <Button
        label="Adicionar"
        type="submit"
        disabled={
          !categoryName.trim() ||
          spendingLimit <= 0 ||
          spendingLimit > availableBudget
        }
      />
    </form>
  );
};

export default AddCategoryModal;
