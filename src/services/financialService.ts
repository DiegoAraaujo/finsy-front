import expensesMock from "../data/expenses";

export const getFinances = async () => {
  return { salary: 1200, expenses: 600 };
};

export const getExpenses = async (categoryId: number) => {
  const data = expensesMock.filter((e) => e.categoryId === categoryId);
  return data;
};
