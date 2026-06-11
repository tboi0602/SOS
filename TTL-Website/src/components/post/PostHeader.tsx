"use client";

import Image from "next/image";
import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Post } from "@/service/api";
import { getInitial } from "@/utils/cn";

interface PostHeaderProps {
  post: Post;
  isOwner: boolean;
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUserClick: () => void;
}

export default function PostHeader({
  post,
  isOwner,
  menuOpen,
  menuRef,
  onToggleMenu,
  onEdit,
  onDelete,
  onUserClick,
}: PostHeaderProps) {
  const getImageUrl = (url: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return url.startsWith("http") || url.startsWith("blob:")
      ? url
      : `${API_URL}${url}`;
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onUserClick}
      >
        {post.user.avatar ? (
          <Image
            src={getImageUrl(post.user.avatar)}
            alt={`${post.user.name}'s avatar`}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {getInitial(post.user.name)}
          </div>
        )}
        <div>
          <p className="text-[13px] font-semibold hover:text-accent transition-colors duration-150" >
            {post.user.name}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {new Date(post.createdAt).toLocaleDateString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {isOwner && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={onToggleMenu}
            className="p-1.5 rounded-lg transition-all cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
            aria-label="Tùy chọn bài viết"
            onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 min-w-36 rounded-xl py-1 z-40" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)" }}>
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-all cursor-pointer" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 5%, transparent)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <Pencil size={14} /> Sửa bài
              </button>
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-danger hover:bg-danger/10 transition-all cursor-pointer"
              >
                <Trash2 size={14} /> Xoá bài
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
