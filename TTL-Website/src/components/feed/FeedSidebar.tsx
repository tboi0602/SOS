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
  Settings,
  ChevronDown,
  Shield,
  ShieldCheck,
  LayoutList,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";

const MEMBER_PATHS = ["/home/members", "/home/members/referred"];

const PERSONAL_PATHS = [
  "/home/profile",
  "/home/referral",
  "/home/content",
  "/home/settings",
];

const NAV_ITEMS = [
  { href: "/home", label: "Bảng tin", icon: LayoutGrid },
  { href: "/home/top-sales", label: "Top doanh số", icon: TrendingUp },
];

const PERSONAL_SUB_ITEMS = [
  { href: "/home/profile", label: "Hồ sơ", icon: User },
  { href: "/home/referral", label: "Mã giới thiệu", icon: Gift },
  { href: "/home/content", label: "Quản lý nội dung", icon: LayoutList },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const desktopW = collapsed ? "w-16" : "w-60";
  const mobileOpenRef = useRef(mobileOpen);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Sync sidebar width as CSS variable for layout
  useEffect(() => {
    const value = collapsed ? "4rem" : "15rem";
    document.documentElement.style.setProperty("--sidebar-width", value);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed]);

  // keep a ref in sync so the pathname-only effect can check current state
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  // Close mobile sidebar on route change (schedule to avoid sync setState in effect)
  useEffect(() => {
    if (!mobileOpenRef.current) return;
    const id = window.setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-5 pt-6 pb-4`}
      >
        <span
          className="flex items-center gap-2.5 group cursor-pointer min-w-0"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={isCollapsed ? 28 : 32}
            height={isCollapsed ? 28 : 32}
            unoptimized
            className="shrink-0"
          />
          {!isCollapsed && (
            <span className="text-sm font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent truncate">
              {SITE_NAME}
            </span>
          )}
        </span>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
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
              className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer ${
                active
                  ? "text-white bg-primary/15 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Đăng bài */}
        <div className={isCollapsed ? "flex justify-center py-2" : "py-3"}>
          <button
            onClick={() => user ? router.push("/home/create") : setShowLoginModal(true)}
            className={`flex items-center justify-center ${
              isCollapsed
                ? "size-9 rounded-xl bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25"
                : "w-full gap-2 px-4 py-3 rounded-2xl bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/25"
            } text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer`}
            title={isCollapsed ? "Đăng bài" : undefined}
          >
            <Plus size={isCollapsed ? 18 : 18} />
            {!isCollapsed && "Đăng bài"}
          </button>
        </div>

        {(user?.role === "admin" ||
          (Array.isArray(user?.permissions) &&
            user.permissions.length > 0)) && (
          <button
            onClick={() => router.push("/admin")}
            className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-white/6`}
            title={isCollapsed ? "Quản trị" : undefined}
          >
            <Shield size={18} className="shrink-0" />
            {!isCollapsed && <span>Quản trị</span>}
          </button>
        )}

        {/* Members section */}
        <div className="border-t border-white/6 pt-3">
          {isCollapsed ? (
            <button
              onClick={() => router.push("/home/members")}
              className={`w-full flex justify-center py-3 rounded-xl text-sm transition-all cursor-pointer ${
                isMembersActive
                  ? "text-white bg-primary/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
              title="Danh sách thành viên"
            >
              <Users size={18} />
            </button>
          ) : (
            <>
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
                  Mọi người
                </button>
                <button
                  onClick={() => user ? router.push("/home/members/referred") : setShowLoginModal(true)}
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
            </>
          )}
        </div>

        {/* Personal section */}
        <div className="border-t border-white/6 pt-3">
          {isCollapsed ? (
            <button
              onClick={() => user ? router.push("/home/profile") : setShowLoginModal(true)}
              className={`w-full flex justify-center py-3 rounded-xl text-sm transition-all cursor-pointer ${
                isPersonalActive
                  ? "text-white bg-primary/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
              title="Cá nhân"
            >
              <User size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => user ? setPersonalOpen(!personalOpen) : setShowLoginModal(true)}
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
                className={`overflow-hidden transition-all duration-200 ${personalOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
              >
                {PERSONAL_SUB_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => user ? router.push(item.href) : setShowLoginModal(true)}
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
            </>
          )}
        </div>
      </nav>

      <div className="border-t border-white/6 mx-4" />

      <div className="px-4 py-4 space-y-3">
        {/* Collapse toggle - prominent button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2.5 rounded-xl bg-white/4border border-white/8 text-primary hover:text-white hover:bg-primary/15 hover:border-primary/30 transition-all cursor-pointer group"
          title={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          {collapsed ? (
            <ChevronRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-[10px] font-semibold tracking-wider uppercase">
                Thu gọn
              </span>
            </div>
          )}
        </button>

        {user &&
          user.permissions &&
          user.permissions.length > 0 &&
          !isCollapsed && (
            <div className="px-3 py-2">
              <div className="flex flex-wrap gap-1">
                {user.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/8 px-1.5 py-0.5 rounded-full border border-primary/15"
                  >
                    <ShieldCheck size={10} />
                    {p === "approve_posts"
                      ? "Duyệt bài"
                      : p === "approve_journals"
                        ? "Duyệt nhật ký"
                        : p === "approve_submissions"
                          ? "Duyệt tác phẩm"
                          : p === "manage_users"
                            ? "Quản lý user"
                            : p === "manage_permissions"
                              ? "Phân quyền"
                              : p}
                  </span>
                ))}
              </div>
            </div>
          )}

        {user ? (
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
          >
            {mounted && user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "User Avatar"}
                width={isCollapsed ? 32 : 36}
                height={isCollapsed ? 32 : 36}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={`${isCollapsed ? "size-8" : "size-9"} rounded-full bg-primary/25 flex items-center justify-center text-sm font-bold text-primary shrink-0`}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-zinc-500 hover:text-danger transition-colors cursor-pointer p-1 shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
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
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 ${desktopW} z-30 flex-col bg-[#0c1e3a]/80 backdrop-blur-xl border-r border-white/6 transition-all duration-300`}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#0c1e3a]/95 backdrop-blur-xl border-b border-white/6">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={24}
            height={24}
            unoptimized
          />
          <span className="text-xs font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
        </span>
        <div className="size-8" />
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 w-72 h-dvh max-h-dvh bg-[#0c1e3a] border-r border-white/6 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {sidebarContent(false)}
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c1e3a]/95 backdrop-blur-xl border-t border-white/6 px-2 pb-2">
        <div className="flex items-center justify-around py-1.5">
          {NAV_ITEMS.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${active ? "text-primary" : "text-zinc-500"}`}
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
            onClick={() => router.push("/home/members")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isMembersActive ? "text-primary" : "text-zinc-500"}`}
          >
            <Users size={20} />
            <span className="text-[10px]">Thành viên</span>
          </button>

          <button
            onClick={() => user ? router.push("/home/profile") : setShowLoginModal(true)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isPersonalActive ? "text-primary" : "text-zinc-500"}`}
          >
            <User size={20} />
            <span className="text-[10px]">Cá nhân</span>
          </button>
        </div>
      </nav>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
