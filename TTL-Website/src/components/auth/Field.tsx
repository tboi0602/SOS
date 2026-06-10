"use client"

export default function Field({
  label, id, value, onChange, placeholder,
  type = "text", required, className = "",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean; className?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all ${className}`}
        style={{ background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", borderColor: "var(--border-base)", color: "var(--text-primary)" }}
      />
    </div>
  )
}
