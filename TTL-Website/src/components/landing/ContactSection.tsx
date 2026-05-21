"use client";

import { useContact } from "@/hook/landing/useContact"
import { useScrollAnimation } from "@/hook/landing/useScrollAnimation"
import { cn } from "@/utils/cn";
import { CONTACT, CTA } from "@/utils/constants";
import { Send, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { SectionGlow } from "@/components/landing/Effects";

function CTABanner() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <SectionGlow position="center" color="rgba(24,86,255,0.05)" size="ellipse_60%_40%" />

      <div className="absolute inset-0">
        <div className="glass absolute inset-0 rounded-none opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0c1e3a] via-[#0c1e3a]/60 to-[#0c1e3a]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="heading-lg font-bold text-white">{CTA.title}</h2>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto">{CTA.subtitle}</p>

        <div className="divider-gradient mx-auto mt-8 max-w-xs" />

        <a
          href="#contact"
          className="mt-8 inline-flex items-center gap-2 btn-glow px-8 py-4 rounded-2xl text-base font-semibold text-white bg-primary z-10 transition-all"
        >
          <span className="relative z-10 flex items-center gap-2">
            {CTA.button}
            <ArrowRight size={18} />
          </span>
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0c1e3a] to-transparent" />
    </section>
  );
}

function ContactForm() {
  const { form, status, updateField, handleSubmit } = useContact();
  const { ref, visible } = useScrollAnimation(0.1);

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-cyan" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-4">
          <span className="text-[11px] font-semibold text-primary tracking-[0.2em] uppercase">
            {CONTACT.badge}
          </span>
        </div>
        <h2 className="heading-lg font-bold text-white text-center">
          {CONTACT.title.split(" ")[0]}{" "}
          <span className="text-gradient">
            {CONTACT.title.split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <p className="text-center mt-4 text-zinc-400 max-w-lg mx-auto">
          {CONTACT.subtitle}
        </p>

        <div
          ref={ref}
          className={cn(
            "mt-16 grid lg:grid-cols-5 gap-8 items-start transition-all duration-800",
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
              <textarea
                placeholder="Nội dung tin nhắn"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="group relative w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/80 disabled:opacity-50 transition-all shadow-lg shadow-primary/25 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "loading"
                    ? "Đang gửi..."
                    : status === "success"
                      ? "Đã gửi ✓"
                      : status === "error"
                        ? "Gửi lại"
                        : "Gửi tin nhắn"}
                  <Send size={15} />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              {status === "success" && (
                <p className="text-center text-sm text-success">
                  Tin nhắn đã được gửi thành công!
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-danger">
                  Có lỗi xảy ra, vui lòng thử lại.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <p className="text-sm text-white">partner@hita.vn</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center shrink-0">
                <Phone size={20} className="text-cyan" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Hotline</p>
                <p className="text-sm text-white">0904 373 123</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Địa chỉ</p>
                <p className="text-sm text-white">Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactSection() {
  return (
    <>
      <CTABanner />
      <ContactForm />
    </>
  );
}
