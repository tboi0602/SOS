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

const PERMISSION_LABELS: Record<string, string> = {
  approve_posts: "Duyệt bài",
  approve_journals: "Duyệt nhật ký",
  approve_submissions: "Duyệt tác phẩm",
  manage_users: "Quản lý user",
  manage_permissions: "Phân quyền",
};

const chartTooltipStyle = {
  contentStyle: {
    background: "#0c1e3a",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    fontSize: "12px",
  },
  labelStyle: { color: "#fff" },
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bảng điều khiển</h1>
        <p className="text-zinc-400 text-sm mt-1">
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
                icon: Users,
                color: "from-blue-400 to-blue-600",
              },
              {
                label: "Đang hoạt động",
                value: stats.active,
                icon: Award,
                color: "from-blue-400 to-blue-600",
              },
              {
                label: "Tổng điểm",
                value: stats.totalScore.toLocaleString("vi-VN"),
                icon: TrendingUp,
                color: "from-blue-400 to-blue-600",
              },
              {
                label: "Bài viết",
                value: stats.totalPosts.toLocaleString("vi-VN"),
                icon: FileText,
                color: "from-blue-400 to-blue-600",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="relative overflow-hidden rounded-2xl bg-[#0c1e3a]/60 border border-white/6 p-5 hover:border-white/20 transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-[0.06]`}
                  />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-zinc-400 text-xs">{card.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {card.value}
                      </p>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl bg-linear-to-br ${card.color}`}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#0c1e3a]/60 border border-white/6 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">
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
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...chartTooltipStyle} cursor={false} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
                  />
                  <Bar
                    dataKey="Kỷ luật"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Đạo đức"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Cảm hứng"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl bg-[#0c1e3a]/60 border border-white/6 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">
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
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...chartTooltipStyle} cursor={false} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
                  />
                  <Bar
                    dataKey="Bài viết"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Tác phẩm"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="Nhật ký"
                    fill="#06b6d4"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-[#0c1e3a]/60 border border-white/6 rounded-xl text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <span className="text-xs text-zinc-500">
              {sortedLength} thành viên
            </span>
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-2xl border border-white/6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0c1e3a]/80">
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
                  <th className="px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Quyền
                  </th>
                  <th className="px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {paged.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-white/3 transition-colors group"
                  >
                    <td className="px-3 py-3 min-w-50">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-linear-to-br from-primary/30 to-purple-500/30 flex items-center justify-center overflow-hidden shrink-0">
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
                            <span className="text-xs font-bold text-white/80">
                              {m.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">
                            {m.name}
                          </p>
                          <p className="text-zinc-500 text-xs truncate">
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.role === "admin" ? "bg-amber-500/15 text-amber-400" : "bg-zinc-500/15 text-zinc-400"}`}
                      >
                        {m.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-white">{m.kyLuat}</td>
                    <td className="px-3 py-3 text-white">{m.daoDuc}</td>
                    <td className="px-3 py-3 text-white">{m.truyenCamHung}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`font-semibold ${m.totalScore > 0 ? "text-primary" : "text-zinc-500"}`}
                      >
                        {m.totalScore}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-zinc-500" />
                        <span className="text-white">{m.postCount}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Video size={12} className="text-zinc-500" />
                        <span className="text-white">{m.submissionCount}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={12} className="text-zinc-500" />
                        <span className="text-white">{m.journalCount}</span>
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
                              className="text-[10px] bg-primary/8 text-primary px-1.5 py-0.5 rounded-full border border-primary/15"
                            >
                              {PERMISSION_LABELS[p] || p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {m.isActive ? (
                          <button
                            onClick={() => handleBlock(m.id, m.name)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                            title="Chặn"
                          >
                            <Ban size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(m.id, m.name)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
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
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-zinc-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
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
