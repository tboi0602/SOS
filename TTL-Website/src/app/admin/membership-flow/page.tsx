"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, CreditCard, Users, Settings } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PendingDocsTab from "@/components/admin/membership/PendingDocsTab"
import PendingPaymentsTab from "@/components/admin/membership/PendingPaymentsTab"
import ActiveMembersTab from "@/components/admin/membership/ActiveMembersTab"
import SettingsTab from "@/components/admin/membership/SettingsTab"

gsap.registerPlugin(ScrollTrigger)

const TABS = [
  { key: "pending-docs", label: "Chờ duyệt hồ sơ", icon: Upload },
  { key: "pending-payments", label: "Chờ xác minh TT", icon: CreditCard },
  { key: "active", label: "Hội viên đang học", icon: Users },
  { key: "settings", label: "Cấu hình", icon: Settings },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function AdminMembershipFlowPage() {
  const [tab, setTab] = useState<TabKey>("pending-docs")
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tabsRef.current
    const indicator = indicatorRef.current
    if (!el || !indicator) return
    const active = el.querySelector<HTMLButtonElement>(`[data-mf-tab="${tab}"]`)
    if (!active) return
    indicator.style.width = `${active.offsetWidth}px`
    indicator.style.transform = `translateX(${active.offsetLeft}px)`
  }, [tab])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        if (headerRef.current) {
          gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.4, ease: "power3.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" } })
        }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up">
      <div className="max-w-7xl mx-auto space-y-8">
        <div ref={headerRef}>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} /> Quản lý đăng ký thành viên
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Quản lý các bước trong luồng đăng ký hội viên
          </p>
        </div>

        <div className="relative flex gap-1 p-1 rounded-2xl w-fit" style={{
          background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
          boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
          border: "0.5px solid var(--border-base)",
        }}>
          <div ref={tabsRef} className="flex gap-1">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  data-mf-tab={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors duration-200 cursor-pointer min-h-10 ${
                    active ? "text-primary" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              )
            })}
          </div>
          <div
            ref={indicatorRef}
            className="absolute top-1 bottom-1 rounded-xl transition-all duration-300 pointer-events-none"
            style={{ width: 0, transform: "translateX(0)", background: "color-mix(in srgb, var(--clr-primary) 25%, transparent)", border: "0.5px solid color-mix(in srgb, var(--clr-primary) 40%, transparent)" }}
          />
        </div>

        <div ref={contentRef}>
          {tab === "pending-docs" && <PendingDocsTab />}
          {tab === "pending-payments" && <PendingPaymentsTab />}
          {tab === "active" && <ActiveMembersTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}
