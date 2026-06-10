"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/utils/cn";
import { NAV_LINKS, SITE_NAME } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Settings,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { notificationService } from "@/service/notification.service";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const fetch = () =>
      notificationService
        .list(1, 1)
        .then((res) => setUnreadCount(res.unreadCount))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setProgress(
        Math.min(
          window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight),
          1,
        ),
      );
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

  const navLinkStyle = (sectionId: string) =>
    cn(
      "px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary",
      activeSection === sectionId ? "text-accent" : "hover:text-accent",
    );

  return (
    <>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl"
      >
        <div
          className="rounded-2xl backdrop-blur-sm border shadow-lg transition-all duration-300"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--surface-base) 75%, transparent)",
            borderColor: "var(--glass-border)",
            boxShadow: "0 1px 3px color-mix(in srgb, var(--clr-primary) 6%, transparent)",
          }}
        >
          <div className="mx-auto flex items-center justify-between px-5 py-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <Image
                src="/images/logo.png"
                alt={SITE_NAME}
                width={180}
                height={180}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <div
                className="flex items-center gap-1 mr-1 pr-2"
                style={{ borderRight: "1px solid var(--glass-border)" }}
              >
                {NAV_LINKS.map((l) => {
                  const sectionId = l.href.replace("#", "");
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      className={navLinkStyle(sectionId)}
                      style={{
                        color:
                          activeSection === sectionId
                            ? "var(--color-accent)"
                            : "var(--text-muted)",
                      }}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>
              <Link
                href="/home/members"
                className="px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                style={{ color: "var(--text-muted)" }}
              >
                Thành Viên
              </Link>
              <Link
                href="/home/elearning"
                className="px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                style={{ color: "var(--text-muted)" }}
              >
                Đăng Ký Thành Viên
              </Link>
              <Link
                href="/home/news"
                className="px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                style={{ color: "var(--text-muted)" }}
              >
                Tin tức
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-xl transition-all duration-300 cursor-pointer hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary"
                style={{ color: "var(--text-muted)" }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {user ? (
                <div className="relative flex items-center gap-1">
                  <Link
                    href="/home/notifications"
                    className="relative p-2 rounded-xl transition-all cursor-pointer hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 size-2 rounded-full bg-danger" />
                    )}
                  </Link>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <div className="size-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span
                      className="max-w-25 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.name}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl py-2 shadow-xl"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <div
                        className="px-4 py-2"
                        style={{
                          borderBottom: "1px solid var(--glass-border)",
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-dim)" }}
                        >
                          Đã đăng nhập
                        </p>
                        <p
                          className="text-sm truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/home/settings"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all cursor-pointer hover:opacity-70"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Settings size={14} /> Cài đặt tài khoản
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all cursor-pointer hover:opacity-70"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <LogOut size={14} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <LogIn size={15} /> Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-accent hover:bg-accent-dark transition-all shadow-lg shadow-accent/25 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <UserPlus size={15} /> Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="flex md:hidden flex-col gap-1.5 p-2 rounded-lg hover:opacity-70 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Menu"
            >
              <span
                className={`block h-0.5 w-6 transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`}
                style={{ backgroundColor: "var(--text-primary)" }}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-200 ${open ? "opacity-0" : ""}`}
                style={{ backgroundColor: "var(--text-primary)" }}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`}
                style={{ backgroundColor: "var(--text-primary)" }}
              />
            </button>
          </div>

          {open && (
            <nav
              className="flex flex-col gap-3 pb-5 px-5 pt-4"
              style={{ borderTop: "1px solid var(--glass-border)" }}
            >
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/home/members"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Thành Viên
              </Link>
              <Link
                href="/home/elearning"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Đăng Ký Thành Viên
              </Link>
              <Link
                href="/home/news"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Tin tức
              </Link>
              <div className="flex gap-3 pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                    style={{
                      color: "var(--text-muted)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <LogOut size={15} /> Đăng xuất
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary hover:opacity-70"
                      style={{
                        color: "var(--text-muted)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <LogIn size={15} /> Đăng nhập
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-accent hover:bg-accent-dark transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <UserPlus size={15} /> Đăng ký
                    </Link>
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
