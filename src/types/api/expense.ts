export interface Expense {
  categoryId: number;
  id: number;
  monthId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
}

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "OTHER";
