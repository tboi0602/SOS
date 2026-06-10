"use client";

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

  return (
    <div
      className={`mt-3 grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
    >
      {displayImages.map((url, i) => {
        const isLastDisplay = i === MAX_DISPLAY_IMAGES - 1;
        return (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl aspect-square max-h-75 cursor-pointer group" style={{ border: "1px solid var(--border-base)" }}
            onClick={() => onImageClick(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(url)}
              alt={`Post attachment ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            {isLastDisplay && hasMoreImages && (
              <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center font-bold text-xl select-none" style={{ background: "color-mix(in srgb, var(--text-primary) 60%, transparent)", color: "var(--text-primary)" }}>
                +{images.length - MAX_DISPLAY_IMAGES}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
