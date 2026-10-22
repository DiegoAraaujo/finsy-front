import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../utils/auth";
import { refreshToken } from "./userService";
import { userError } from "../utils/userError";

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error || new Error("Refresh failed"));
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      config.headers.delete("Authorization");
    }

    return config;
  },
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    error.message = userError(error);
    if (error.response) {
      const payload = error.response.data;
      error.response.data = {
        code:
          payload && typeof payload === "object"
            ? (payload as { code?: unknown }).code
            : undefined,
        message: error.message,
      };
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isPublicAuth =
      originalRequest?.url === "/users/forgot-password" ||
      originalRequest?.url === "/users/reset-password" ||
      originalRequest?.url === "/users/confirm-email" ||
      originalRequest?.url === "/users/login" ||
      (originalRequest?.url === "/users" && originalRequest?.method === "post");
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !isPublicAuth &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();

        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAccessToken();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
