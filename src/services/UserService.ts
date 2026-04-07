import api from "./api";
import { AxiosError } from "axios";

export const createUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const { data } = await api.post("/users", { email, password, name });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 409) {
        throw new Error("Este Email já esta em uso!");
      }
    }

    throw new Error("Não foi possível realizar cadastro");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/users/login", { email, password });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 400 || status === 401) {
        throw new Error("Email ou senha incorretos");
      }
    }

    throw new Error("Não foi possível realizar o login");
  }
};

export const refreshToken = async () => {
  try {
    const { data } = await api.post("/users/refresh");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }
    }
    throw new Error("Não foi possível renovar sua sessão. Tente novamente.");
  }
};

export const logOut = async () => {
  try {
    const { data } = await api.post("/users/logout");
    return data;
  } catch (error) {
    throw new Error("Ocorreu um erro ao tentar encertrar a sessão");
  }
};
