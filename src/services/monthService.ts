import { AxiosError } from "axios";
import api from "./api";

export const getLastestMonth = async () => {
  try {
    const { data } = await api.get("/months/latest");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error("Ocorreu um erro ao tentar buscar o ultimo mês");
    }
  }
};

export const getCurrentMonth = async () => {
  try {
    const { data } = await api.get("/months/current");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error("Ocorreu um erro ao buscar o mês atual");
    }
  }
};
