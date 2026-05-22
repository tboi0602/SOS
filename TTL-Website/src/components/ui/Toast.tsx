"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
}

const COLORS = {
  success: { bg: "bg-emerald-500/15", border: "border-emerald-500/25", icon: "text-emerald-400" },
  error: { bg: "bg-danger/15", border: "border-danger/25", icon: "text-danger" },
  info: { bg: "bg-primary/15", border: "border-primary/25", icon: "text-primary" },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now()
    setItems((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = (id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-200 flex flex-col gap-2 pointer-events-none">
        {items.map((item) => {
          const Icon = ICONS[item.type]
          const colors = COLORS[item.type]
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl ${colors.bg} ${colors.border} border shadow-2xl backdrop-blur-xl min-w-72 max-w-sm animate-[slideUp_0.3s_ease-out]`}
            >
              <Icon size={18} className={`shrink-0 ${colors.icon}`} />
              <p className="flex-1 text-sm text-white">{item.message}</p>
              <button onClick={() => removeToast(item.id)} className="p-0.5 text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
