/* eslint-disable @next/next/no-img-element */
"use client";

import { QrCode } from "lucide-react";

export default function QrCodeCard({
  qrUrl,
  profileUrl,
}: {
  qrUrl: string;
  profileUrl: string;
}) {
  return (
    <div className="p-4">
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-[var(--clr-accent)] mb-1">
        TRANG CÁ NHÂN
      </h3>
      <p className="text-[10px] text-[var(--text-tertiary)] mb-3">
        Quét mã để chia sẻ hồ sơ năng lực
      </p>
      <div className="flex items-center gap-4">
        <div
          className="size-24 rounded-xl p-1.5 shrink-0"
          style={{
            background: "color-mix(in srgb, var(--text-primary) 30%, transparent)",
            border: "1px solid color-mix(in srgb, var(--clr-accent) 15%, transparent)",
          }}
        >
          <img
            src={qrUrl}
            alt="QR"
            className="size-full rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(profileUrl)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
          style={{
            background: "color-mix(in srgb, var(--clr-accent) 8%, transparent)",
            color: "var(--clr-accent)",
            border: "1px solid color-mix(in srgb, var(--clr-accent) 20%, transparent)",
          }}
        >
          <QrCode size={13} /> SAO CHÉP LINK
        </button>
      </div>
    </div>
  );
}
