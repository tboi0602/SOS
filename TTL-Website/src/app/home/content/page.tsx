"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Video, FileText } from "lucide-react";
import JournalPage from "../journal/page";
import VideosPage from "../videos/page";
import PostsPage from "../posts/page";

const TABS = [
  { key: "journal", label: "Nhật ký", icon: BookOpen },
  { key: "videos", label: "Tác phẩm", icon: Video },
  { key: "posts", label: "Bài viết", icon: FileText },
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

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Tab bar */}
        <div
          ref={tabsRef}
          className="relative flex gap-1 p-1 rounded-2xl bg-white/2 border border-white/8 w-fit mb-6"
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
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
          <div
            ref={indicatorRef}
            className="absolute top-1 bottom-1 rounded-xl bg-primary/20 border border-primary/25 transition-all duration-300"
            style={{ width: 0, transform: "translateX(0)" }}
          />
        </div>

        {/* Tab content */}
        <div className="transition-opacity duration-200">
          {tab === "journal" && <JournalPage />}
          {tab === "videos" && <VideosPage />}
          {tab === "posts" && <PostsPage />}
        </div>
      </div>
    </div>
  );
}
