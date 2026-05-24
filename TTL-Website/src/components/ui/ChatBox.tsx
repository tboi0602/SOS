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
    text: "👋 Chào bạn! Tôi là trợ lý AI của **SOS** — Hệ thống bán hàng toàn diện.\n\nBạn muốn tìm hiểu về:\n• 🔥 Chương trình đào tạo thực chiến\n• 💼 Cơ hội thu nhập & học bổng\n• 🎯 Lộ trình phát triển bản thân\n\nHãy đặt câu hỏi, tôi sẽ giải đáp ngay!",
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
        className={`shrink-0 flex items-center justify-center ${isAI ? "" : "w-8 h-8 rounded-xl bg-cyan/20 border border-cyan/30"}`}
      >
        {isAI ? (
          <Image
            src="/images/logo.png"
            alt="SOS"
            width={28}
            height={28}
            unoptimized
          />
        ) : (
          <User size={15} className="text-cyan" />
        )}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAI ? "glass rounded-tl-sm" : "bg-primary/20 border border-primary/20 rounded-tr-sm"}`}
      >
        <div className="text-zinc-200 [&_strong]:text-white whitespace-pre-line">
          {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="text-white">
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
  "Cảm ơn bạn đã quan tâm! Đội ngũ tư vấn của **SOS** sẽ liên hệ với bạn trong thời gian sớm nhất để giải đáp chi tiết.\n\nBạn cũng có thể gọi hotline **0904 373 123** để được hỗ trợ ngay nhé! 💙";

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
            className="w-90 sm:w-100 rounded-2xl bg-[#0c1e3a]/95 backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/30 overflow-hidden origin-bottom-right"
          >
            <div className="flex items-center justify-between  px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="SOS"
                  width={36}
                  height={36}
                  unoptimized
                />
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                    SOS AI
                    <Sparkles size={12} className="text-cyan" />
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Trợ lý ảo — Hệ thống bán hàng toàn diện
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Đóng chat"
              >
                <X size={16} className="text-zinc-400" />
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
                    src="/images/logo.png"
                    alt="SOS"
                    width={28}
                    height={28}
                    unoptimized
                  />
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-white/6 p-4 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                disabled={loading}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary-light text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
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
        className=" group relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={open ? "Đóng chat" : "Mở chat"}
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 backdrop-blur-xl border border-white/20 shadow-xl shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300" />
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center justify-center">
          {open ? (
            <X size={22} className="text-white" />
          ) : (
            <Image
              src="/images/logo.png"
              alt="Chat"
              width={32}
              height={32}
              className="brightness-0 invert drop-shadow-lg"
              unoptimized
            />
          )}
        </span>
        {!open && (
          <>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-[#0c1e3a] z-20" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5  rounded-full bg-success animate-ping border-2 border-[#0c1e3a] z-19" />
          </>
        )}
      </button>
    </div>
  );
}
