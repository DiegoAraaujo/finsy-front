import { removeRefreshToken } from "../utils/auth";
import { removeAccessToken } from "../utils/auth";
import api from "./api";
import axios, { AxiosError } from "axios";
import { userError } from "../utils/userError";
import { TERMS_VERSION } from "@/lib/legal";

export const createUser = async (
  email: string,
  password: string,
  name: string,
  confirmPassword: string,
  acceptsTerms: boolean,
) => {
  try {
    const { data } = await api.post("/users", { email, password, name, confirmPassword, termsVersion: acceptsTerms ? TERMS_VERSION : undefined });

    removeRefreshToken();

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
  currentPassword?: string;
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

    throw new Error(
      userError(error, "Não foi possível atualizar seus dados agora."),
    );
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/users/login", { email, password });

    removeRefreshToken();

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
    await api.post("/users/logout");
    removeAccessToken();
    removeRefreshToken();
  } catch {
    throw new Error("Ocorreu um erro ao tentar encerrar a sessão");
  }
};

const performRefresh = async () => {
  try {
    const { data } = await axios.post(
      "/api/users/refresh",
      {},
      { withCredentials: true },
    );

    if (typeof data.accessToken !== "string" || !data.accessToken)
      throw new Error("Session unavailable");
    return data.accessToken;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }
    throw error;
  }
};

let refreshPromise: Promise<string> | null = null;
export const refreshToken = async (): Promise<string> => {
  if (!refreshPromise) {
    const run = () => performRefresh() as Promise<string>;
    refreshPromise = (async () =>
      navigator.locks
        ? await navigator.locks.request("finsy-refresh", run)
        : await run())().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise!;
};
