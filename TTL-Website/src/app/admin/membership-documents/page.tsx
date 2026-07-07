"use client";

import { getInitial } from "@/utils/cn";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  FileText,
  Search,
  X,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
} from "lucide-react";
import gsap from "gsap";
import { adminService } from "@/service/admin.service";
import { adminMembershipService } from "@/service/adminMembership.service";
import { Skeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { UserFlow } from "@/service/membership.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function fileUrl(url: string) {
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function splitUrls(val: string | null | undefined): string[] {
  return val ? val.split(",").filter(Boolean) : [];
}

const STATUS_LABELS: Record<string, string> = {
  pending_docs: "Chờ nộp hồ sơ",
  docs_submitted: "Đã nộp hồ sơ",
  pending_payment: "Chờ thanh toán",
  payment_pending_verification: "Chờ xác nhận TT",
  in_lessons: "Đang học",
  pending_quiz: "Chờ kiểm tra",
  pending_situations: "Chờ nộp tình huống",
  pending_review: "Đang chấm",
  completed: "Hoàn thành",
};

function FileRow({ url, label }: { url: string; label: string }) {
  const fileName = url.split("/").pop() || "file";
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url);
  if (isImage) {
    return (
      <a
        href={fileUrl(url)}
        target="_blank"
        className="block rounded-lg overflow-hidden border shrink-0"
        style={{
          borderColor:
            "color-mix(in srgb, var(--text-primary) 8%, transparent)",
          width: 180,
        }}
      >
        <img
          src={fileUrl(url)}
          alt={fileName}
          className="w-full h-32 object-cover"
        />
        {label && (
          <p
            className="text-[10px] px-2 py-1 text-center font-medium"
            style={{
              color: "var(--text-tertiary)",
              background:
                "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            }}
          >
            {label}
          </p>
        )}
      </a>
    );
  }
  return (
    <a
      href={fileUrl(url)}
      target="_blank"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:opacity-80 shrink-0"
      style={{
        background: "color-mix(in srgb, var(--clr-primary) 6%, transparent)",
        color: "var(--clr-primary)",
      }}
    >
      {isImage ? <ImageIcon size={14} /> : <FileText size={14} />}
      {label && (
        <span className="text-[10px] opacity-60 shrink-0">{label}</span>
      )}
      <span className="flex-1 truncate">{fileName}</span>
      <ExternalLink size={12} className="shrink-0" />
    </a>
  );
}

function FileSection({
  title,
  files,
  labels,
  direction = "vertical",
}: {
  title: string;
  files: string[];
  labels?: string[];
  direction?: "vertical" | "horizontal";
}) {
  if (!files.length) return null;
  return (
    <div className="space-y-1.5">
      {title && (
        <p
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "var(--text-dim)" }}
        >
          {title}
        </p>
      )}
      <div
        className={
          direction === "horizontal" ? "flex flex-wrap gap-2" : "space-y-1.5"
        }
      >
        {files.map((url, i) => (
          <FileRow key={i} url={url} label={labels?.[i] ?? ""} />
        ))}
      </div>
    </div>
  );
}

export default function MembershipDocumentsPage() {
  const [data, setData] = useState<{
    users: (UserFlow & {
      user: { id: string; name: string; email: string; avatar: string | null };
      membershipFlow: { name: string; price: number };
    })[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const d = await adminService.getAllFlows(page, 20, search || undefined);
      setData(d as typeof data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (userId: string) => {
    setDeleting(userId);
    try {
      await adminMembershipService.deleteMemberProfile(userId);
      toast("Đã xoá hồ sơ thành viên", "success");
      fetchData();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá hồ sơ", "error");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".mf-item"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
      );
    }
  }, [data]);

  return (
    <div className="p-6 space-y-6 animate-fade-up max-w-7xl mx-auto">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Hồ sơ thành viên
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Tất cả hồ sơ và tài liệu thành viên đã nộp
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
          placeholder="Tìm kiếm thành viên..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
          style={{
            background: "var(--surface-elevated)",
            border: "0.5px solid var(--border-base)",
            color: "var(--text-primary)",
          }}
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <Skeleton name="mf-documents" loading={loading} rows={5}>
        {!data || data.users.length === 0 ? (
          <div
            className="text-center py-16 rounded-3xl"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            }}
          >
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium opacity-60">
              {search ? "Không tìm thấy kết quả" : "Chưa có hồ sơ nào"}
            </p>
          </div>
        ) : (
          <>
            <div ref={listRef} className="grid gap-3">
              {data.users.map((entry) => {
                const documents = splitUrls(entry.documentsUrl);
                const achievements = splitUrls(entry.achievementImages);

                return (
                  <div
                    key={entry.user.id}
                    className="mf-item rounded-2xl p-4 border card-hover transition-all"
                    style={{
                      background:
                        "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
                      boxShadow:
                        "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
                      border: "0.5px solid var(--border-base)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="size-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            background:
                              "color-mix(in srgb, var(--clr-primary) 15%, transparent)",
                            color: "var(--clr-primary)",
                          }}
                        >
                          {getInitial(entry.user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {entry.user.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {entry.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background:
                              "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
                            color: "var(--clr-primary)",
                          }}
                        >
                          {STATUS_LABELS[entry.status] || entry.status}
                        </span>
                        <button
                          onClick={() => setConfirmDelete(entry.user.id)}
                          disabled={deleting === entry.user.id}
                          className="size-8 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-danger/10"
                          style={{ color: "var(--danger, #ef4444)" }}
                          title="Xoá hồ sơ"
                        >
                          {deleting === entry.user.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {(documents.length > 0 ||
                      entry.idCardFront ||
                      entry.idCardBack ||
                      achievements.length > 0) && (
                      <div
                        className="mt-3 pt-3 border-t space-y-3"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--text-primary) 8%, transparent)",
                        }}
                      >
                        <FileSection
                          title="Hồ sơ"
                          files={documents}
                          direction="vertical"
                        />
                        <FileSection
                          title="Căn cước"
                          files={
                            [entry.idCardFront, entry.idCardBack].filter(
                              Boolean,
                            ) as string[]
                          }
                          direction="horizontal"
                          labels={["Mặt trước", "Mặt sau"]}
                        />
                        <FileSection
                          title="Ảnh thành tích"
                          files={achievements}
                          direction="horizontal"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              variant="simple"
            />
          </>
        )}
      </Skeleton>

      <ConfirmDialog
        open={!!confirmDelete}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        title="Xoá hồ sơ thành viên"
        message="Bạn có chắc chắn muốn xoá hồ sơ này? Toàn bộ dữ liệu thành viên và file đã upload sẽ bị xoá vĩnh viễn."
        confirmLabel="Xoá"
        variant="danger"
      />
    </div>
  );
}
