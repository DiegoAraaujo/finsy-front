import { AxiosError } from "axios";
import api from "./api";

export const getExpensesByCategoryId = async (id: number) => {
  try {
    const { data } = await api.get(`/expenses/category/${id}`);
    return data;
  } catch (error) {
    throw new Error("Não foi possível carregar os gastos desta categoria.");
  }
};

export const deleteExpense = async (id: number) => {
  try {
    return await api.delete(`/expenses/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error(
          "Não foi possível encontrar esse gasto. Ele pode já ter sido removido",
        );
      }
    }
  }
  throw new Error(
    "Ocorreu um erro ao tentar excluir o gasto. Tente novamente em instantes.",
  );
};
