import { AxiosError } from "axios";
import api from "./api";

export const getCategoryById = async (id: number) => {
  try {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404)
        throw new Error("Não foi possível encontrar essa categoria.");
    }
  }
};
