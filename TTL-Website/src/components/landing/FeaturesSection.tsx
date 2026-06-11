"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { ShineCard, SectionGlow } from "@/components/landing/Effects";
import TiltContainer from "@/components/ui/TiltContainer";

interface FeatureItem {
  title: string;
  description: string;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    title: "Đề cử & Thẩm định Tinh hoa",
    description: "Quy trình đề cử khoa học, thẩm định khắt khe theo Hệ quy chiếu 5T — Thật, Minh, Chủ, Chuyên, Tôn — đảm bảo mọi giá trị được suy tôn đều hội tụ đầy đủ các tiêu chuẩn học thuật và đạo đức cao nhất.",
  },
  {
    title: "Bảo chứng & Vinh danh",
    description: "Chúng tôi bảo chứng tính xác thực của thành tựu, trao tặng chứng nhận Tinh Hoa Việt chính thống và tổ chức lễ vinh danh trang trọng, ghi nhận sự cống hiến của Quý vị trước cộng đồng.",
  },
  {
    title: "Lưu danh & Trao truyền",
    description: "Thành tựu được lưu danh vĩnh viễn trên Bản đồ Số Tinh Hoa Việt 3D — một di sản số bất tử, cho phép trao truyền tri thức và giá trị qua nhiều thế hệ, kết nối tinh hoa dân tộc với thế giới.",
  },
  {
    title: "Khai thác & Phát triển",
    description: "Sàn Tài sản Trí tuệ Tinh Hoa Việt là nơi Quý vị khai thác giá trị thương mại từ di sản đã được xác lập, kết nối đối tác, mở rộng cộng đồng và phát triển bền vững trong hệ sinh thái số.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent)_0%,transparent_60%)]" />
      <SectionGlow position="center" color="color-mix(in srgb, var(--color-accent) 6%, transparent)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-4"
        >
          <span className="text-[11px] font-semibold text-primary tracking-[0.2em] uppercase">
            Giải pháp
          </span>
          <h2 className="heading-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>
            Năng lực <span className="text-gradient">cốt lõi</span>
          </h2>
        </motion.div>

        <div className="mt-16 space-y-20">
          {FEATURES_DATA.map((f, i) => {
            const isReversed = i % 2 === 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                animate={
                  inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                }
                transition={{ duration: 0.6, ease, delay: i * 0.15 }}
                className={cn(
                  "grid items-center gap-8 lg:gap-16",
                  isReversed
                    ? "lg:grid-flow-dense lg:grid-cols-2"
                    : "lg:grid-cols-2",
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: i * 0.15 + 0.05 }}
                  className={cn(isReversed && "lg:col-start-2")}
                >
                  <span className="text-[11px] font-semibold text-accent tracking-[0.15em] uppercase mb-2 block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                  <div className="gradient-line my-5 max-w-xs" />
                  <p className="leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {f.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  animate={
                    inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}
                  }
                  transition={{ duration: 0.5, ease, delay: i * 0.15 + 0.1 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
                >
                  <ShineCard
                    lightColor="rgba(255,255,255,0.08)"
                    className="size-full"
                  >
                    <TiltContainer className="size-full" limit={6}>
                      <Image
                        src={`/images/features/features-${String(i + 1).padStart(2, "0")}.png`}
                        alt={f.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </TiltContainer>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 0.5px var(--glass-border)" }} />
                  </ShineCard>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
