import type { CategoryExpenses } from "../pages/CategoryExpenses/interface";

export const expensesMock: CategoryExpenses[] = [
  {
    categoryId: 1,
    name: "Comida",
    expenses: [
      {
        id: 1,
        categoryId: 1,
        value: 45.5,
        date: "2026-02-01",
        paymentMethod: "CreditCard",
      },
      {
        id: 4,
        categoryId: 1,
        value: 32.2,
        date: "2026-02-04",
        paymentMethod: "Cash",
      },
      {
        id: 9,
        categoryId: 1,
        value: 27.8,
        date: "2026-02-09",
        paymentMethod: "DebitCard",
      },
      {
        id: 14,
        categoryId: 1,
        value: 40.0,
        date: "2026-02-14",
        paymentMethod: "Pix",
      },
    ],
    total: 45.5 + 32.2 + 27.8 + 40.0,
  },
  {
    categoryId: 2,
    name: "Transporte",
    expenses: [
      {
        id: 2,
        categoryId: 2,
        value: 12.3,
        date: "2026-02-02",
        paymentMethod: "Cash",
      },
      {
        id: 6,
        categoryId: 2,
        value: 15.5,
        date: "2026-02-06",
        paymentMethod: "CreditCard",
      },
      {
        id: 11,
        categoryId: 2,
        value: 18.0,
        date: "2026-02-11",
        paymentMethod: "DebitCard",
      },
    ],
    total: 12.3 + 15.5 + 18.0,
  },
  {
    categoryId: 3,
    name: "Entretenimento",
    expenses: [
      {
        id: 3,
        categoryId: 3,
        value: 80.0,
        date: "2026-02-03",
        paymentMethod: "CreditCard",
      },
      {
        id: 8,
        categoryId: 3,
        value: 50.0,
        date: "2026-02-08",
        paymentMethod: "Cash",
      },
      {
        id: 13,
        categoryId: 3,
        value: 90.0,
        date: "2026-02-13",
        paymentMethod: "Pix",
      },
    ],
    total: 80.0 + 50.0 + 90.0,
  },
  {
    categoryId: 4,
    name: "Shopping",
    expenses: [
      {
        id: 5,
        categoryId: 4,
        value: 120.0,
        date: "2026-02-05",
        paymentMethod: "CreditCard",
      },
      {
        id: 10,
        categoryId: 4,
        value: 60.0,
        date: "2026-02-10",
        paymentMethod: "DebitCard",
      },
      {
        id: 15,
        categoryId: 4,
        value: 75.0,
        date: "2026-02-15",
        paymentMethod: "Pix",
      },
    ],
    total: 120.0 + 60.0 + 75.0,
  },
];

export default expensesMock;
