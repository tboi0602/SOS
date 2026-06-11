"use client";

import { Gift } from "lucide-react";
import { useReferral } from "@/hook/referral/useReferral";
import ReferralQrCode from "@/components/referral/ReferralQrCode";
import ReferralCodeCard from "@/components/referral/ReferralCodeCard";
import ReferralLinkCard from "@/components/referral/ReferralLinkCard";
import GuideTimeline from "@/components/referral/GuideTimeline";

function ReferralHeader() {
  return (
    <div className="flex items-center gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-base)" }}>
      <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
        <Gift size={22} className="text-accent animate-pulse" />
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
          MÃ GIỚI THIỆU HỆ THỐNG
        </h1>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
          Mở rộng liên kết thương hiệu và nhận điểm đặc quyền
        </p>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const {
    code,
    link,
    qrUrl,
    copied,
    qrDownloaded,
    qrRef,
    handleCopyCode,
    handleCopyLink,
    handleDownloadQR,
  } = useReferral();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 select-none relative z-10 animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <ReferralHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReferralQrCode
            qrUrl={qrUrl}
            qrDownloaded={qrDownloaded}
            qrRef={qrRef}
            onDownloadQR={handleDownloadQR}
          />
          <ReferralCodeCard
            code={code}
            copied={copied}
            onCopy={handleCopyCode}
          />
          <ReferralLinkCard
            link={link}
            copied={copied}
            onCopy={handleCopyLink}
          />
        </div>

        <GuideTimeline />
      </div>
    </div>
  );
}
