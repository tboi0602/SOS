"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { adminService } from "@/service/admin.service";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Video,
  BookOpen,
  FileText,
  Edit3,
  Key,
  Menu,
  X,
  ClipboardList,
  Bell,
  GraduationCap,
  Camera,
} from "lucide-react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission: string | null;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      { href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard, permission: null },
    ],
  },
  {
    label: "Người dùng",
    items: [
      { href: "/admin/users", label: "Danh sách", icon: Users, permission: "manage_users" },
      { href: "/admin/permissions", label: "Phân quyền", icon: Key, permission: "manage_permissions" },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/admin/posts/manage", label: "Bài đăng", icon: Edit3, permission: null },
      { href: "/admin/posts", label: "Duyệt bài viết", icon: FileText, permission: "approve_posts" },
      { href: "/admin/submissions", label: "Duyệt tác phẩm", icon: Video, permission: "approve_submissions" },
      { href: "/admin/journals", label: "Duyệt nhật ký", icon: BookOpen, permission: "approve_journals" },
      { href: "/admin/customer-visits", label: "Gặp khách hàng", icon: Camera, permission: "manage_posts" },
      { href: "/admin/pending-members", label: "Chờ duyệt", icon: Users, permission: null },
      { href: "/admin/membership-flow", label: "Đăng ký thành viên", icon: GraduationCap, permission: null },
    ],
  },
  {
    label: "Truyền thông & Học tập",
    items: [
      { href: "/admin/notifications", label: "Thông báo", icon: Bell, permission: "manage_notifications" },
      { href: "/admin/elearning", label: "E-learning", icon: GraduationCap, permission: "manage_lessons" },
    ],
  },
  {
    label: "Giám sát",
    items: [
      { href: "/admin/activity-log", label: "Hoạt động", icon: ClipboardList, permission: null },
    ],
  },
];

function getNavGroups(role: string, permissions: string[]) {
  if (role === "admin") return NAV_GROUPS;
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.permission || permissions.includes(item.permission),
    ),
  })).filter((group) => group.items.length > 0);
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await adminService.getPendingMembers(1, 1);
      setPendingCount(res.total);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const perms: string[] = Array.isArray(user?.permissions)
    ? user.permissions!
    : [];

  const navGroups = useMemo(() => (user ? getNavGroups(user.role, perms) : []), [user, perms]);

  useEffect(() => {
    setExpandedGroups(new Set(navGroups.filter((g) => g.items.length >= 2).map((g) => g.label)));
  }, [collapsed, navGroups]);

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

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col h-full">
      <div
        className={`${isCollapsed ? "justify-center px-0" : "px-5"} pt-6 pb-4 flex items-center gap-2.5`}
      >
        <Image
          src="/images/logo.png"
          alt={SITE_NAME}
          width={150}
          height={150}
          unoptimized
        />
        {!isCollapsed && (
          <>
            <span className="sr-only">{SITE_NAME}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 transition-colors cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="border-t mx-4" style={{ borderColor: "var(--border-base)" }} />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasActiveChild = group.items.some((item) => pathname === item.href);
          const isSingle = group.items.length === 1;
          const Icon0 = group.items[0]?.icon;

          /* Single-item group → render directly, no toggle */
          if (isSingle) {
            const item = group.items[0];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] ${
                  active
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                <Icon0 size={18} className="shrink-0" />
                {!isCollapsed && item.label}
              </Link>
            );
          }

          /* Multi-item group → toggleable header + indented children */
          return (
            <div key={group.label}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  title={isCollapsed ? group.label : undefined}
                  className={`w-full flex items-center text-left gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer outline-none hover:bg-[var(--glass-hover)] ${
                    hasActiveChild ? "text-primary" : "text-[var(--text-dim)]"
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronRight
                    size={12}
                    className="ml-auto transition-transform duration-200"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                  />
                </button>
              )}
              {(isExpanded || isCollapsed) && (
                <div className={isCollapsed ? "" : "mt-0.5"}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-3 pl-9 pr-3.5 py-2"} rounded-xl text-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] ${
                          active
                            ? "bg-primary/20 text-primary font-semibold"
                            : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        <Icon size={16} className="shrink-0 opacity-70" />
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {item.href === "/admin/pending-members" && pendingCount > 0 && (
                          <span
                            className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold shrink-0 ${
                              isCollapsed ? "" : "ml-auto"
                            }`}
                            style={{ background: "var(--color-warning)", color: "#fff" }}
                          >
                            {pendingCount > 99 ? "99+" : pendingCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t mx-4" style={{ borderColor: "var(--border-base)" }} />

      <div className={`${isCollapsed ? "px-2" : "px-4"} py-4 space-y-2`}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer group"
          style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)", color: "var(--primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 15%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 4%, transparent)";
          }}
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
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-2 px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 6%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-tertiary)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ChevronLeft size={16} className="shrink-0" />
          {!isCollapsed && "Quay lại trang chính"}
        </Link>
        <button
          onClick={logout}
          title={isCollapsed ? "Đăng xuất" : undefined}
          aria-label="Đăng xuất"
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "gap-2 px-3.5 py-2.5"} rounded-xl text-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--danger) 10%, transparent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && "Đăng xuất"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-base)" }}>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-30 flex-col glass-ios border-r-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{ background: "var(--surface-strong)", borderColor: "var(--border-base)" }}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 backdrop-blur-xl border-b"
        style={{ background: "var(--surface-strong)", borderColor: "var(--border-base)" }}>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 transition-colors cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
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
          <span className="sr-only">{SITE_NAME}</span>
        </span>
        <ThemeToggleButton variant="header" />
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
        className={`lg:hidden fixed top-0 left-0 z-50 w-72 h-dvh max-h-dvh border-r shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--surface-strong)", borderColor: "var(--border-base)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {sidebarContent(false)}
      </div>

      <main
        className={`pt-14 lg:pt-0 min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}
      >
        {children}
      </main>

      <ThemeToggleButton />
    </div>
  );
}
