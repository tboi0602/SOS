"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Sparkles } from "lucide-react";
import Image from "next/image";
import { chatService } from "@/service/chat.service";

type Message = {
  role: "ai" | "user";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    text: "👋 Chào bạn! Tôi là trợ lý AI của **TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT** \n Bạn đang thắc mắc điều gì? \nHãy đặt câu hỏi, tôi sẽ giải đáp ngay!",
  },
];

function ChatMessage({ msg }: { msg: Message }) {
  const isAI = msg.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`shrink-0 flex items-center justify-center ${isAI ? "" : "w-8 h-8 rounded-xl bg-accent/20 border border-accent/30"}`}
      >
        {isAI ? (
          <Image
            src="/images/tbv-logo.png"
            alt="TINHHOAVIET"
            width={28}
            height={28}
            unoptimized
          />
        ) : (
          <User size={15} className="text-accent" />
        )}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAI ? "glass rounded-tl-sm" : "bg-primary/20 border border-primary/20 rounded-tr-sm"}`}
      >
        <div
          className="whitespace-pre-line"
          style={{ color: "var(--text-secondary)" }}
        >
          {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} style={{ color: "var(--text-primary)" }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}

const FALLBACK =
  "Cảm ơn bạn đã quan tâm! Đội ngũ tư vấn của **TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT** sẽ liên hệ với bạn trong thời gian sớm nhất để giải đáp chi tiết.\n\nBạn cũng có thể gọi hotline **0904 373 123** để được hỗ trợ ngay nhé! 💙";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const updated = [...messages, { role: "user", text } as Message];
    setMessages(updated);
    setLoading(true);

    try {
      const data = await chatService.send(updated);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.text || FALLBACK },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: FALLBACK }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-26 right-6 z-60 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.92, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.92, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-90 sm:w-100 rounded-2xl bg-[var(--surface-elevated)]/95 backdrop-blur-xl shadow-2xl overflow-hidden origin-bottom-right"
            style={{ border: "1px solid var(--border-base)" }}
          >
            <div
              className="flex items-center justify-between  px-5 py-4"
              style={{ borderBottom: "1px solid var(--border-base)" }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/images/tbv-logo.png"
                  alt="TINHHOAVIET"
                  width={36}
                  height={36}
                  unoptimized
                />
                <div>
                  <p
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT
                    <Sparkles size={12} className="text-accent" />
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Trợ lý ảo — TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT - ĐỐI TÁC
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Đóng chat"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "color-mix(in srgb, var(--text-primary) 10%, transparent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <X size={16} style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>

            <div
              ref={listRef}
              className="h-90 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} msg={msg} />
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <Image
                    src="/images/tbv-logo.png"
                    alt="tinhhoaviet"
                    width={28}
                    height={28}
                    unoptimized
                  />
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0ms",
                          background: "var(--text-tertiary)",
                        }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          animationDelay: "150ms",
                          background: "var(--text-tertiary)",
                        }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          animationDelay: "300ms",
                          background: "var(--text-tertiary)",
                        }}
                      />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div
              className="p-4 flex items-center gap-2"
              style={{ borderTop: "1px solid var(--border-base)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm placeholder:text-[var(--text-tertiary)] focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all disabled:opacity-50"
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-base)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary-light text-[var(--text-primary)] flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Gửi"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className=" group relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={open ? "Đóng chat" : "Mở chat"}
      >
        <div
          className="absolute inset-0 rounded-full bg-primary/20 backdrop-blur-xl shadow-xl shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300"
          style={{ border: "1px solid var(--border-base)" }}
        />
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center justify-center">
          {open ? (
            <X size={22} className="text-[var(--text-primary)]" />
          ) : (
            <Image
              src="/images/tbv-logo.png"
              alt="Chat"
              width={52}
              height={52}
              className=" drop-shadow-lg"
              unoptimized
            />
          )}
        </span>
        {!open && (
          <>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-[var(--surface-elevated)] z-20" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5  rounded-full bg-success animate-ping border-2 border-[var(--surface-elevated)] z-19" />
          </>
        )}
      </button>
    </div>
  );
}
