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
      <label htmlFor={id} className="text-sm text-zinc-400 font-medium">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all ${className}`}
      />
    </div>
  )
}
