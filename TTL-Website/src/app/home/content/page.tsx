"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Video, FileText, Camera } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JournalPage from "../journal/page";
import VideosPage from "../videos/page";
import PostsPage from "../posts/page";
import CustomerVisitsTab from "@/components/content/CustomerVisitsTab";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  { key: "journal", label: "Đạo đức", icon: BookOpen },
  { key: "videos", label: "Kỷ luật", icon: Video },
  { key: "posts", label: "Bài đăng", icon: FileText },
  { key: "customer-visits", label: "Lan Toả", icon: Camera },
] as const;

export default function ContentPage() {
  const [tab, setTab] = useState<string>("journal");
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabs = tabsRef.current;
    const indicator = indicatorRef.current;
    if (!tabs || !indicator) return;
    const active = tabs.querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`);
    if (!active) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [tab]);

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el.querySelector(".content-tabs"), { y: 20, opacity: 0, duration: 0.4, force3D: true, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef} className="min-h-dvh animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Tab bar */}
        <div
          ref={tabsRef}
          className="content-tabs relative flex gap-1 p-1 rounded-2xl w-fit mb-6"
          style={{
            background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
            boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
            border: "0.5px solid var(--border-base)",
          }}
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                data-tab={t.key}
                onClick={() => setTab(t.key)}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer min-h-10 ${
                  active ? "text-primary" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
          <div
            ref={indicatorRef}
            className="absolute top-1 bottom-1 rounded-xl transition-all duration-300"
            style={{ width: 0, transform: "translateX(0)", background: "color-mix(in srgb, var(--clr-primary) 25%, transparent)", border: "0.5px solid color-mix(in srgb, var(--clr-primary) 40%, transparent)" }}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="transition-opacity duration-200">
        {tab === "journal" && <JournalPage />}
        {tab === "videos" && <VideosPage />}
        {tab === "posts" && <PostsPage />}
        {tab === "customer-visits" && <CustomerVisitsTab />}
      </div>
    </div>
  );
}
