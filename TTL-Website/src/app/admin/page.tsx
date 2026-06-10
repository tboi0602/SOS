"use client";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle,
  FileText,
  BookOpen,
  Video,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";
import { SortHeader } from "@/components/admin/SortHeader";
import { useDashboard } from "@/hook/admin/useDashboard";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import SplitHeading from "@/components/ui/SplitHeading";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const PERMISSION_LABELS: Record<string, string> = {
  approve_posts: "Duyệt bài",
  approve_journals: "Duyệt nhật ký",
  approve_submissions: "Duyệt tác phẩm",
  manage_users: "Quản lý user",
  manage_permissions: "Phân quyền",
  manage_notifications: "Thông báo",
  manage_lessons: "Bài học",
  manage_posts: "Bài đăng",
};

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-base)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--text-primary)",
  },
  labelStyle: { color: "var(--text-primary)" },
};

export default function AdminDashboard() {
  const {
    loading,
    search,
    setSearch,
    sortKey,
    sortDir,
    page,
    setPage,
    handleSort,
    handleBlock,
    handleUnblock,
    stats,
    pointChartData,
    activityChartData,
    paged,
    totalPages,
    sortedLength,
  } = useDashboard();
  const dashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const statTl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
        });

        statTl.fromTo(q(".stat-card"),
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, force3D: true, stagger: gsap.utils.distribute({ base: 0.03, amount: 0.35, from: "start", ease: "power1.out" }), ease: "power3.out" }
        )
        .call(() => {
          q(".stat-value").forEach((el) => {
            const target = parseFloat(el.getAttribute("data-target") || "0");
            if (isNaN(target)) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 0.8, ease: "power2.out",
              onUpdate: () => { el.textContent = target % 1 === 0 ? String(Math.round(obj.val)) : obj.val.toFixed(1); },
            });
          });
        }, [], "-=0.1")
        .fromTo(q(".stat-icon"), { scale: 1 }, { scale: 1.15, duration: 0.15, ease: "power2.out", force3D: true, stagger: 0.08 }, "-=0.3")
        .to(q(".stat-icon"), { scale: 1, duration: 0.3, ease: "back.out(2)", force3D: true, stagger: 0.08 });

        gsap.fromTo(
          q(".chart-section"),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, force3D: true, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none none" } }
        );
        gsap.fromTo(
          q(".member-row"),
          { y: 20, opacity: 0, scale: 0.98 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.4, force3D: true,
            stagger: gsap.utils.distribute({ base: 0.01, amount: 0.25, from: "start", ease: "power1.inOut" }),
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
          }
        );

        q(".stat-card").forEach((card) => {
          gsap.to(card, {
            y: gsap.utils.mapRange(0, 1, -8, 8),
            ease: "none", force3D: true,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      });
    });

    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={dashRef} className="p-6 space-y-6 animate-fade-up">
      <div>
        <SplitHeading text="Bảng điều khiển" className="text-2xl font-bold" />
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Quản lý thành viên và giám sát hệ thống
        </p>
      </div>
      <Skeleton name="admin-dashboard" loading={loading}>
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Tổng thành viên",
                  value: stats.total,
                  rawValue: stats.total,
                  icon: Users,
                  color: "from-accent to-accent-dark",
                },
                {
                  label: "Đang hoạt động",
                  value: stats.active,
                  rawValue: stats.active,
                  icon: Award,
                  color: "from-emerald-400 to-emerald-600",
                },
                {
                  label: "Tổng điểm",
                  value: stats.totalScore.toLocaleString("vi-VN"),
                  rawValue: stats.totalScore,
                  icon: TrendingUp,
                  color: "from-amber-400 to-amber-600",
                },
                {
                  label: "Bài viết",
                  value: stats.totalPosts.toLocaleString("vi-VN"),
                  rawValue: stats.totalPosts,
                  icon: FileText,
                  color: "from-accent-light to-accent",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="stat-card relative overflow-hidden rounded-2xl p-5 card-hover"
                    style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-[0.06]`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{card.label}</p>
                        <p className="text-2xl font-bold mt-1 stat-value" data-target={String(card.rawValue)} style={{ color: "var(--text-primary)" }}>
                          {card.value}
                        </p>
                      </div>
                      <div
                        className={`stat-icon p-2.5 rounded-xl bg-linear-to-br ${card.color}`}
                      >
                      <Icon size={18} className="text-[var(--text-primary)]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-section rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Top 10 điểm số
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={pointChartData}
                  barCategoryGap="20%"
                  className="rounded-xl"
                  accessibilityLayer={false}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-base)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...chartTooltipStyle} cursor={false} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "var(--text-tertiary)" }}
                  />
                  <Bar
                    dataKey="Kỷ luật"
                    fill="var(--color-accent)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Đạo đức"
                    fill="var(--color-accent-light)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Cảm hứng"
                    fill="var(--color-accent-dark)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-section rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Top 10 hoạt động
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={activityChartData}
                  barCategoryGap="20%"
                  className="rounded-xl"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-base)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...chartTooltipStyle} cursor={false} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "var(--text-tertiary)" }}
                  />
                  <Bar
                    dataKey="Bài viết"
                    fill="var(--color-accent)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Tác phẩm"
                    fill="var(--color-accent-light)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Nhật ký"
                    fill="var(--color-accent-dark)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-colors"
                style={{ background: "var(--surface-elevated)", border: "0.5px solid var(--border-base)", color: "var(--text-primary)" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-base)"}
              />
            </div>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {sortedLength} thành viên
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl" style={{ border: "0.5px solid var(--border-base)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-strong)" }}>
                  <SortHeader
                    column="name"
                    label="Thành viên"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="role"
                    label="Vai trò"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="kyLuat"
                    label="Kỷ luật"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="daoDuc"
                    label="Đạo đức"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="truyenCamHung"
                    label="Cảm hứng"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="totalScore"
                    label="Tổng"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="postCount"
                    label="Bài viết"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="submissionCount"
                    label="Tác phẩm"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="journalCount"
                    label="Nhật ký"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    column="isActive"
                    label="Trạng thái"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Quyền
                  </th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: "var(--text-tertiary)" }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-base)]">
                {paged.map((m) => (
                  <tr
                    key={m.id}
                    className="member-row transition-colors group"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 3%, transparent)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="px-3 py-3 min-w-50">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden shrink-0">
                          {m.avatar ? (
                            <Image
                              src={m.avatar}
                              alt=""
                              width={36}
                              height={36}
                              className="size-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                              {m.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {m.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                       className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.role === "admin" ? "bg-accent/15 text-accent" : ""}`}
                       style={m.role !== "admin" ? { background: "var(--surface-elevated)", color: "var(--text-secondary)" } : {}}
                      >
                        {m.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.kyLuat}</td>
                    <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.daoDuc}</td>
                    <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>{m.truyenCamHung}</td>
                    <td className="px-3 py-3">
                      <span
                         className="font-semibold"
                         style={{ color: m.totalScore > 0 ? "var(--text-primary)" : "var(--text-tertiary)" }}
                      >
                        {m.totalScore}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} style={{ color: "var(--text-tertiary)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{m.postCount}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Video size={12} style={{ color: "var(--text-tertiary)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{m.submissionCount}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={12} style={{ color: "var(--text-tertiary)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{m.journalCount}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {m.isActive ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-xs text-danger bg-danger/10 px-2 py-0.5 rounded-full font-medium">
                          Chưa kích hoạt
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {m.permissions && m.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {m.permissions.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] px-1.5 py-0.5 rounded-full border"
                              style={{ background: "var(--surface-elevated)", borderColor: "var(--border-base)", color: "var(--text-secondary)" }}
                            >
                              {PERMISSION_LABELS[p] || p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {m.isActive ? (
                          <button
                            onClick={() => handleBlock(m.id, m.name)}
                            className="p-1.5 rounded-lg transition-all cursor-pointer"
                            style={{ color: "var(--text-dim)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-danger)"; e.currentTarget.style.background = "color-mix(in srgb, var(--color-danger) 10%, transparent)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
                            title="Chặn"
                          >
                            <Ban size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(m.id, m.name)}
                            className="p-1.5 rounded-lg transition-all cursor-pointer"
                            style={{ color: "var(--text-dim)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-success)"; e.currentTarget.style.background = "color-mix(in srgb, var(--color-success) 10%, transparent)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
                            title="Bỏ chặn"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 6%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 6%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      </Skeleton>
    </div>
  );
}
