"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import { NavGroup } from "./AdminNavConfig";
import {
  ChevronRight,
  ChevronLeft,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  navGroups,
  expandedGroups,
  onToggleGroup,
  pendingCount,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  navGroups: NavGroup[];
  expandedGroups: Set<string>;
  onToggleGroup: (label: string) => void;
  pendingCount: number;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
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
          onClick={onCloseMobile}
          className="lg:hidden p-1 transition-colors cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-tertiary)";
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="border-t mx-4"
        style={{ borderColor: "var(--border-base)" }}
      />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasActiveChild = group.items.some(
            (item) => pathname === item.href,
          );
          const isSingle = group.items.length === 1;
          const Icon0 = group.items[0]?.icon;

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

          return (
            <div key={group.label}>
              {!isCollapsed && (
                <button
                  onClick={() => onToggleGroup(group.label)}
                  title={isCollapsed ? group.label : undefined}
                  className={`w-full flex items-center text-left gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer outline-none hover:bg-[var(--glass-hover)] ${
                    hasActiveChild ? "text-primary" : "text-[var(--text-dim)]"
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronRight
                    size={12}
                    className="ml-auto transition-transform duration-200"
                    style={{
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
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
                        {item.href === "/admin/pending-members" &&
                          pendingCount > 0 && (
                            <span
                              className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold shrink-0 ${
                                isCollapsed ? "" : "ml-auto"
                              }`}
                              style={{
                                background: "var(--color-warning)",
                                color: "#fff",
                              }}
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

      <div
        className="border-t mx-4"
        style={{ borderColor: "var(--border-base)" }}
      />

      <div className={`${isCollapsed ? "px-2" : "px-4"} py-4 space-y-2`}>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer group"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 4%, transparent)",
            color: "var(--primary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background =
              "color-mix(in srgb, var(--primary) 15%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.background =
              "color-mix(in srgb, var(--text-primary) 4%, transparent)";
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
            e.currentTarget.style.background =
              "color-mix(in srgb, var(--text-primary) 6%, transparent)";
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
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--danger)";
            e.currentTarget.style.background =
              "color-mix(in srgb, var(--danger) 10%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-tertiary)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && "Đăng xuất"}
        </button>
      </div>
    </div>
  );
}
