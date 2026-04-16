import {
  getRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from "../utils/auth";
import api from "./api";
import axios, { AxiosError } from "axios";

export const createUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const { data } = await api.post("/users", { email, password, name });

    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

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

export const updateUser = async (updates: {
  email?: string;
  name?: string;
}) => {
  try {
    const { data } = await api.put("/users", updates);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 409) {
        throw new Error("Este Email já esta em uso!");
      }
    }

    throw new Error("Não foi possível atualizar dados");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/users/login", { email, password });

    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

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

export const logOut = async () => {
  try {
    removeRefreshToken();
  } catch (error) {
    throw new Error("Ocorreu um erro ao tentar encerrar a sessão");
  }
};

export const refreshToken = async () => {
  try {
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) throw new Error("No refresh token stored");

    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/refresh`,
      {},
      { headers: { Authorization: `Bearer ${storedRefresh}` } },
    );

    return data.accessToken;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    throw error;
  }
};
