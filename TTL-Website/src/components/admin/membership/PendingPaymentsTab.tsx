"use client"

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react"
import { CreditCard, CheckCircle2, X, Loader2 } from "lucide-react"
import gsap from "gsap"
import { adminService } from "@/service/admin.service"
import { Skeleton } from "@/components/ui/Skeleton"
import Pagination from "@/components/admin/Pagination"

export default function PendingPaymentsTab() {
  const [data, setData] = useState<{
    users: (import("@/service/membership.service").UserFlow & { user: { id: string; name: string; email: string } })[]
    total: number; page: number; totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await adminService.getPendingPayments(page); setData(d) }
    catch {} finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.querySelectorAll(".mf-item"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" })
    }
  }, [data])

  const handleVerify = async (userId: string) => {
    try { setActionLoading(userId); await adminService.verifyPayment(userId); fetchData() }
    catch {} finally { setActionLoading(null) }
  }
  const handleReject = async (userId: string) => {
    const note = prompt("Lý do từ chối:")
    if (!note) return
    try { setActionLoading(userId); await adminService.rejectPayment(userId, note); fetchData() }
    catch {} finally { setActionLoading(null) }
  }

  return (
    <Skeleton name="mf-pending-payments" loading={loading} rows={5}>
      {!data || data.users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl" style={{ background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}>
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium opacity-60">Không có thanh toán chờ xác minh</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-3">
            {data.users.map((entry) => (
              <div key={entry.user.id} className="mf-item rounded-2xl p-4 border card-hover transition-all" style={{
                background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                border: "0.5px solid var(--border-base)",
              }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "color-mix(in srgb, var(--clr-primary) 15%, transparent)", color: "var(--clr-primary)" }}>
                      {getInitial(entry.user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{entry.user.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{entry.user.email}</p>
                      {entry.paymentConfirmedAt && (
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-dim)" }}>
                          Xác nhận: {new Date(entry.paymentConfirmedAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)", color: "var(--color-success)" }}
                    >
                      {actionLoading === entry.user.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleReject(entry.user.id)}
                      disabled={actionLoading === entry.user.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)", color: "var(--danger)" }}
                    >
                      <X size={12} /> Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} variant="simple" />
        </>
      )}
    </Skeleton>
  )
}



