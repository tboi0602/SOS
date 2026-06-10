"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useContact } from "@/hook/landing/useContact";
import { useScrollAnimation } from "@/hook/landing/useScrollAnimation";
import { cn } from "@/utils/cn";
import { CONTACT } from "@/utils/constants";
import { Send, Mail, MapPin, Phone, ArrowRight, Sparkles } from "lucide-react";
import { SectionGlow } from "@/components/landing/Effects";

function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%)",
        }}
      />
      <SectionGlow
        position="center"
        color="rgba(139,101,8,0.04)"
        size="ellipse_60%_40%"
      />

      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--surface-base)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-8 text-center">
        <div
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6"
        >
          <Sparkles size={14} className="text-accent" />
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "var(--text-tertiary)" }}
          >
            TINH HOA VIỆT
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Khắc tên vào lịch sử
        </h2>
        <p
          className="mt-3 max-w-lg mx-auto text-sm leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          Đã đến lúc bước ra ánh sáng. Hãy để Tổ chức Tinh Hoa Việt bảo chứng
          cho sự vĩ đại của Quý vị.
        </p>

        <div className="h-px mx-auto mt-8 max-w-xs" style={{ background: "linear-gradient(90deg, transparent, var(--glass-border), transparent)" }} />

        <a
          href="#contact"
          className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-accent hover:bg-accent-dark shadow-lg shadow-accent/25 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            Đề cử ngay
            <ArrowRight size={16} />
          </span>
        </a>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--surface-base), transparent)",
        }}
      />
    </section>
  );
}

function ContactForm() {
  const { form, status, updateField, handleSubmit } = useContact();
  const { ref, visible } = useScrollAnimation(0.1);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "success")
      toast("Tin nhắn đã được gửi thành công!", "success");
    if (status === "error") toast("Có lỗi xảy ra, vui lòng thử lại.", "error");
  }, [status]);

  const fieldStyles =
    "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300";
  const labelStyles = "text-[10px] font-medium tracking-wide uppercase";
  const valueStyles = "text-sm font-medium mt-0.5";

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.02) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold text-primary tracking-[0.2em] uppercase bg-primary/10 rounded-full px-4 py-1.5">
            {CONTACT.badge}
          </span>
          <h2
            className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {CONTACT.title.split(" ")[0]}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {CONTACT.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p
            className="mt-3 text-sm max-w-lg mx-auto"
            style={{ color: "var(--text-tertiary)" }}
          >
            {CONTACT.subtitle}
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "mt-14 grid lg:grid-cols-5 gap-8 items-start transition-all duration-800",
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-7 space-y-4 glass"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`${fieldStyles} focus:ring-1 focus:ring-accent/20`}
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    border: "0.5px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`${fieldStyles} focus:ring-1 focus:ring-accent/20`}
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    border: "0.5px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={`${fieldStyles} focus:ring-1 focus:ring-accent/20`}
                style={{
                  backgroundColor: "var(--surface-elevated)",
                  border: "0.5px solid var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
              <textarea
                placeholder="Nội dung tin nhắn"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={4}
                className={`${fieldStyles} resize-none focus:ring-1 focus:ring-accent/20`}
                style={{
                  backgroundColor: "var(--surface-elevated)",
                  border: "0.5px solid var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="group relative w-full rounded-xl bg-accent py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-accent-dark disabled:opacity-50 transition-all duration-300 shadow-lg shadow-accent/25 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "loading"
                    ? "Đang gửi..."
                    : status === "success"
                      ? "Đã gửi ✓"
                      : status === "error"
                        ? "Gửi lại"
                        : "Gửi tin nhắn"}
                  <Send size={14} />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <div
              className="rounded-xl p-5 flex items-center gap-4 glass transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
              >
                <Mail size={16} className="text-primary" />
              </div>
              <div>
                <p
                  className={labelStyles}
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Email
                </p>
                <p
                  className={valueStyles}
                  style={{ color: "var(--text-primary)" }}
                >
                  {CONTACT.email}
                </p>
              </div>
            </div>
            <div
              className="rounded-xl p-5 flex items-center gap-4 glass transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"
              >
                <Phone size={16} className="text-accent" />
              </div>
              <div>
                <p
                  className={labelStyles}
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Hotline
                </p>
                <p
                  className={valueStyles}
                  style={{ color: "var(--text-primary)" }}
                >
                  {CONTACT.phone}
                </p>
              </div>
            </div>
            <div
              className="rounded-xl p-5 flex items-center gap-4 glass transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"
              >
                <Phone size={16} className="text-accent" />
              </div>
              <div>
                <p
                  className={labelStyles}
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Tiếp nhận Đề cử
                </p>
                <p
                  className={valueStyles}
                  style={{ color: "var(--text-primary)" }}
                >
                  {CONTACT.hotline}
                </p>
              </div>
            </div>
            <div
              className="rounded-xl p-5 flex items-center gap-4 glass transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"
              >
                <MapPin size={16} className="text-accent" />
              </div>
              <div>
                <p
                  className={labelStyles}
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Địa chỉ
                </p>
                <p
                  className={valueStyles}
                  style={{ color: "var(--text-primary)" }}
                >
                  {CONTACT.address}
                </p>
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
