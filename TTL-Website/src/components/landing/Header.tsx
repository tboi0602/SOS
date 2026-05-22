"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/utils/cn";
import { NAV_LINKS, SITE_NAME } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, LogOut, ChevronDown, Settings } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const progressBar = document.getElementById("progressBar");
      if (progressBar) {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);
        progressBar.style.transform = `scaleX(${progress})`;
      }

      const sections = document.querySelectorAll("section[id]");
      let current = "hero";
      sections.forEach((s) => {
        const top = s.getBoundingClientRect().top;
        if (top < 300) current = s.getAttribute("id") || current;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="scroll-progress"
        id="progressBar"
        style={{ transform: "scaleX(0)" }}
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl"
      >
        <div
          className={cn(
            "rounded-2xl backdrop-blur-sm bg-[#0c1e3a]/60 border border-white/10 shadow-lg shadow-black/10",
            "transition-all duration-300",
          )}
        >
          <div className="mx-auto flex items-center justify-between px-5 py-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <Image
                src="/images/logo.png"
                alt={SITE_NAME}
                width={36}
                height={36}
              />
              <div>
                <span className="text-base font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
                  {SITE_NAME}
                </span>
                <span className="hidden sm:inline text-[10px] text-zinc-500 ml-2 tracking-wide">
                  Sales Omni System
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => {
                const sectionId = l.href.replace("#", "");
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary nav-link",
                      activeSection === sectionId
                        ? "text-white active"
                        : "text-zinc-400 hover:text-white hover:bg-white/10",
                    )}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="size-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="max-w-25 truncate">{user.name}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl py-2 shadow-xl border border-white/8">
                      <div className="px-4 py-2 border-b border-white/8">
                        <p className="text-xs text-zinc-400">Đã đăng nhập</p>
                        <p className="text-sm text-white truncate">
                          {user.email}
                        </p>
                      </div>
                      <a
                        href="/home/settings"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Settings size={14} />
                        Cài đặt tài khoản
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setUserOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <LogOut size={14} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <LogIn size={15} />
                    Đăng nhập
                  </a>
                  <a
                    href="/auth/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-all shadow-lg shadow-primary/25 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <UserPlus size={15} />
                    Đăng ký
                  </a>
                </>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="flex md:hidden flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Menu"
            >
              <span
                className={cn(
                  "block h-0.5 w-6 bg-white transition-all duration-200",
                  open && "rotate-45 translate-y-2",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-white transition-all duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-white transition-all duration-200",
                  open && "-rotate-45 -translate-y-2",
                )}
              />
            </button>
          </div>

          {open && (
            <nav className="flex flex-col gap-3 pb-5 px-5 border-t border-white/5 pt-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-zinc-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <LogOut size={15} /> Đăng xuất
                  </button>
                ) : (
                  <>
                    <a
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-zinc-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <LogIn size={15} /> Đăng nhập
                    </a>
                    <a
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <UserPlus size={15} /> Đăng ký
                    </a>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </motion.header>
    </>
  );
}
