"use client";
import { getInitial } from "@/utils/cn";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import { notificationService } from "@/service/notification.service";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  Plus,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Shield,
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  LayoutGrid,
  Newspaper,
  Users,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import {
  NAV_ITEMS,
  BOTTOM_NAV_ITEMS,
  PERSONAL_PATHS,
  PERSONAL_SUB_ITEMS,
} from "./sidebarConfig";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function FeedSidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const avatarSrc = user?.avatar
    ? user?.avatar.startsWith("http")
      ? user?.avatar
      : `${API_URL}${user?.avatar}`
    : null;
  const pathname = usePathname();
  const router = useRouter();
  const isPersonalActive = PERSONAL_PATHS.includes(pathname);
  const [personalOpen, setPersonalOpen] = useState(isPersonalActive);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const desktopW = collapsed ? "w-16" : "w-60";
  const mobileOpenRef = useRef(mobileOpen);

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
    const handler = () => fetch();
    window.addEventListener("notifications-read", handler);
    const id = setInterval(fetch, 30000);
    return () => {
      clearInterval(id);
      window.removeEventListener("notifications-read", handler);
    };
  }, [user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const value = collapsed ? "4rem" : "15rem";
    document.documentElement.style.setProperty("--sidebar-width", value);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed]);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

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
      <div
        className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-5 pt-6 pb-4`}
      >
        <span
          className="flex items-center gap-2.5 group cursor-pointer min-w-0"
          onClick={() => router.push("/")}
        >
          {!isCollapsed ? (
            <Image
              src="/images/logo.png"
              alt={SITE_NAME}
              width={150}
              height={150}
              unoptimized
              className="shrink-0"
            />
          ) : (
            <Image
              src="/images/tbv-logo.png"
              alt={SITE_NAME}
              width={50}
              height={50}
              unoptimized
              className="shrink-0"
            />
          )}
        </span>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="border-t border-[var(--border-base)] mx-4" />

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
                  ? "text-primary bg-primary/20 font-semibold"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer ${
                active
                  ? "text-primary bg-primary/20 font-semibold"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]"
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
            onClick={() =>
              user ? router.push("/home/create") : setShowLoginModal(true)
            }
            className={`flex items-center justify-center ${
              isCollapsed
                ? "size-9 rounded-xl bg-primary text-[var(--text-primary)] hover:bg-primary-light shadow-lg shadow-primary/25"
                : "w-full gap-2 px-4 py-3 rounded-2xl bg-primary hover:bg-primary-light text-[var(--text-primary)] shadow-lg shadow-primary/25"
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
            className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]`}
            title={isCollapsed ? "Quản trị" : undefined}
          >
            <Shield size={18} className="shrink-0" />
            {!isCollapsed && <span>Quản trị</span>}
          </button>
        )}

        {/* Personal section */}
        <div className="border-t border-[var(--border-base)] pt-3">
          {isCollapsed ? (
            <button
              onClick={() =>
                user ? router.push("/home/profile") : setShowLoginModal(true)
              }
              className={`w-full flex justify-center py-3 rounded-xl text-sm transition-all cursor-pointer ${
                isPersonalActive
                  ? "text-primary bg-primary/20 font-semibold"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]"
              }`}
              title="Cá nhân"
            >
              <User size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  user
                    ? setPersonalOpen(!personalOpen)
                    : setShowLoginModal(true)
                }
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  isPersonalActive
                    ? "text-primary bg-primary/20 font-semibold"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]"
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
                      onClick={() =>
                        user ? router.push(item.href) : setShowLoginModal(true)
                      }
                      className={`w-full flex items-center gap-3 pl-9 pr-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        active
                          ? "text-primary font-medium"
                          : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]"
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

      <div className="border-t border-[var(--border-base)] mx-4" />

      <div className="px-4 py-4 space-y-3">
        {/* Notification bell */}
        {user && (
          <button
            onClick={() => router.push("/home/notifications")}
            className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] relative`}
            title={isCollapsed ? "Thông báo" : undefined}
          >
            <Bell size={18} className="shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 text-left">Thông báo</span>
            )}
            {unreadCount > 0 && (
              <span
                className={`${isCollapsed ? "absolute -top-0.5 -right-0.5" : ""} flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[9px] font-bold`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 ${isCollapsed ? "justify-center px-0 py-3" : "px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)]`}
          title={
            isCollapsed
              ? theme === "dark"
                ? "Chế độ sáng"
                : "Chế độ tối"
              : undefined
          }
        >
          {theme === "dark" ? (
            <Sun size={18} className="shrink-0" />
          ) : (
            <Moon size={18} className="shrink-0" />
          )}
          {!isCollapsed && (
            <span>{theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}</span>
          )}
        </button>

        {/* Collapse toggle - prominent button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2.5 rounded-xl bg-[color-mix(in_srgb,_var(--text-primary)_4%,_transparent)] border-[var(--border-base)] text-primary hover:text-[var(--text-primary)] hover:bg-primary/15 hover:border-primary/30 transition-all cursor-pointer group"
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
                    {p === "manage_content"
                      ? "Quản lý nội dung"
                      : p === "manage_users"
                        ? "Quản lý người dùng"
                        : p === "manage_notifications"
                          ? "Thông báo"
                          : p === "manage_lessons"
                            ? "Bài học"
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
              <img
                src={avatarSrc as string}
                alt={user.name || "User Avatar"}
                width={isCollapsed ? 32 : 38}
                height={isCollapsed ? 32 : 38}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={`${isCollapsed ? "size-8" : "size-9"} rounded-full bg-primary/25 flex items-center justify-center text-sm font-bold text-primary shrink-0`}
              >
                {getInitial(user.name)}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-[var(--text-tertiary)] hover:text-danger transition-colors cursor-pointer p-1 shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div
            className={
              isCollapsed ? "flex flex-col items-center gap-3" : "space-y-2"
            }
          >
            {isCollapsed ? (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="size-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] border border-[var(--border-base)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer"
                  title="Đăng nhập"
                >
                  <LogIn size={18} />
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="size-10 flex items-center justify-center rounded-xl bg-primary text-[var(--text-primary)] hover:bg-primary-light transition-all shadow-lg shadow-primary/25 cursor-pointer"
                  title="Đăng ký"
                >
                  <UserPlus size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)] border border-[var(--border-base)] hover:bg-[var(--glass-hover)] transition-all cursor-pointer"
                >
                  <LogIn size={15} /> Đăng nhập
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-primary hover:bg-primary-light transition-all shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <UserPlus size={15} /> Đăng ký
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 ${desktopW} z-30 flex-col glass-ios border-r-0 transition-all duration-300`}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[var(--surface-elevated)]/95 backdrop-blur-xl border-b border-[var(--border-base)]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <span
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={36}
            height={36}
            unoptimized
          />
        </span>
        <button
          onClick={() => router.push("/home/notifications")}
          className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-danger text-white text-[8px] font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
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
        className={`lg:hidden fixed top-0 left-0 z-50 w-72 h-dvh max-h-dvh glass-ios-thick border-r-0 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {sidebarContent(false)}
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-ios-thick border-t-0 px-2 pb-2 rounded-t-2xl">
        <div className="flex items-center justify-around py-1.5">
          <button
            onClick={() => router.push("/home")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isActive("/home") ? "text-primary bg-primary/15" : "text-[var(--text-tertiary)] hover:bg-[var(--glass-hover)]"}`}
          >
            <LayoutGrid size={20} />
            <span className="text-[10px]">Bảng tin</span>
          </button>

          <button
            onClick={() => router.push("/home/news")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isActive("/home/news") ? "text-primary bg-primary/15" : "text-[var(--text-tertiary)] hover:bg-[var(--glass-hover)]"}`}
          >
            <Newspaper size={20} />
            <span className="text-[10px]">BQT</span>
          </button>

          <button
            onClick={() => router.push("/home/create")}
            className="flex items-center justify-center size-11 rounded-full bg-primary text-[var(--text-primary)] shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer -mt-3"
          >
            <Plus size={22} />
          </button>

          <button
            onClick={() => router.push("/home/members")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isActive("/home/members") ? "text-primary bg-primary/15" : "text-[var(--text-tertiary)] hover:bg-[var(--glass-hover)]"}`}
          >
            <Users size={20} />
            <span className="text-[10px]">Thành viên</span>
          </button>

          <button
            onClick={() =>
              user ? router.push("/home/profile") : setShowLoginModal(true)
            }
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isPersonalActive ? "text-primary bg-primary/15" : "text-[var(--text-tertiary)] hover:bg-[var(--glass-hover)]"}`}
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
