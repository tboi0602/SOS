"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "@/service/auth.service";
import type { User } from "@/service/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    job?: string;
    address?: string;
    referralCode?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "ttl_user";

function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAndPersistUser = useCallback((u: User | null) => {
    setUser(u);
    saveUserToStorage(u);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await authService.me();
      setAndPersistUser(res.user);
    } catch {
      setAndPersistUser(null);
    }
  }, [setAndPersistUser]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const restored = loadUserFromStorage();
      if (restored) {
        setUser(restored);
      }

      fetchUser().finally(() => setLoading(false));
    }, 0);

    return () => {
      window.clearTimeout(restoreTimer);
    };
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authService.login(email, password);
      setAndPersistUser(res.user);
    },
    [setAndPersistUser],
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      job?: string;
      address?: string;
      referralCode?: string;
    }) => {
      const res = await authService.register(data);
      setAndPersistUser(res.user);
      return res.user;
    },
    [setAndPersistUser],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setAndPersistUser(null);
  }, [setAndPersistUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
