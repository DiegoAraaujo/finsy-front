import api from "./api";
export interface Recurrence {
  id: string;
  kind: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  paymentMethod: string;
  cardId: number | null;
  card?: { name: string } | null;
  day: number;
  startDate: string;
  endDate: string | null;
  cancelledAt: string | null;
}
export const recurrences = {
  list: async () => (await api.get<Recurrence[]>("/finance/recurrences")).data,
  get: async (id: string) =>
    (await api.get<Recurrence>(`/finance/recurrences/${id}`)).data,
  update: (
    id: string,
    input: Pick<Recurrence, "amount" | "description" | "day" | "endDate">,
  ) => api.put(`/finance/recurrences/${id}`, input),
  cancel: (id: string) => api.post(`/finance/recurrences/${id}/cancel`),
};
