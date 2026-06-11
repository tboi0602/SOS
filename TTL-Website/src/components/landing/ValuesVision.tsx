"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { ShineCard, SectionGlow } from "@/components/landing/Effects";

interface ValueItem {
  number: string;
  quote: string;
  text: string;
}

interface VisionData {
  badge: string;
  quote: string;
  text: string;
}

const VALUES_DATA: ValueItem[] = [
  {
    number: "01",
    quote:
      "Trí tuệ là di sản bất tử — mỗi thành tựu hôm nay là nền móng cho thế hệ mai sau.",
    text: "Tinh Hoa Việt tôn vinh trí tuệ như giá trị cốt lõi và di sản trường tồn. Chúng tôi tin rằng mỗi cá nhân đều mang trong mình một tinh hoa riêng, xứng đáng được khai phá, vinh danh và lưu truyền.",
  },
  {
    number: "02",
    quote:
      "Tính xác thực là nền tảng của mọi giá trị — chỉ sự thật mới đáng được trân quý.",
    text: "Với Hệ quy chiếu 5T khắt khe, chúng tôi đảm bảo mọi thành tựu được xác lập đều đáp ứng tiêu chuẩn học thuật và đạo đức cao nhất, mang lại sự tin cậy tuyệt đối cho cộng đồng và xã hội.",
  },
  {
    number: "03",
    quote: "Kết nối tinh hoa — Trao truyền giá trị — Kiến tạo tương lai.",
    text: "Bản đồ Số Tinh Hoa Việt 3D và Sàn Tài sản Trí tuệ là cầu nối giữa quá khứ, hiện tại và tương lai, nơi di sản trí tuệ được bảo tồn, khai thác và trao truyền qua nhiều thế hệ.",
  },
];

const VISION: VisionData = {
  badge: "Tầm nhìn",
  quote: "Suy tôn Trí tuệ — Lưu truyền Di sản — Vì một Việt Nam hùng cường.",
  text: "Trở thành tổ chức hàng đầu Việt Nam trong việc phát hiện, bảo chứng và vinh danh giá trị tinh hoa, kiến tạo một hệ sinh thái số bền vững — nơi trí tuệ được tôn vinh, di sản được bảo hộ và thành tựu của người Việt sống mãi với thời gian.",
};

const ease = [0.16, 1, 0.3, 1] as const;

function VisionPart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <SectionGlow
        position="center"
        color="rgba(200,168,78,0.04)"
        size="ellipse_50%_40%"
      />

      <div className="absolute inset-0">
        <Image
          src="/images/vision-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[var(--surface-elevated)] via-[color-mix(in_srgb,var(--surface-elevated)_80%,transparent)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, x: -50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl glass rounded-3xl p-8"
        >
          <span className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">
            {VISION.badge}
          </span>

          <blockquote
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            &ldquo;{VISION.quote}&rdquo;
          </blockquote>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="gradient-line my-8 max-w-sm origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.4 }}
            className="leading-relaxed max-w-lg"
            style={{ color: "var(--text-tertiary)" }}
          >
            {VISION.text}
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[var(--surface-elevated)] to-transparent" />
    </section>
  );
}

function ValuesPart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="values" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <SectionGlow
        position="center"
        color="color-mix(in srgb, var(--color-accent) 5%, transparent)"
        size="ellipse_60%_40%"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="gradient-line flex-1" />
            <span className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">
              Triết lý
            </span>
            <div className="gradient-line flex-1" />
          </div>
          <h2
            className="heading-lg font-bold text-center mt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Hệ <span className="text-gradient-gold">giá trị cốt lõi</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {VALUES_DATA.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.15 }}
            >
              <ShineCard lightColor="color-mix(in srgb, var(--color-accent) 10%, transparent)">
                <div className="tilt-card group relative">
                  <div
                    className="tilt-card-inner glass rounded-3xl p-8 h-full transition-all duration-300"
                    style={{ borderTop: "0.5px solid var(--glass-border)" }}
                  >
                    <div className="tilt-card-content">
                      <div className="flex items-start justify-between mb-6">
                        <span
                          className="text-5xl font-bold select-none"
                          style={{
                            color:
                              "color-mix(in srgb, var(--color-accent) 15%, transparent)",
                          }}
                        >
                          {v.number}
                        </span>
                        <Quote
                          size={24}
                          style={{
                            color:
                              "color-mix(in srgb, var(--color-accent) 20%, transparent)",
                          }}
                        />
                      </div>
                      <p
                        className="text-lg font-semibold leading-relaxed mb-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        &ldquo;{v.quote}&rdquo;
                      </p>
                      <div className="gradient-line mb-5 opacity-50" />
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {v.text}
                      </p>
                    </div>
                    <div className="tilt-card-shine" />
                  </div>
                </div>
              </ShineCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ValuesVision() {
  return (
    <>
      <VisionPart />
      <ValuesPart />
    </>
  );
}
