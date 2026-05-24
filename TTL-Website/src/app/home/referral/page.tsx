"use client";

import { Gift } from "lucide-react";
import { useReferral } from "@/hook/referral/useReferral";
import ReferralQrCode from "@/components/referral/ReferralQrCode";
import ReferralCodeCard from "@/components/referral/ReferralCodeCard";
import ReferralLinkCard from "@/components/referral/ReferralLinkCard";
import CompetencyBars from "@/components/referral/CompetencyBars";
import GuideTimeline from "@/components/referral/GuideTimeline";

function ReferralHeader() {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
      <div className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-cyan/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(24,86,255,0.15)]">
        <Gift size={22} className="text-cyan animate-pulse" />
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          MÃ GIỚI THIỆU HỆ THỐNG
        </h1>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
          Mở rộng liên kết thương hiệu và nhận điểm đặc quyền
        </p>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const {
    user,
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
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <ReferralHeader />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
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

          <div className="lg:col-span-3 space-y-4">
            <CompetencyBars
              kLuat={user?.kyLuat ?? 0}
              dDuc={user?.daoDuc ?? 0}
              tC_Hung={user?.truyenCamHung ?? 0}
            />
            <GuideTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
