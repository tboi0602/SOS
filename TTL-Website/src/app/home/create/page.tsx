"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useCreatePost } from "@/hook/post";
import { ContentEditor } from "@/components/post/ContentEditor";
import { MediaUploader } from "@/components/post/MediaUploader";
import { ProductLinkInput } from "@/components/post/ProductLinkInput";
import { HashtagInput } from "@/components/post/HashtagInput";
import { SubmitBar } from "@/components/post/SubmitBar";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import { useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(true);
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
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 py-6 text-white">
      <div className="max-w-xl w-full space-y-5">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Đăng bài
              <Sparkles size={15} className="text-cyan" />
            </h1>
            <p className="text-[11px] text-zinc-500">
              Chia sẻ với cộng đồng SOS
            </p>
          </div>
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

      <LoginRequiredModal
        open={showLoginModal && !user}
        onClose={() => setShowLoginModal(false)}
        message="Vui lòng đăng nhập để đăng bài viết."
      />
    </div>
  );
}
