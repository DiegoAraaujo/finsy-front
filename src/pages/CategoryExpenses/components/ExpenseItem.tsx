import type { PaymentMethod } from "../../../types/paymentMethod";

import { formatCurrency } from "../../../utils/formatCurrency";

interface ExpenseItem {
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  onDelete: () => void;
  isPending: boolean;
}
const paymentMethodLabel: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  PIX: "Pix",
  OTHER: "Outro",
};

const ExpenseItem = ({
  amount,
  paymentMethod,
  description,
  onDelete,
  isPending,
}: ExpenseItem) => {
  return (
    <div className="flex justify-between rounded-t-lg border-t border-gray-300 py-4">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-4">
          <p className="font-semibold">{formatCurrency(amount)}</p>
          <p className="text-sm font-medium text-gray-500">
            {paymentMethodLabel[paymentMethod]}
          </p>
        </span>
        <span className="flex items-center gap-4 text-sm font-medium text-gray-500">
          {description && <p>{description}</p>}
        </span>
      </div>
      <button
        disabled={isPending}
        onClick={onDelete}
        className="cursor-pointer text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-red-600"
      >
        <i className="bi bi-trash" />
      </button>
    </div>
  );
};

export default ExpenseItem;
