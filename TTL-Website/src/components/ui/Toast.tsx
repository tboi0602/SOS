"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  message: string
  type: ToastType
}

const ToastContext = createContext<{ toast: (message: string, type?: ToastType) => void }>({
  toast: () => {},
})

export const useToast = () => useContext(ToastContext)

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const COLORS = {
  success: { bg: "color-mix(in srgb, var(--color-success) 12%, transparent)", border: "color-mix(in srgb, var(--color-success) 25%, transparent)", text: "#07ca6b" },
  error: { bg: "color-mix(in srgb, var(--color-danger) 12%, transparent)", border: "color-mix(in srgb, var(--color-danger) 25%, transparent)", text: "#ea2143" },
  info: { bg: "color-mix(in srgb, var(--color-accent) 12%, transparent)", border: "color-mix(in srgb, var(--color-accent) 25%, transparent)", text: "var(--color-accent)" },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-60 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          const c = COLORS[t.type]
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-72 max-w-md pointer-events-auto animate-fade-up"
              style={{ background: c.bg, border: `0.5px solid ${c.border}`, color: "var(--text-primary)" }}
            >
              <Icon size={16} style={{ color: c.text }} />
              <span className="text-sm flex-1">{t.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="cursor-pointer"
                style={{ color: "var(--text-tertiary)" }}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
