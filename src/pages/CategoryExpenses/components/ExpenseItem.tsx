import type { PaymentMethod } from "../../../types/paymentMethod";

import { formatCurrency } from "../../../utils/formatCurrency";
import { formatFullDate } from "../../../utils/formatMonthName";

interface ExpenseItem {
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  isPending: boolean;
  expenseDate: Date | string;
  onDelete: () => void;
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
  expenseDate,
}: ExpenseItem) => {
  return (
    <div className="border-surface-subtle flex justify-between rounded-t-lg border-t py-4">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-4">
          <p className="font-semibold">{formatCurrency(amount)}</p>
          <p className="text-secundary text-sm font-medium">
            {paymentMethodLabel[paymentMethod]}
          </p>
        </span>
        <span className="text-secundary flex items-center gap-4 text-sm font-medium">
          {description && <p>{description}</p>}
        </span>
        <span className="text-secundary text-xs font-medium">
          {formatFullDate(expenseDate)}
        </span>
      </div>
      <button
        disabled={isPending}
        onClick={onDelete}
        className="text-secundary hover:text-danger cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      >
        <i className="bi bi-trash" />
      </button>
    </div>
  );
};

export default ExpenseItem;
