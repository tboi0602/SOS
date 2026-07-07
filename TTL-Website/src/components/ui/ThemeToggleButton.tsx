"use client"

import { useTheme } from "@/components/ui/ThemeProvider"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggleButton({ className, hideText }: { className?: string; hideText?: boolean }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer hover:opacity-70 ${className || ""}`}
      style={{ color: "var(--text-tertiary)" }}
      aria-label={theme === "dark" ? "Bật chế độ sáng" : "Bật chế độ tối"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      {!hideText && <span>{theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}</span>}
    </button>
  )
}
