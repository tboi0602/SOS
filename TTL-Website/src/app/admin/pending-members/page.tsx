"use client"

import { useEffect, useRef, useState } from "react"
import {
  Users, FileText, BookOpen, Video, Camera,
  ChevronRight, Search, X, Clock, AlertCircle,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"
import { useAdminPendingMembers, useUserPendingItems } from "@/hook/admin/useAdminPendingMembers"
gsap.registerPlugin(ScrollTrigger)

const TYPE_ICONS: Record<string, { icon: typeof FileText; label: string }> = {
  post: { icon: FileText, label: "Bài viết" },
  journal: { icon: BookOpen, label: "Nhật ký" },
  submission: { icon: Video, label: "Tác phẩm" },
  "customer-visit": { icon: Camera, label: "Gặp khách hàng" },
}

export default function PendingMembersPage() {
  const { members, loading, total, page, setPage, totalPages } = useAdminPendingMembers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".member-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      )
    }
  }, [members])

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up">
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Users size={20} /> Thành viên chờ duyệt
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              {total} thành viên đang có bài chờ duyệt
            </p>
          </div>
        </div>

        <Skeleton name="admin-pending-members" loading={loading} rows={5}>
          {members.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium opacity-60">Không có thành viên nào đang chờ duyệt</p>
            </div>
          ) : (
            <>
              <div ref={listRef} className="grid gap-3">
                {members.map((member) => {
                  const isSelected = selectedUserId === member.id
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedUserId(isSelected ? null : member.id)}
                      className={`member-card w-full text-left rounded-2xl p-4 border card-hover transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer ${
                        isSelected ? "ring-2" : ""
                      }`}
                      style={{
                        background: isSelected
                          ? "color-mix(in srgb, var(--clr-primary) 10%, transparent)"
                          : "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                        borderColor: isSelected
                          ? "color-mix(in srgb, var(--clr-primary) 30%, transparent)"
                          : "var(--border-base)",
                        boxShadow: isSelected
                          ? "0 4px 24px color-mix(in srgb, var(--clr-primary) 15%, transparent)"
                          : "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate">{member.name}</span>
                            {member.memberId && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-tertiary)" }}>
                                {member.memberId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {member.pendingCounts.posts > 0 && (
                              <span className="badge-pending text-[10px]">
                                <FileText size={10} /> {member.pendingCounts.posts} bài viết
                              </span>
                            )}
                            {member.pendingCounts.journals > 0 && (
                              <span className="badge-pending text-[10px]">
                                <BookOpen size={10} /> {member.pendingCounts.journals} nhật ký
                              </span>
                            )}
                            {member.pendingCounts.submissions > 0 && (
                              <span className="badge-pending text-[10px]">
                                <Video size={10} /> {member.pendingCounts.submissions} tác phẩm
                              </span>
                            )}
                            {member.pendingCounts.customerVisits > 0 && (
                              <span className="badge-pending text-[10px]">
                                <Camera size={10} /> {member.pendingCounts.customerVisits} gặp KH
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-lg"
                            style={{ background: "color-mix(in srgb, var(--color-warning) 15%, transparent)", color: "var(--color-warning)" }}
                          >
                            {member.totalPending}
                          </span>
                          <ChevronRight
                            size={16}
                            className="transition-transform duration-200"
                            style={{ transform: isSelected ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-dim)" }}
                          />
                        </div>
                      </div>

                      {/* Expanded items panel */}
                      {isSelected && (
                        <MemberItemsPanel userId={member.id} memberName={member.name} />
                      )}
                    </button>
                  )
                })}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
            </>
          )}
        </Skeleton>
      </div>
    </div>
  )
}

function MemberItemsPanel({ userId, memberName }: { userId: string; memberName: string }) {
  const { items, loading, total, page, setPage, totalPages, filterType, setFilterType } = useUserPendingItems(userId)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemsRef.current) {
      gsap.fromTo(
        itemsRef.current.querySelectorAll(".pending-item"),
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" },
      )
    }
  }, [items])

  const FILTERS = [
    { value: undefined, label: "Tất cả" },
    { value: "post", label: "Bài viết" },
    { value: "journal", label: "Nhật ký" },
    { value: "submission", label: "Tác phẩm" },
    { value: "customer-visit", label: "Gặp KH" },
  ]

  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-base)" }}>
      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="text-[10px] font-medium uppercase tracking-wider shrink-0" style={{ color: "var(--text-dim)" }}>
          Bộ lọc:
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilterType(f.value)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              filterType === f.value
                ? "bg-primary/20 text-primary"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
            style={
              filterType === f.value
                ? {}
                : { background: "color-mix(in srgb, var(--text-primary) 4%, transparent)" }
            }
          >
            {f.label}
          </button>
        ))}
        <span className="text-[11px] ml-auto" style={{ color: "var(--text-tertiary)" }}>
          {total} mục
        </span>
      </div>

      <Skeleton name="admin-user-items" loading={loading} rows={3}>
        {items.length === 0 ? (
          <div className="text-center py-8 rounded-xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
            <Clock size={24} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs opacity-50">Không có mục nào chờ duyệt</p>
          </div>
        ) : (
          <>
            <div ref={itemsRef} className="space-y-2">
              {items.map((item) => {
                const typeInfo = TYPE_ICONS[item.itemType] || TYPE_ICONS.post
                const TypeIcon = typeInfo.icon
                return (
                  <div
                    key={`${item.itemType}-${item.id}`}
                    className="pending-item flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-[var(--glass-hover)]"
                    style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}
                  >
                    <div className="p-2 rounded-lg shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)" }}>
                      <TypeIcon size={14} style={{ color: "var(--clr-primary)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--text-primary) 8%, transparent)", color: "var(--text-tertiary)" }}>
                          {typeInfo.label}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="badge-pending text-[10px]">
                          <Clock size={9} /> Chờ duyệt
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-3">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
              </div>
            )}
          </>
        )}
      </Skeleton>
    </div>
  )
}
