import type { PaymentMethod } from "./paymentMethod";

export interface Expense {
  categoryId: number;
  id: number;
  monthId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: Date | string;
}
