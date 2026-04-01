import type { PaymentMethod } from "../../../types/paymentMethod";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatFullDate } from "../../../utils/formatMonthName";

interface ExpenseItemProps {
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  expenseDate: Date | string;
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
  expenseDate,
}: ExpenseItemProps) => {
  return (
    <div className="flex flex-col gap-1 rounded-t-lg border-t border-gray-300 py-4">
      <span className="flex items-center gap-4">
        <p className="font-semibold">{formatCurrency(amount)}</p>
        <p className="text-sm font-medium text-gray-500">
          {paymentMethodLabel[paymentMethod]}
        </p>
      </span>
      <span className="flex items-center gap-4 text-sm font-medium text-gray-500">
        {description && <p>{description}</p>}
      </span>
      <span className="text-xs font-medium text-gray-500">
        {formatFullDate(expenseDate)}
      </span>
    </div>
  );
};

export default ExpenseItem;
