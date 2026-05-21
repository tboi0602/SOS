import Image from "next/image"
import { NAV_LINKS, SITE_NAME } from "@/utils/constants"
import { Mail, MapPin, Phone, ArrowUp } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative border-t border-white/4 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt={SITE_NAME}
                width={40}
                height={40}
              />
              <span className="text-lg font-bold bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">{SITE_NAME}</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-sm">
              Đánh thức tiềm năng — Kiến tạo tương lai. Trang bị hành trang Sales &amp; Marketing thực chiến cho thế hệ trẻ Việt Nam.
            </p>
            <div className="gradient-line mt-6 max-w-xs" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liên kết</h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liên hệ</h4>
            <div className="space-y-3 text-sm text-zinc-500">
              <p className="flex items-center gap-2"><Mail size={14} /> partner@hita.vn</p>
              <p className="flex items-center gap-2"><Phone size={14} /> 0904 373 123</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>
        </div>

        <div className="divider-gradient mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700 italic">&ldquo;Kỷ luật là tài chính của thành công!&rdquo;</p>
          <a href="#hero" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-primary transition-colors">
            Lên đầu <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </footer>
  )
}
