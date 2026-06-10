"use client";

import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: (e?: React.MouseEvent) => void;
}>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("thv-theme") as Theme | null;
    const initial = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = useCallback((e?: React.MouseEvent) => {
    const reduced = prefersReducedMotion();

    if (!reduced && e?.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--toggle-x", `${x}%`);
      document.documentElement.style.setProperty("--toggle-y", `${y}%`);
    }

    if (!reduced) {
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.display = "block";
        overlay.classList.remove("theme-toggle-clip");
        void overlay.offsetWidth;
        overlay.classList.add("theme-toggle-clip");
      }
    }

    setTimeout(() => {
      setTheme((prev) => {
        const next = prev === "dark" ? "light" : "dark";
        localStorage.setItem("thv-theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
        return next;
      });
      if (!reduced && overlayRef.current) overlayRef.current.style.display = "none";
    }, reduced ? 0 : 150);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none hidden"
        style={{
          backgroundColor: theme === "dark" ? "#FAFAFA" : "#121212",
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}
