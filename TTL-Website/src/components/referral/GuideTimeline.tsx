"use client";

import { Users, QrCode, Share2, Gift } from "lucide-react";

export default function GuideTimeline() {
  const steps = [
    { step: 1, title: "Lưu mã QR hoặc sao chép mã", desc: "Tải mã QR hoặc sao chép liên kết định danh để chia sẻ công khai.", icon: QrCode },
    { step: 2, title: "Gửi cho người bạn muốn giới thiệu", desc: "Người nhận nhấp liên kết hoặc quét mã để tiến hành quá trình thiết lập tài khoản.", icon: Share2 },
    { step: 3, title: "Hệ thống xác nhận thành công", desc: "Khi tài khoản mới kích hoạt thành công, bạn nhận ngay +2 điểm Truyền cảm hứng!", icon: Gift },
  ];

  return (
    <div className="rounded-2xl p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4" style={{ color: "var(--text-secondary)" }}>
        <Users size={15} className="text-primary" /> Cách thức vận hành mạng lưới
      </h2>

      <div className="space-y-4">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <Icon size={14} />
                </div>
                {item.step < 3 && <div className="w-px flex-1 my-1" style={{ background: "var(--border-base)" }} />}
              </div>
              <div className="pb-1">
                <h3 className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Bước {item.step}: {item.title}</h3>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
