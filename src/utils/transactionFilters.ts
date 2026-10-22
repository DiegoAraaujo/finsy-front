import type { Transaction } from "../services/finance";
import { matchesStatus } from "./transactionState";

export interface TransactionFilters {
  kind: string;
  status: string;
  category: string;
  paymentMethod: string;
  from: string;
  to: string;
  minimum: number;
  maximum: number;
  order: string;
}

export const defaultTransactionFilters: TransactionFilters = {
  kind: "ALL",
  status: "ALL",
  category: "ALL",
  paymentMethod: "ALL",
  from: "",
  to: "",
  minimum: 0,
  maximum: 0,
  order: "NEWEST",
};

export function filterTransactions(
  entries: Transaction[],
  search: string,
  filters: TransactionFilters,
) {
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const result = entries.filter(
    (entry) =>
      `${entry.description} ${entry.category?.name ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query) &&
      (filters.kind === "ALL" || entry.kind === filters.kind) &&
      matchesStatus(entry, filters.status) &&
      (filters.category === "ALL" ||
        (filters.category === "NONE"
          ? entry.categoryId === null
          : entry.categoryId === Number(filters.category))) &&
      (filters.paymentMethod === "ALL" ||
        entry.paymentMethod === filters.paymentMethod) &&
      (!filters.from || entry.date >= filters.from) &&
      (!filters.to || entry.date <= filters.to) &&
      Math.round(entry.amount * 100) >= Math.round(filters.minimum * 100) &&
      (!filters.maximum ||
        Math.round(entry.amount * 100) <= Math.round(filters.maximum * 100)),
  );
  return result.sort((a, b) => {
    if (filters.order === "HIGHEST") return b.amount - a.amount || b.id - a.id;
    if (filters.order === "LOWEST") return a.amount - b.amount || a.id - b.id;
    if (filters.order === "OLDEST")
      return a.date.localeCompare(b.date) || a.id - b.id;
    return b.date.localeCompare(a.date) || b.id - a.id;
  });
}
