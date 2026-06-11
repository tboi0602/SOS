"use client";

import { useState, type ImgHTMLAttributes } from "react";

function SmartImage({
  src,
  alt,
  onLoad,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [ratio, setRatio] = useState<number | null>(null);

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        aspectRatio: ratio ? `${ratio}` : undefined,
        border: "0.5px solid var(--border-base)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        onLoad={(e) => {
          const img = e.currentTarget;
          const r = img.naturalWidth / img.naturalHeight;
          setRatio(r);
          onLoad?.(e);
        }}
        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        {...rest}
      />
    </div>
  );
}

interface PostImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
  getImageUrl: (url: string) => string;
}

export default function PostImageGallery({
  images,
  onImageClick,
  getImageUrl,
}: PostImageGalleryProps) {
  const MAX_DISPLAY_IMAGES = 2;
  const hasMoreImages = images.length > MAX_DISPLAY_IMAGES;
  const displayImages = images.slice(0, MAX_DISPLAY_IMAGES);
  const single = images.length === 1;

  return (
    <div
      className={`mt-2 grid  gap-1.5 ${single ? "grid-cols-1" : "grid-cols-2"}`}
    >
      {displayImages.map((url, i) => {
        const isLastDisplay = i === MAX_DISPLAY_IMAGES - 1;
        return (
          <div
            key={i}
            className={`relative overflow-hidden max-h-200 rounded-xl cursor-pointer  group ${single ? "" : " max-h-75"}`}
            style={{ border: single ? "none" : "1px solid var(--border-base)" }}
            onClick={() => onImageClick(i)}
          >
            {single ? (
              <SmartImage
                src={getImageUrl(url)}
                alt={`Post attachment ${i + 1}`}
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(url)}
                  alt={`Post attachment ${i + 1}`}
                  className="w-full h-full   object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </>
            )}
            {isLastDisplay && hasMoreImages && (
              <div
                className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center font-bold text-xl select-none"
                style={{
                  background:
                    "color-mix(in srgb, var(--text-primary) 60%, transparent)",
                  color: "var(--text-primary)",
                }}
              >
                +{images.length - MAX_DISPLAY_IMAGES}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
