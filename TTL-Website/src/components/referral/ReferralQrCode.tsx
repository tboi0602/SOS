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
    <div className="rounded-2xl bg-linear-to-b from-white/3 to-transparent border border-white/5 p-5 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-cyan" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Mã QR Định Danh</h2>
        </div>
        <button
          onClick={onDownloadQR}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-bold uppercase tracking-wider hover:bg-cyan/20 transition-all cursor-pointer"
        >
          {qrDownloaded ? <Check size={12} /> : <Download size={12} />}
          {qrDownloaded ? "Đã tải" : "Tải xuống"}
        </button>
      </div>
      <div ref={qrRef} className="flex justify-center py-2">
        <div className="size-44 rounded-xl p-2 bg-black/40 border border-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-transform group-hover:scale-[1.02] duration-300">
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
