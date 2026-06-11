"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useCreatePost } from "@/hook/post";
import { ContentEditor } from "@/components/post/ContentEditor";
import { MediaUploader } from "@/components/post/MediaUploader";
import { ProductLinkInput } from "@/components/post/ProductLinkInput";
import { HashtagInput } from "@/components/post/HashtagInput";
import { SubmitBar } from "@/components/post/SubmitBar";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";

export default function CreatePostPage() {
  const router = useRouter();
  const {
    user,
    content,
    setContent,
    mediaFiles,
    productLink,
    setProductLink,
    hashtagInput,
    setHashtagInput,
    hashtags,
    removeHashtag,
    submitting,
    dragActive,
    textareaRef,
    imageInputRef,
    videoInputRef,
    handleFiles,
    handleDrag,
    handleDrop,
    removeMedia,
    addHashtag,
    handleHashtagKey,
    handleSubmit,
  } = useCreatePost();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "var(--border-base)" }}>
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Đăng bài</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-base)", color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "color-mix(in srgb, var(--text-primary) 10%, transparent)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface-elevated)";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
          >
            Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ContentEditor
            value={content}
            onChange={setContent}
            textareaRef={textareaRef}
          />

          <MediaUploader
            mediaFiles={mediaFiles}
            dragActive={dragActive}
            imageInputRef={imageInputRef}
            videoInputRef={videoInputRef}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFiles={handleFiles}
            onRemoveMedia={removeMedia}
          />

          <ProductLinkInput value={productLink} onChange={setProductLink} />

          <HashtagInput
            inputValue={hashtagInput}
            onInputChange={setHashtagInput}
            onKeyDown={handleHashtagKey}
            onBlur={addHashtag}
            hashtags={hashtags}
            onRemoveTag={removeHashtag}
          />

          <SubmitBar
            contentLength={content.length}
            mediaCount={mediaFiles.length}
            submitting={submitting}
            disabled={!content.trim()}
            onSubmit={handleSubmit}
          />
        </form>
      </div>

      {!user && (
        <LoginRequiredModal
          open
          onClose={() => {}}
          message="Vui lòng đăng nhập để đăng bài viết."
        />
      )}


    </div>
  );
}
