import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth";
import { onUnauthorized, tokenStorage } from "@/api/client";
import type { UserSummary } from "@/types";

const USER_KEY = "escobar.user";

interface AuthContextValue {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<UserSummary>;
  register: (payload: RegisterPayload) => Promise<UserSummary>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored && tokenStorage.getAccessToken()) {
      setUser(JSON.parse(stored));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    onUnauthorized(() => {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    });
  }, []);

  const persist = useCallback((nextUser: UserSummary, accessToken: string, refreshToken: string) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      persist(response.user, response.accessToken, response.refreshToken);
      return response.user;
    },
    [persist],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      persist(response.user, response.accessToken, response.refreshToken);
      return response.user;
    },
    [persist],
  );

  const logout = useCallback(() => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => undefined);
    }
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isReady, login, register, logout }),
    [user, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
