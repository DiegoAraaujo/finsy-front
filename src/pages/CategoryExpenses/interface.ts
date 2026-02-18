export type PaymentMethod = "CreditCard" | "DebitCard" | "Cash" | "Pix";

export interface Expense {
  id: number;
  categoryId: number;
  value: number;
  description?: string;
  paymentMethod: PaymentMethod;
  date: string;
}
export interface CategoryExpenses {
  categoryId: number;
  name: string;
  expenses: Expense[];
  total: number;
}
