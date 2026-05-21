"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import {
  LayoutGrid,
  TrendingUp,
  Users,
  Plus,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Gift,
  BookOpen,
  Video,
  Settings,
  ChevronDown,
  Shield,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

const MEMBER_PATHS = ["/home/members", "/home/members/referred"];

const PERSONAL_PATHS = [
  "/home/profile",
  "/home/referral",
  "/home/journal",
  "/home/videos",
  "/home/settings",
  "/home/posts",
];

const NAV_ITEMS = [
  { href: "/home", label: "Bảng tin", icon: LayoutGrid },
  { href: "/home/top-sales", label: "Top doanh số", icon: TrendingUp },
];

const PERSONAL_SUB_ITEMS = [
  { href: "/home/profile", label: "Hồ sơ", icon: User },
  { href: "/home/referral", label: "Mã giới thiệu", icon: Gift },
  { href: "/home/journal", label: "Nhật ký", icon: BookOpen },
  { href: "/home/videos", label: "Tác phẩm", icon: Video },
  { href: "/home/posts", label: "Quản lý bài viết", icon: FileText },
  { href: "/home/settings", label: "Cài đặt", icon: Settings },
];

export default function FeedSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isMembersActive = MEMBER_PATHS.includes(pathname);
  const isPersonalActive = PERSONAL_PATHS.includes(pathname);
  const [membersOpen, setMembersOpen] = useState(isMembersActive);
  const [personalOpen, setPersonalOpen] = useState(isPersonalActive);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4">
        <span
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={32}
            height={32}
            unoptimized
          />
          <span className="text-sm font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
        </span>
      </div>

      <div className="border-t border-white/6 mx-4" />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                active
                  ? "text-white bg-primary/15 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        <div className="py-3">
          <button
            onClick={() => router.push("/home/create")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary hover:bg-primary-light text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Plus size={18} />
            Đăng bài
          </button>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <Shield size={18} />
            Quản trị
          </button>
        )}

        <div className="border-t border-white/6 pt-3">
          <button
            onClick={() => setMembersOpen(!membersOpen)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
              isMembersActive
                ? "text-white bg-primary/15 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/6"
            }`}
          >
            <Users size={18} />
            <span className="flex-1 text-left">Danh sách thành viên</span>
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${membersOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${membersOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <button
              onClick={() => router.push("/home/members")}
              className={`w-full flex items-center gap-3 pl-9 pr-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                pathname === "/home/members"
                  ? "text-primary font-medium"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Users size={15} />
              Tất cả thành viên
            </button>
            <button
              onClick={() => router.push("/home/members/referred")}
              className={`w-full flex items-center gap-3 pl-9 pr-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                pathname === "/home/members/referred"
                  ? "text-primary font-medium"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Gift size={15} />
              Đã giới thiệu
            </button>
          </div>
        </div>

        <div className="border-t border-white/6 pt-3">
          <button
            onClick={() => setPersonalOpen(!personalOpen)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
              isPersonalActive
                ? "text-white bg-primary/15 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/6"
            }`}
          >
            <User size={18} />
            <span className="flex-1 text-left">Cá nhân</span>
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${personalOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${
              personalOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            {PERSONAL_SUB_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 pl-9 pr-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    active
                      ? "text-primary font-medium"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/6 mx-4" />

      <div className="px-4 py-4">
        {user ? (
          <div className="flex items-center gap-3">
            {mounted && user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "User Avatar"}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="size-9 rounded-full bg-primary/25 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-zinc-500 hover:text-danger transition-colors cursor-pointer p-1"
              title="Đăng xuất"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm text-zinc-300 border border-white/10 hover:bg-white/6 transition-all cursor-pointer"
            >
              <LogIn size={15} /> Đăng nhập
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-light transition-all shadow-lg shadow-primary/25 cursor-pointer"
            >
              <UserPlus size={15} /> Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 z-30 flex-col bg-[#0c1e3a]/80 backdrop-blur-xl border-r border-white/6">
        {content}
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c1e3a]/95 backdrop-blur-xl border-t border-white/6 px-2 pb-2">
        <div className="flex items-center justify-around py-1.5">
          {NAV_ITEMS.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  active ? "text-primary" : "text-zinc-500"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => router.push("/home/create")}
            className="flex items-center justify-center size-11 rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer -mt-3"
          >
            <Plus size={22} />
          </button>

          <button
            onClick={() => router.push("/home/profile")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              isPersonalActive ? "text-primary" : "text-zinc-500"
            }`}
          >
            <User size={20} />
            <span className="text-[10px]">Cá nhân</span>
          </button>
        </div>
      </nav>
    </>
  );
}
