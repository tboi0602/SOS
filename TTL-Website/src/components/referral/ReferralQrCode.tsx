"use client";

import Image from "next/image";
import { QrCode, Download, Check } from "lucide-react";
import type { RefObject } from "react";

interface ReferralQrCodeProps {
  qrUrl: string;
  qrDownloaded: boolean;
  qrRef: RefObject<HTMLDivElement | null>;
  onDownloadQR: () => void;
}

export default function ReferralQrCode({ qrUrl, qrDownloaded, qrRef, onDownloadQR }: ReferralQrCodeProps) {
  return (
    <div className="rounded-2xl p-5 group" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)", border: "0.5px solid var(--border-base)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Mã QR Định Danh</h2>
        </div>
        <button
          onClick={onDownloadQR}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider hover:bg-accent/20 transition-all cursor-pointer"
        >
          {qrDownloaded ? <Check size={12} /> : <Download size={12} />}
          {qrDownloaded ? "Đã tải" : "Tải xuống"}
        </button>
      </div>
      <div ref={qrRef} className="flex justify-center py-2">
        <div className="size-44 rounded-xl p-2 border border-accent/30 flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-300" style={{ background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)", boxShadow: "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)" }}>
          <Image
            src={qrUrl}
            alt="QR Code"
            width={176}
            height={176}
            unoptimized
            className="size-full rounded-lg mix-blend-screen"
          />
        </div>
      </div>
    </div>
  );
}
