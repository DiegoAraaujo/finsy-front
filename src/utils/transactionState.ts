import type { TransactionInput } from "../services/finance";

export function isRealized(entry: TransactionInput) {
  return entry.status === "COMPLETED" || (!!entry.cardId && !entry.isForecast);
}

export function matchesStatus(entry: TransactionInput, status: string) {
  if (status === "ALL") return true;
  if (status === "REALIZED") return isRealized(entry);
  if (status === "FORECAST") return !isRealized(entry);
  return entry.status === status;
}
