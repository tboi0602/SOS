"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCreatePost } from "@/hook/post";
import { ContentEditor } from "@/components/post/ContentEditor";
import { MediaUploader } from "@/components/post/MediaUploader";
import { ProductLinkInput } from "@/components/post/ProductLinkInput";
import { HashtagInput } from "@/components/post/HashtagInput";
import { SubmitBar } from "@/components/post/SubmitBar";
import { useEffect } from "react";

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

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/6 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-white">Đăng bài</h1>
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
  );
}
