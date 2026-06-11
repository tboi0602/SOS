"use client";

import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";

const BASE_REFERRAL_PATH = "/auth/register?ref=";

export function useReferral() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const [origin, setOrigin] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const code = user?.id ?? "";
  const link = `${origin}${BASE_REFERRAL_PATH}${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}&color=FFFFFF&bgcolor=1A1A1A`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrigin(window.location.origin);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ma-gioi-thieu-${code}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setQrDownloaded(true);
      setTimeout(() => setQrDownloaded(false), 2000);
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  return {
    user,
    code,
    link,
    qrUrl,
    copied,
    qrDownloaded,
    qrRef,
    handleCopyCode,
    handleCopyLink,
    handleDownloadQR,
  };
}
