"use client";

import { Loader2, Save, User, Globe } from "lucide-react";

const inputStyle =
  "w-full rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#00b7ff]/40 focus:ring-1 focus:ring-[#00b7ff]/20 outline-none transition-all";

const socialFields = [
  { label: "Facebook", key: "facebook" as const, placeholder: "https://facebook.com/..." },
  { label: "Twitter", key: "twitter" as const, placeholder: "https://twitter.com/..." },
  { label: "TikTok", key: "tiktok" as const, placeholder: "https://tiktok.com/..." },
  { label: "YouTube", key: "youtube" as const, placeholder: "https://youtube.com/..." },
  { label: "Zalo", key: "zalo" as const, placeholder: "Số điện thoại Zalo" },
];

export default function ProfileForm({
  name, job, address, bio, saving,
  facebook, twitter, tiktok, youtube, zalo,
  onNameChange, onJobChange, onAddressChange, onBioChange,
  onSocialChange,
  onSubmit,
}: {
  name: string; job: string; address: string; bio: string;
  saving: boolean;
  facebook: string; twitter: string; tiktok: string; youtube: string; zalo: string;
  onNameChange: (v: string) => void;
  onJobChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onSocialChange: (key: string, v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const socialVals: Record<string, string> = { facebook, twitter, tiktok, youtube, zalo };

  return (
    <form onSubmit={onSubmit}>
      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] flex items-center gap-2">
            <User size={12} /> THÔNG TIN CÁ NHÂN
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1">Họ tên, công việc, địa chỉ</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Họ và tên</label>
            <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} required className={inputStyle} placeholder="Nguyễn Văn A" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Công việc</label>
              <input type="text" value={job} onChange={(e) => onJobChange(e.target.value)} placeholder="Chuyên viên Sales" className={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Địa chỉ</label>
              <input type="text" value={address} onChange={(e) => onAddressChange(e.target.value)} placeholder="Hồ Chí Minh" className={inputStyle} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Giới thiệu</label>
            <textarea value={bio} onChange={(e) => onBioChange(e.target.value)} placeholder="Viết vài dòng về bản thân..." rows={2} className={`${inputStyle} resize-none`} />
          </div>
        </div>

        <div className="border-t border-white/4 pt-5">
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#00b7ff] flex items-center gap-2 mb-3">
            <Globe size={12} /> MẠNG XÃ HỘI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialFields.map((s) => (
              <div key={s.label} className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">{s.label}</label>
                <input
                  type="text"
                  value={socialVals[s.key]}
                  onChange={(e) => onSocialChange(s.key, e.target.value)}
                  placeholder={s.placeholder}
                  className={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#00b7ff] hover:bg-[#00b7ff]/90 text-black font-bold py-3 text-[11px] transition-all shadow-lg shadow-[#00b7ff]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </button>
      </div>
    </form>
  );
}
