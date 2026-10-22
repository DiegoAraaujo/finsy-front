import api from "./api";

export interface FinanceCategory {
  kind?: "INCOME" | "EXPENSE";
  id: number;
  name: string;
  color: string;
  spent: number;
  budget: { amount: number; period: string } | null;
}
export interface ArchivedCategory {
  kind?: "INCOME" | "EXPENSE";
  id: number;
  name: string;
  color: string;
  archivedAt: string;
}
export interface TransactionInput {
  kind: "INCOME" | "EXPENSE";
  status: "COMPLETED" | "PLANNED";
  amount: number;
  description: string;
  date: string;
  categoryId: number | null;
  cardId?: number | null;
  isForecast?: boolean;
  paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "OTHER";
}
export interface Transaction extends TransactionInput {
  purchaseDate?: string | null;
  recurrenceId?: string | null;
  recurrence?: {
    id: string;
    day: number;
    endDate: string | null;
    cancelledAt: string | null;
  } | null;
  dueDate?: string | null;
  paidAt?: string | null;
  invoicePeriod?: string | null;
  id: number;
  seriesId?: string | null;
  installment?: number | null;
  installments?: number | null;
  category: { id: number; name: string; color: string } | null;
}
export interface Overview {
  period: string;
  summary: {
    income: number;
    expenses: number;
    plannedIncome: number;
    plannedExpenses: number;
    result: number;
    projectedResult: number;
  };
  transactions: Transaction[];
  categories: FinanceCategory[];
}
export const finance = {
  overview: async (period: string) =>
    (await api.get<Overview>("/finance/overview", { params: { period } })).data,
  saveTransaction: async (
    input: TransactionInput & {
      repeatMonths?: number;
      recurring?: boolean;
      planning?: boolean;
      plannedExpenseId?: number;
      recurrenceEndDate?: string | null;
      repeatDay?: number;
      installments?: number | null;
    },
    id?: number,
  ) =>
    id
      ? api.put(`/finance/transactions/${id}`, input)
      : api.post("/finance/transactions", input),
  deleteTransaction: async (id: number) =>
    api.delete(`/finance/transactions/${id}`),
  cancelFuture: async (id: number) =>
    api.delete(`/finance/transactions/${id}/future`),
  saveCategory: async (
    input: { name: string; color: string; kind?: "INCOME" | "EXPENSE" },
    id?: number,
  ) =>
    id
      ? api.put(`/finance/categories/${id}`, input)
      : api.post("/finance/categories", input),
  archiveCategory: async (id: number) =>
    api.delete(`/finance/categories/${id}`),
  archivedCategories: async () =>
    (await api.get<ArchivedCategory[]>("/finance/categories/archived")).data,
  restoreCategory: async (id: number) =>
    api.post(`/finance/categories/${id}/restore`),
  saveBudget: async (id: number, period: string, amount: number) =>
    api.put(`/finance/categories/${id}/budget`, { period, amount }),
  deleteBudget: async (id: number, period: string) =>
    api.delete(`/finance/categories/${id}/budget`, { params: { period } }),
};

export function localDate() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

export function exportTransactions(entries: Transaction[], period: string) {
  const cell = (value: string | number) =>
    `"${String(value)
      .replace(/^\s*[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""')}"`;
  const rows = [
    ["Data", "Descrição", "Tipo", "Situação", "Categoria", "Valor (R$)"],
    ...entries.map((e) => [
      e.date,
      e.description,
      e.kind === "INCOME" ? "Receita" : "Despesa",
      e.status === "COMPLETED" ? "Realizada" : "Planejada",
      e.category?.name ?? "Sem categoria",
      e.amount.toFixed(2).replace(".", ","),
    ]),
  ];
  const url = URL.createObjectURL(
    new Blob(
      ["\ufeff", rows.map((row) => row.map(cell).join(";")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    ),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `finsy-${period}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
