"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { SectionGlow } from "@/components/landing/Effects";
import TiltContainer from "@/components/ui/TiltContainer";

interface GalleryImage {
  id: string;
  label: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { id: "1", label: "Đội hình đồng diễn Saravan TVU" },
  { id: "2", label: "Đồng diễn múa Saravan" },
  { id: "3", label: "Đồng diễn múa Saravan" },
  { id: "4", label: "ĐẠI HỌC TRÀ VINH (TVU) ĐỀ CỬ VÀ XÁC LẬP TINH HOA VIỆT" },
  { id: "5", label: "Thẩm định LVT" },
  { id: "6", label: "Thẩm định LVT" },
];

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const ease = [0.16, 1, 0.3, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
};

function GalleryItem({ label, index }: { label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`${spans[index % spans.length]} relative rounded-2xl overflow-hidden group cursor-pointer`}
      style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <TiltContainer className="size-full" limit={6}>
        <Image
          src={`/images/gallery/gallery-${String(index + 1).padStart(2, "")}.png`}
          alt={label}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-all duration-500 group-hover:brightness-110"
          unoptimized
        />

        <div className="absolute inset-0 bg-linear-to-t from-[color-mix(in_srgb,var(--surface-elevated)_80%,transparent)] via-[color-mix(in_srgb,var(--surface-elevated)_10%,transparent)] to-transparent opacity-80 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 glass rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-bold text-accent tracking-wider">
            0{index + 1}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-[color-mix(in_srgb,var(--surface-elevated)_90%,transparent)] to-transparent">
          <p
            className="text-sm font-semibold drop-shadow-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </p>
        </div>
      </TiltContainer>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }}
      />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
    </motion.div>
  );
}

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <SectionGlow
        position="center"
        color="color-mix(in srgb, var(--color-primary) 8%, transparent)"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 30, filter: "blur(8px)" }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="gradient-line flex-1" />
            <span className="text-[11px] font-semibold text-primary tracking-[0.2em] uppercase">
              Thư viện
            </span>
            <div className="gradient-line flex-1" />
          </div>
          <h2
            className="heading-lg font-bold text-center mb-16"
            style={{ color: "var(--text-primary)" }}
          >
            Hình ảnh <span className="text-gradient">hoạt động</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {GALLERY_IMAGES.map((img, i) => (
            <GalleryItem key={img.id} label={img.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
