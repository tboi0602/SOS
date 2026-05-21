"use client"

import { useRouter, usePathname } from "next/navigation"
import { User, Gift, BookOpen, Video } from "lucide-react"

const TABS = [
  { href: "/home/profile", label: "Hồ sơ", icon: User },
  { href: "/home/referral", label: "Mã giới thiệu", icon: Gift },
  { href: "/home/journal", label: "Nhật ký", icon: BookOpen },
  { href: "/home/videos", label: "Tác phẩm", icon: Video },
]

export default function PersonalTabs() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-6 overflow-x-auto">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const active = pathname === tab.href
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all cursor-pointer ${
              active
                ? "text-white bg-primary/15 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/6"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
