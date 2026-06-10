"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              shape?: "rectangular" | "pill" | "circle" | "square";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface Props {
  onSuccess: (credential: string) => void;
  loading?: boolean;
}

export default function GoogleLoginButton({
  onSuccess,
  loading = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    const check = () => {
      if (window.google) {
        setScriptReady(true);
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!scriptReady || initialized.current || !containerRef.current) return;
    initialized.current = true;

    window.google!.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      callback: (res) => onSuccessRef.current(res.credential),
    });

    window.google!.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      shape: "rectangular",
      theme: "outline",
      size: "large",
      text: "continue_with",
    });
  }, [scriptReady]);

  if (!scriptReady) {
    return null;
  }

  return (
    <div className="relative w-full min-h-10">
      <div ref={containerRef} className="w-full" />
      {loading && (
        <div  className="cursor-not-allowed absolute inset-0 flex items-center justify-center gap-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xs" style={{ color: "var(--text-tertiary)" }}>
          <Loader2 size={16} className="animate-spin" />
          Đang xử lý...
        </div>
      )}
    </div>
  );
}
