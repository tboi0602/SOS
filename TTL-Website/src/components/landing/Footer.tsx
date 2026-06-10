import Image from "next/image"
import { NAV_LINKS, SITE_NAME } from "@/utils/constants"
import { Mail, MapPin, Phone, ArrowUp } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative py-16" style={{ borderTop: "0.5px solid var(--glass-border)" }}>
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image
              src="/images/logo.png"
              alt={SITE_NAME}
              width={180}
              height={180}
            />
            <p className="mt-4 text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Tổ chức kiến tạo và bảo chứng giá trị nội dung — Suy tôn Trí tuệ, Lưu truyền Di sản cho Dân tộc Việt Nam.
            </p>
            <div className="gradient-line mt-6 max-w-xs" />
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Liên kết</h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-sm transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Liên hệ</h4>
            <div className="space-y-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
              <p className="flex items-center gap-2"><Mail size={14} /> tinhhoanoidung@gmail.com</p>
              <p className="flex items-center gap-2"><Phone size={14} /> 0834.11.22.88</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> 181 Đề Thám, P. Bến Thành, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="gradient-line mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs italic" style={{ color: "var(--text-dim)" }}>&ldquo;Suy tôn Trí tuệ — Lưu truyền Di sản&rdquo;</p>
          <a href="#hero" className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--text-tertiary)" }}>
            Lên đầu <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </footer>
  )
}
