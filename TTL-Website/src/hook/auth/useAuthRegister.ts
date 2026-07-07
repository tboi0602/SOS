"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/service/auth.service";

export function useAuthRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, refreshUser } = useAuth();
  const [registered, setRegistered] = useState(false);
  const refCode = searchParams.get("ref") || "";
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    password: "",
    job: "",
    address: "",
    referralCode: refCode,
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralName, setReferralName] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const validatedRef = useRef(false);

  useEffect(() => {
    if (user && user.isActive) router.push("/home");
  }, [user, router]);

  useEffect(() => {
    if (refCode && !validatedRef.current) {
      validatedRef.current = true;
      handleReferralChange(refCode);
    }
  }, [refCode]);

  const updateField = (f: string, v: string) =>
    setForm((p) => ({ ...p, [f]: v }));

  const handleReferralChange = (value: string) => {
    updateField("referralCode", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setReferralValid(null);
      setReferralName(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await authService.checkReferral(value.trim());
        setReferralValid(res.valid);
        setReferralName(res.name);
      } catch {
        setReferralValid(false);
        setReferralName(null);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        ...form,
        job: form.job || undefined,
        address: form.address || undefined,
        referralCode: form.referralCode.trim() || undefined,
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
      const res = await authService.googleLogin(credential);
      if (res.token) localStorage.setItem("auth_token", res.token);
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
    referralValid,
    referralName,
    setShowPassword,
    updateField,
    handleReferralChange,
    handleSubmit,
    handleGoogle,
  };
}
