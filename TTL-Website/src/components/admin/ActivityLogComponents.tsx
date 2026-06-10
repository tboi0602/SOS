import {
  ClipboardList, Shield, ShieldOff, UserCog, Ban,
  CheckCircle, XCircle, BookOpen, Video, ExternalLink,
} from "lucide-react";
import type { ActivityLogEntry } from "@/types/admin";

const ACTION_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string; borderColor: string }> = {
  BLOCK_USER: {
    label: "Chặn người dùng",
    icon: <Ban size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  UNBLOCK_USER: {
    label: "Bỏ chặn người dùng",
    icon: <ShieldOff size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  UPDATE_PERMISSIONS: {
    label: "Cập nhật quyền",
    icon: <UserCog size={12} />,
    color: "text-amber-400 bg-amber-500/10",
    borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)",
  },
  UPDATE_ROLE: {
    label: "Cập nhật vai trò",
    icon: <Shield size={12} />,
    color: "text-purple-400 bg-purple-500/10",
    borderColor: "color-mix(in srgb, var(--color-accent) 20%, transparent)",
  },
  APPROVE_POST: {
    label: "Duyệt bài viết",
    icon: <CheckCircle size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_POST: {
    label: "Từ chối bài viết",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  APPROVE_JOURNAL: {
    label: "Duyệt nhật ký",
    icon: <BookOpen size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_JOURNAL: {
    label: "Từ chối nhật ký",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
  APPROVE_SUBMISSION: {
    label: "Duyệt tác phẩm",
    icon: <Video size={12} />,
    color: "text-green-400 bg-green-500/10",
    borderColor: "color-mix(in srgb, var(--color-success) 20%, transparent)",
  },
  REJECT_SUBMISSION: {
    label: "Từ chối tác phẩm",
    icon: <XCircle size={12} />,
    color: "text-red-400 bg-red-500/10",
    borderColor: "color-mix(in srgb, var(--color-danger) 20%, transparent)",
  },
};

function getActionDisplay(action: string) {
  return (
    ACTION_LABELS[action] ?? {
      label: action,
      icon: <ClipboardList size={12} />,
      color: "text-tertiary bg-white/5",
      borderColor: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
    }
  );
}

function LogDetail({ entry }: { entry: ActivityLogEntry }) {
  const m = entry.metadata as Record<string, unknown> | null;
  if (!m) return null;

  const targetName = String(m.targetName ?? "");
  const targetEmail = String(m.targetEmail ?? "");

  if (entry.action === "BLOCK_USER" || entry.action === "UNBLOCK_USER") {
    return (
          <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {targetName && <p>Người dùng: <span style={{ color: "var(--text-secondary)" }}>{targetName}</span></p>}
        {targetEmail && <p>Email: <span style={{ color: "var(--text-secondary)" }}>{targetEmail}</span></p>}
      </div>
    );
  }

  if (entry.action === "UPDATE_PERMISSIONS") {
    const perms = Array.isArray(m.permissions) ? (m.permissions as string[]) : [];
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {targetName && <p>Người dùng: <span style={{ color: "var(--text-secondary)" }}>{targetName}</span></p>}
        {targetEmail && <p>Email: <span style={{ color: "var(--text-secondary)" }}>{targetEmail}</span></p>}
        <p>
          Quyền mới:{" "}
          {perms.length > 0
            ? perms.map((p) => (
                <span key={p} className="inline-block px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] mr-1">
                  {p === "approve_posts" ? "Duyệt bài" : p === "approve_journals" ? "Duyệt nhật ký" : p === "approve_submissions" ? "Duyệt tác phẩm" : p === "manage_users" ? "Quản lý user" : p === "manage_permissions" ? "Phân quyền" : p === "manage_notifications" ? "Thông báo" : p === "manage_lessons" ? "Bài học" : p === "manage_posts" ? "Bài đăng" : p}
                </span>
              ))
            : <span className="italic" style={{ color: "var(--text-tertiary)" }}>Không có</span>}
        </p>
      </div>
    );
  }

  if (entry.action === "APPROVE_POST" || entry.action === "REJECT_POST") {
    const postContent = String(m.postContent ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {postContent && <p>Nội dung: <span style={{ color: "var(--text-secondary)" }}>"{postContent}"...</span></p>}
        <a
          href={`/home/posts/${entry.resourceId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem bài viết
        </a>
      </div>
    );
  }

  if (entry.action === "APPROVE_JOURNAL" || entry.action === "REJECT_JOURNAL") {
    const journalTitle = String(m.journalTitle ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {journalTitle && <p>Tiêu đề: <span style={{ color: "var(--text-secondary)" }}>"{journalTitle}"</span></p>}
        <a
          href={`/admin/journals`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem trong danh sách nhật ký
        </a>
      </div>
    );
  }

  if (entry.action === "APPROVE_SUBMISSION" || entry.action === "REJECT_SUBMISSION") {
    const submissionTitle = String(m.submissionTitle ?? "");
    return (
      <div className="text-xs space-y-1" style={{ color: "var(--text-tertiary)" }}>
        {submissionTitle && <p>Tiêu đề: <span style={{ color: "var(--text-secondary)" }}>"{submissionTitle}"</span></p>}
        <a
          href={`/admin/submissions`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light underline mt-1"
        >
          <ExternalLink size={10} /> Xem trong danh sách tác phẩm
        </a>
      </div>
    );
  }

  return null;
}

export { ACTION_LABELS, getActionDisplay, LogDetail };
