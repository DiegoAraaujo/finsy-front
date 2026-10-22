"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext, type User } from "./user-context";
import api from "../services/api";
import { refreshToken } from "../services/userService";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  bindAccessTokenStore,
} from "../utils/auth";

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const client = useQueryClient();
  const userIdRef = useRef<number | null>(null);
  const setUser = useCallback((next: User | null) => {
    if (userIdRef.current !== (next?.id ?? null)) client.clear();
    userIdRef.current = next?.id ?? null;
    setUserState(next);
  }, [client]);
  const [isRestoring, setIsRestoring] = useState(true);
  const [accessToken, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const disconnect = bindAccessTokenStore({
      get: () => tokenRef.current,
      set: (token) => {
        tokenRef.current = token;
        setToken(token);
      },
    });
    removeRefreshToken();
    async function restore() {
      try {
        if (!getAccessToken()) {
          setAccessToken(await refreshToken());
        }
        const { data } = await api.get<{ user: User }>("/users/me");
        if (active) setUser(data.user);
      } catch {
        if (active) {
          removeAccessToken();
          removeRefreshToken();
        }
      } finally {
        if (active) setIsRestoring(false);
      }
    }
    void restore();
    return () => {
      active = false;
      disconnect();
      tokenRef.current = null;
    };
  }, [setUser]);

  return (
    <UserContext.Provider value={{ user, setUser, isRestoring, accessToken }}>
      {children}
    </UserContext.Provider>
  );
};
