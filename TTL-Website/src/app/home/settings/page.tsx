"use client";

import { useAuthSettings as useSettings } from "@/hook/auth";
import AnimatedBorder from "@/components/profile/AnimatedBorder";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordForm from "@/components/profile/PasswordForm";
import Loading from "@/components/ui/Loading";
import { Settings } from "lucide-react";

const BG = "color-mix(in srgb, var(--surface-elevated) 18%, transparent)";
const SHADOW = "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)";

export default function SettingsPage() {
  const {
    user,
    authLoading,
    name,
    job,
    address,
    avatar,
    bio,
    saving,
    uploading,
    facebook,
    twitter,
    tiktok,
    youtube,
    zalo,
    currentPassword,
    newPassword,
    confirmNewPassword,
    changingPassword,
    setName,
    setJob,
    setAddress,
    setBio,
    setFacebook,
    setTwitter,
    setTiktok,
    setYoutube,
    setZalo,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    handleProfileSubmit,
    handleAvatarUpload,
    handlePasswordSubmit,
  } = useSettings();

  const handleSocialChange = (key: string, v: string) => {
    const setters: Record<string, (v: string) => void> = {
      facebook: setFacebook,
      twitter: setTwitter,
      tiktok: setTiktok,
      youtube: setYoutube,
      zalo: setZalo,
    };
    setters[key]?.(v);
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-6 select-none animate-fade-up" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-center gap-2.5 mb-2">
          <Settings size={18} className="text-accent" />
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Cài đặt tài khoản</h1>
        </div>

        <AnimatedBorder style={{ background: BG, boxShadow: SHADOW }}>
          <ProfileBanner
            name={name}
            email={user?.email || ""}
            referralCode={user?.referralCode ?? null}
            avatar={avatar}
            bio={bio}
            uploading={uploading}
            onFileChange={handleAvatarUpload}
          />
        </AnimatedBorder>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <AnimatedBorder style={{ background: BG, boxShadow: SHADOW }}>
              <ProfileForm
                name={name}
                job={job}
                address={address}
                bio={bio}
                saving={saving}
                facebook={facebook}
                twitter={twitter}
                tiktok={tiktok}
                youtube={youtube}
                zalo={zalo}
                onNameChange={setName}
                onJobChange={setJob}
                onAddressChange={setAddress}
                onBioChange={setBio}
                onSocialChange={handleSocialChange}
                onSubmit={handleProfileSubmit}
              />
            </AnimatedBorder>
          </div>

          <div className="lg:col-span-2">
            <AnimatedBorder style={{ background: BG, boxShadow: SHADOW }}>
              <PasswordForm
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmNewPassword={confirmNewPassword}
                changingPassword={changingPassword}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmNewPasswordChange={setConfirmNewPassword}
                onSubmit={handlePasswordSubmit}
              />
            </AnimatedBorder>
          </div>
        </div>
      </div>
    </div>
  );
}
