"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/service/auth.service";

export function useAuthRegister() {
  const router = useRouter();
  const { register, user, refreshUser } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    password: "",
    job: "",
    address: "",
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (user && user.isActive) router.push("/home");
  }, [user, router]);

  const updateField = (f: string, v: string) =>
    setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        ...form,
        job: form.job || undefined,
        address: form.address || undefined,
      });
      setRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
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
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký Google thất bại");
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    form,
    showPassword,
    loading,
    googleLoading,
    error,
    registered,
    setShowPassword,
    updateField,
    handleSubmit,
    handleGoogle,
  };
}
