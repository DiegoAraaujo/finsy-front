import { AxiosError } from "axios";
import api from "./api";

export const getDashboard = async () => {
  try {
    const { data } = await api.get("/dashboard");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        return null;
      }
      throw new Error("Ocorreu um erro ao carregar o dashboard");
    }
  }
};
