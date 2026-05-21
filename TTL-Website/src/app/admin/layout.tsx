"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#071224] flex items-center justify-center">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071224]">
      <aside className="fixed left-0 top-0 bottom-0 w-64 z-30 flex flex-col bg-[#0c1e3a]/80 backdrop-blur-xl border-r border-white/6">
        <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={28}
            height={28}
            unoptimized
          />
          <span className="text-sm font-bold tracking-tight bg-linear-to-r from-white via-cyan to-primary bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        <div className="border-t border-white/6 mx-4" />

        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "text-white bg-primary/15 font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/6"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/6 mx-4" />

        <div className="px-4 py-4 space-y-2">
          <Link
            href="/home"
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/6 transition-all"
          >
            <ChevronLeft size={16} />
            Quay lại trang chính
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="pl-64 min-h-screen">{children}</main>
    </div>
  );
}
