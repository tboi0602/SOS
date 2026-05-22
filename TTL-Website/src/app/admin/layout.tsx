"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Video,
  BookOpen,
  FileText,
  Key,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const ALL_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    href: "/admin/users",
    label: "Quản lý người dùng",
    icon: Users,
    permission: "manage_users",
  },
  {
    href: "/admin/permissions",
    label: "Phân quyền",
    icon: Key,
    permission: "manage_permissions",
  },
  {
    href: "/admin/posts",
    label: "Duyệt bài viết",
    icon: FileText,
    permission: "approve_posts",
  },
  {
    href: "/admin/submissions",
    label: "Duyệt tác phẩm",
    icon: Video,
    permission: "approve_submissions",
  },
  {
    href: "/admin/journals",
    label: "Duyệt nhật ký",
    icon: BookOpen,
    permission: "approve_journals",
  },
];

function getNavItems(role: string, permissions: string[]) {
  if (role === "admin") return ALL_NAV_ITEMS;
  return ALL_NAV_ITEMS.filter(
    (item) => !item.permission || permissions.includes(item.permission),
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const perms: string[] = Array.isArray(user?.permissions)
    ? user.permissions!
    : [];

  useEffect(() => {
    const value = collapsed ? "4rem" : "16rem";
    document.documentElement.style.setProperty("--sidebar-width", value);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed]);

  const canAccess = user && (user.role === "admin" || perms.length > 0);

  useEffect(() => {
    if (!loading && !canAccess) {
      router.push("/auth/login");
    }
  }, [loading, canAccess, router]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void setMobileOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const navItems = user ? getNavItems(user.role, perms) : [];

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col h-full">
      <div
        className={`${isCollapsed ? "justify-center px-0" : "px-5"} pt-6 pb-4 flex items-center gap-2.5`}
      >
        <Image
          src="/images/logo.png"
          alt={SITE_NAME}
          width={28}
          height={28}
          unoptimized
        />
        {!isCollapsed && (
          <>
            <span className="text-sm font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
              {SITE_NAME}
            </span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="border-t border-white/6 mx-4" />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                active
                  ? "text-white bg-primary/15 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/6"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/6 mx-4" />

      <div className={`${isCollapsed ? "px-2" : "px-4"} py-4 space-y-2`}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2.5 rounded-xl bg-white/4 text-primary hover:text-white hover:bg-primary/15 transition-all cursor-pointer group"
          title={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          {isCollapsed ? (
            <ChevronRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          ) : (
            <span className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Thu gọn
            </span>
          )}
        </button>
        <Link
          href="/home"
          title={isCollapsed ? "Quay lại trang chính" : undefined}
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-2 px-3.5 py-2.5"} rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/6 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
        >
          <ChevronLeft size={16} className="shrink-0" />
          {!isCollapsed && "Quay lại trang chính"}
        </Link>
        <button
          onClick={logout}
          title={isCollapsed ? "Đăng xuất" : undefined}
          aria-label="Đăng xuất"
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-2 px-3.5 py-2.5"} rounded-xl text-sm text-zinc-400 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && "Đăng xuất"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071224]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-30 flex-col bg-[#0c1e3a]/80 backdrop-blur-xl border-r border-white/6 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
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

      <main
        className={`pt-14 lg:pt-0 min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}
      >
        {children}
      </main>
    </div>
  );
}
