import { useState } from "react";
import { toast } from "sonner";

import type { PaymentMethod } from "../../../types/paymentMethod";

import { useCreateExpense } from "../../../hooks/expense/useCreateExpense";

import Button from "../../../components/Button";
import TextInput from "../../../components/TextInput";

import AmountInput from "./AmountInput";
import DateInput from "./DateInput";
import PaymentMethodSelect from "./PaymentMethodSelect";

interface AddExpenseModalProps {
  categoryId: number;
  onClose: () => void;
}

const AddExpenseModal = ({ onClose, categoryId }: AddExpenseModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<string>(today);

  const { mutateAsync, isPending } = useCreateExpense(categoryId);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      return toast.warning("Informe um valor válido para o gasto.");
    }

    if (!date) {
      return toast.warning("Selecione uma data.");
    }

    const parsedDate = new Date(date + "T00:00:00");

    if (isNaN(parsedDate.getTime())) {
      return toast.warning("Data inválida.");
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    const isSameMonth =
      parsedDate.getMonth() === todayDate.getMonth() &&
      parsedDate.getFullYear() === todayDate.getFullYear();

    if (!isSameMonth) {
      return toast.warning("A data deve estar dentro do mês atual.");
    }

    if (parsedDate > todayDate) {
      return toast.warning("Não é possível registrar gastos em datas futuras.");
    }

    try {
      await mutateAsync({
        amount,
        paymentMethod,
        createdAt: parsedDate,
        description: description.trim() || undefined,
      });

      toast.success("Gasto registrado com sucesso!");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleCreateExpense}
      onClick={(e) => e.stopPropagation()}
      className="bg-background relative flex w-full max-w-100 flex-col gap-3 rounded-2xl p-4"
    >
      <button
        onClick={onClose}
        type="button"
        className="hover:text-danger text-secundary absolute top-4 right-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      >
        <i className="bi bi-x-lg" />
      </button>

      <p className="text-xl font-bold">Registrar Gasto</p>

      <AmountInput value={amount} onChange={setAmount} />

      <TextInput
        value={description}
        label="Descrição (opcional)"
        id="description"
        onChange={setDescription}
        placeholder="Ex: Almoço no restaurante"
        maxLength={80}
      />

      <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />

      <DateInput value={date} onChange={setDate} />

      <Button
        loading={isPending}
        loadingLabel="Salvando..."
        label="Registrar Gasto"
        type="submit"
      />
    </form>
  );
};

export default AddExpenseModal;
