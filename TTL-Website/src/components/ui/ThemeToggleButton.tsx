"use client"

import { useTheme } from "@/components/ui/ThemeProvider"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggleButton({ className, hideText, variant }: { className?: string; hideText?: boolean; variant?: string }) {
  const { theme, toggle } = useTheme()

  const fixed = variant !== "sidebar" && variant !== "header";

  return (
    <button
      onClick={toggle}
      className={`${fixed ? "fixed bottom-6 right-6 z-50" : ""} p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-105 ${className || ""}`}
      style={{
        background: "var(--glass)",
        border: "0.5px solid var(--glass-border)",
        color: "var(--text-tertiary)",
      }}
      aria-label={theme === "dark" ? "Bật chế độ sáng" : "Bật chế độ tối"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      {hideText ? null : null}
    </button>
  )
}
