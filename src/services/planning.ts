import api from "./api";
export interface PlannedExpense {
  id: number;
  description: string;
  date: string;
  amount: number | null;
  notes: string;
}
export interface Card {
  id: number;
  name: string;
  closingDay: number;
  dueDay: number;
  limit: number;
  archivedAt: string | null;
}
export interface ImportRow {
  date: string;
  description: string;
  amount: number;
  kind: "INCOME" | "EXPENSE";
  sourceId: string;
  duplicate: boolean;
  possibleDuplicate?: boolean;
  futureIncome?: boolean;
}
export interface ImportOptions {
  source?: "account" | "card";
  cardId?: number;
  signs?: "negative_expenses" | "positive_expenses";
  separator?: "," | ";" | "\t";
  mapping?: {
    date: number;
    description: number;
    amount: number;
    kind?: number;
  };
}
export interface ImportInspection {
  format: "csv" | "ofx";
  headers: string[];
  sample: string[][];
  mapping?: ImportOptions["mapping"];
  separator?: ImportOptions["separator"];
  source: "account" | "card";
  signs: ImportOptions["signs"];
  profile?: string;
}
export interface Comparison {
  period: string;
  previousPeriod: string;
  current: { income: number; expenses: number };
  previous: { income: number; expenses: number };
  categories: { id: number; name: string; current: number; previous: number }[];
}
export interface Reminders {
  today: string;
  reminderDays: number;
  entries: {
    id: number;
    description: string;
    amount: number;
    date: string;
    period?: string;
    kind: "INCOME" | "EXPENSE";
    overdue: boolean;
    isForecast?: boolean;
  }[];
}
export interface Invoice {
  forecastTotal?: number;
  period: string;
  total: number;
  pending: number;
  committed: number;
  entries: {
    id: number;
    description: string;
    amount: number;
    date: string;
    status: string;
    isForecast?: boolean;
    paidAt?: string | null;
    dueDate?: string | null;
    installment: number | null;
    installments: number | null;
    purchaseDate: string | null;
  }[];
}
export const planning = {
  plannedExpenses: async (period: string) =>
    (
      await api.get<PlannedExpense[]>("/finance/planned-expenses", {
        params: { period },
      })
    ).data,
  savePlannedExpense: (input: Omit<PlannedExpense, "id">, id?: number) =>
    id
      ? api.put(`/finance/planned-expenses/${id}`, input)
      : api.post("/finance/planned-expenses", input),
  deletePlannedExpense: (id: number) =>
    api.delete(`/finance/planned-expenses/${id}`),
  cards: async () => (await api.get<Card[]>("/finance/cards")).data,
  saveCard: (card: Omit<Card, "id" | "archivedAt">, id?: number) =>
    id
      ? api.put(`/finance/cards/${id}`, card)
      : api.post("/finance/cards", card),
  archiveCard: (id: number) => api.delete(`/finance/cards/${id}`),
  restoreCard: (id: number) => api.post(`/finance/cards/${id}/restore`),
  invoice: async (id: number, period: string) =>
    (
      await api.get<Invoice>(`/finance/cards/${id}/invoice`, {
        params: { period },
      })
    ).data,
  payInvoice: (id: number, period: string, paymentDate: string) =>
    api.post(`/finance/cards/${id}/pay`, { period, paymentDate }),
  comparison: async (period: string) =>
    (await api.get<Comparison>("/finance/comparison", { params: { period } }))
      .data,
  reminders: async () => (await api.get<Reminders>("/finance/reminders")).data,
  preview: async (text: string) =>
    (await api.post<ImportRow[]>("/finance/import/preview", { text })).data,
  inspect: async (text: string, separator?: ImportOptions["separator"]) =>
    (
      await api.post<ImportInspection>("/finance/import/inspect", {
        text,
        separator,
      })
    ).data,
  previewDetailed: async (text: string, options: ImportOptions) =>
    (
      await api.post<{
        rows: ImportRow[];
        ignoredPayments: number;
        format: string;
      }>("/finance/import/preview", { text, options, detailed: true })
    ).data,
  import: async (rows: ImportRow[], options?: ImportOptions) =>
    (
      await api.post<{ imported: number; skipped: number }>(
        "/finance/import/confirm",
        { rows, options },
      )
    ).data,
};
export function downloadJson(data: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
