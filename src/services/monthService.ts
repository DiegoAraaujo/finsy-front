import { AxiosError } from "axios";
import api from "./api";
import type { Category } from "../pages/createMonth/interface";

export const createMonth = async (salary: number, categories: Category[]) => {
  try {
    const { data } = await api.post("/months", { salary, categories });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 409) {
        throw new Error("Esse mês já foi criado.");
      }

      if (status === 400) {
        throw new Error(
          "Você reservou mais dinheiro nas categorias do que o seu salário permite.",
        );
      }
    }
    throw new Error("Ocorreu um erro ao criar o mês. Tente novamente.");
  }
};

export const getLastestMonth = async () => {
  try {
    const { data } = await api.get("/months/latest");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
return null      }
      throw new Error("Ocorreu um erro ao tentar buscar o ultimo mês");
    }
  }
};

export const getCurrentMonth = async () => {
  try {
    const { data } = await api.get("/months/current");
    console.log("current deu certo!");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        return null;
      }

      throw new Error("Ocorreu um erro ao buscar o mês atual");
    }
  }
};
