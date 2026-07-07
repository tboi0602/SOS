"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getNavGroups } from "@/components/admin/AdminNavConfig";
import { adminContentService } from "@/service/adminPost.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({ posts: 0, journals: 0, submissions: 0, customerVisits: 0, contactMessages: 0 });

  const fetchPendingCounts = useCallback(async () => {
    try {
      const res = await adminContentService.getPendingCounts();
      setPendingCounts(res);
    } catch {
      setPendingCounts({ posts: 0, journals: 0, submissions: 0, customerVisits: 0, contactMessages: 0 });
    }
  }, []);

  useEffect(() => {
    fetchPendingCounts();
    const interval = setInterval(fetchPendingCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingCounts]);

  const perms: string[] = Array.isArray(user?.permissions)
    ? user.permissions!
    : [];

  const navGroups = useMemo(
    () => (user ? getNavGroups(user.role, perms) : []),
    [user, perms],
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() =>
    new Set(navGroups.filter((g) => g.items.length >= 2).map((g) => g.label))
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (next) {
        setExpandedGroups(new Set());
      } else {
        setExpandedGroups(
          new Set(navGroups.filter((g) => g.items.length >= 2).map((g) => g.label)),
        );
      }
      return next;
    });
  };

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

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-base)" }}>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-30 flex-col glass-ios border-r-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{
          background: "var(--surface-strong)",
          borderColor: "var(--border-base)",
        }}
      >
        <AdminSidebar
          isCollapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onCloseMobile={() => setMobileOpen(false)}
          navGroups={navGroups}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          pendingCounts={pendingCounts}
        />
      </aside>

      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 backdrop-blur-xl border-b"
        style={{
          background: "var(--surface-strong)",
          borderColor: "var(--border-base)",
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 transition-colors cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-tertiary)";
          }}
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
        <ThemeToggleButton hideText />
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
        style={{
          background: "var(--surface-strong)",
          borderColor: "var(--border-base)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <AdminSidebar
          isCollapsed={false}
          onToggleCollapse={() => {}}
          onCloseMobile={() => setMobileOpen(false)}
          navGroups={navGroups}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          pendingCounts={pendingCounts}
        />
      </div>

      <main
        className={`pt-14 lg:pt-0 min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}
      >
        {children}
      </main>
    </div>
  );
}
