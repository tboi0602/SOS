"use client";

import Image from "next/image";
import { QrCode, Download } from "lucide-react";

interface QrCodeSectionProps {
  qrUrl: string;
  userName: string;
  id: string;
}

export default function QrCodeSection({
  qrUrl,
  userName,
  id,
}: QrCodeSectionProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="rounded-3xl p-6 text-center relative overflow-hidden group" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
        <div className="absolute -top-10 -left-10 size-24 rounded-full blur-xl pointer-events-none" style={{ background: "color-mix(in srgb, var(--clr-accent) 20%, transparent)" }} />
        <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 justify-center" style={{ color: "var(--text-tertiary)" }}>
          <QrCode size={14} className="text-accent" /> Cổng Thông Tin QR
        </h3>

        <div className="flex justify-center mb-5">
          <div className="relative p-3 rounded-2xl group-hover:border-primary/40 transition-all duration-300" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", border: "0.5px solid var(--border-base)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
            <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-primary" />

            <div className="relative size-40">
              <Image
                src={qrUrl}
                alt="Hồ sơ QR chuyên nghiệp"
                fill
                unoptimized
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const a = document.createElement("a");
            a.href = qrUrl;
            a.download = `${userName}-profile.png`;
            a.click();
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 text-accent text-xs font-bold tracking-wider hover:from-primary/20 hover:to-accent/20 transition-all duration-300 active:scale-95 cursor-pointer shadow-inner"
        >
          <Download size={14} /> TẢI CARD ĐIỆN TỬ
        </button>
      </div>

      <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
        <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-primary to-accent" />
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>
          Mã Định Danh Định Vị
        </p>
        <code className="text-base font-mono font-black tracking-wider" style={{ color: "var(--clr-accent)" }}>
          {id}
        </code>
      </div>
    </div>
  );
}
