"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/service/auth.service";

export function useAuthRegister() {
  const router = useRouter();
  const { register, user, refreshUser } = useAuth();
  const [form, setForm] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      return {
        name: "",
        email: "",
        password: "",
        job: "",
        address: "",
        referralCode: ref || "",
      };
    }
    return { name: "", email: "", password: "", job: "", address: "", referralCode: "" };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [referralStatus, setReferralStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [referralName, setReferralName] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  useEffect(() => {
    const code = form.referralCode.trim();
    let active = true;
    let statusTimer: ReturnType<typeof setTimeout> | undefined;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!code) {
      statusTimer = setTimeout(() => {
        if (active) {
          setReferralStatus("idle");
          setReferralName("");
        }
      }, 0);
      return () => {
        active = false;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (statusTimer) clearTimeout(statusTimer);
      };
    }

    statusTimer = setTimeout(() => {
      if (!active) return;
      setReferralStatus("checking");
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await authService.checkReferral(code);
          if (!active) return;
          if (res.valid) {
            setReferralStatus("valid");
            setReferralName(res.name ?? "");
          } else {
            setReferralStatus("invalid");
            setReferralName("");
          }
        } catch {
          if (active) {
            setReferralStatus("idle");
            setReferralName("");
          }
        }
      }, 500);
    }, 0);

    return () => {
      active = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (statusTimer) clearTimeout(statusTimer);
    };
  }, [form.referralCode]);

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
        referralCode: form.referralCode || undefined,
      });
      router.push("/home");
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
    referralStatus,
    referralName,
    setShowPassword,
    updateField,
    handleSubmit,
    handleGoogle,
  };
}
