"use client";

import Image from "next/image";
import { QrCode, Download } from "lucide-react";

interface QrCodeSectionProps {
  qrUrl: string;
  userName: string;
  referralCode: string | null;
}

export default function QrCodeSection({
  qrUrl,
  userName,
  referralCode,
}: QrCodeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-linear-to-b from-[#08102b] to-[#04081c] p-6 border border-white/5 shadow-xl text-center relative overflow-hidden group">
        <div className="absolute -top-10 -left-10 size-24 bg-primary/20 rounded-full blur-xl pointer-events-none" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-4 justify-center">
          <QrCode size={14} className="text-primary" /> Cổng Thông Tin QR
        </h3>

        <div className="flex justify-center mb-5">
          <div className="relative p-3 rounded-2xl bg-black/40 border border-primary/20 shadow-[0_0_30px_rgba(24,86,255,0.15)] group-hover:border-primary/40 transition-colors duration-300">
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
                className="rounded-xl filter contrast-125 saturate-100 mix-blend-screen"
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
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-linear-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-cyan text-xs font-bold tracking-wider hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 active:scale-95 cursor-pointer shadow-inner"
        >
          <Download size={14} /> TẢI CARD ĐIỆN TỬ
        </button>
      </div>

      <div className="rounded-2xl bg-linear-to-r from-[#0d1b40] to-[#050b1e] p-5 border border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-primary to-cyan" />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
          Mã Định Danh Định Vị
        </p>
        <code className="text-base font-mono font-black text-transparent bg-clip-text bg-linear-to-r from-cyan via-white to-primary tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          {referralCode}
        </code>
      </div>
    </div>
  );
}
