"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/service/auth.service";

export function useAuthLogin() {
  const router = useRouter();
  const { login, user, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsActivation, setNeedsActivation] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(
        user.role === "admin" ||
          (Array.isArray(user.permissions) && user.permissions.length > 0)
          ? "/admin"
          : "/home",
      );
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsActivation(false);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(msg);
      if (msg.toLowerCase().includes("kích hoạt")) setNeedsActivation(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential: string) => {
    setGoogleLoading(true);
    setError("");
    try {
      await authService.googleLogin(credential);
      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đăng nhập Google thất bại",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResendActivation = async () => {
    try {
      await authService.resendActivation(email);
      setError("");
    } catch {}
  };

  return {
    email,
    password,
    showPassword,
    loading,
    googleLoading,
    error,
    needsActivation,
    setEmail,
    setPassword,
    setShowPassword,
    handleSubmit,
    handleGoogle,
    handleResendActivation,
  };
}
