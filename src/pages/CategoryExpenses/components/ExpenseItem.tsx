import type { PaymentMethod } from "../../../types/paymentMethod";

import { formatCurrency } from "../../../utils/formatCurrency";
import { formatFullDate } from "../../../utils/formatMonthName";

interface ExpenseItem {
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  isPending?: boolean;
  expenseDate: Date | string;
  onDelete?: () => void;
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
  isPending = false,
  expenseDate,
}: ExpenseItem) => {
  return (
    <div className="border-surface-subtle flex justify-between rounded-t-lg border-t py-4">
      <div className="flex flex-col gap-1">
        <p className="font-bold">{formatCurrency(amount)}</p>
        <span className="text-secundary flex items-center gap-4 sm:text-sm text-xs">
          {description && <p>{description}</p>}
        </span>
        <div className="flex gap-4">
          <p className="text-secundary text-xs font-medium">
            {formatFullDate(expenseDate)}
          </p>
          <p className="text-secundary text-xs font-medium">
            {paymentMethodLabel[paymentMethod]}
          </p>
        </div>
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
