"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Hash } from "lucide-react";

export default function CreatePostPage() {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen p-6 animate-fade-up" style={{ background: "var(--surface-base)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Tạo bài viết</h1>
        <div className="card p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full min-h-[200px] resize-none text-sm leading-relaxed outline-none"
            style={{ color: "var(--text-primary)", background: "transparent" }}
          />
          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "0.5px solid var(--border-base)" }}>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
                <ImageIcon size={18} />
              </button>
              <button className="p-2 rounded-lg transition-all cursor-pointer" style={{ color: "var(--text-tertiary)" }}>
                <Hash size={18} />
              </button>
            </div>
            <button
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl bg-accent hover:bg-accent-dark transition-all cursor-pointer"
              style={{ color: "var(--text-primary)" }}
            >
              <Send size={14} /> Đăng bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
