"use client";

import FeedSidebar from "@/components/feed/FeedSidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,color-mix(in srgb,var(--color-primary)10%,transparent)_0%,transparent_60%)] pointer-events-none" />

      <FeedSidebar />

      <main className="lg:pl-[var(--sidebar-width,15rem)] pt-14 lg:pt-0 pb-22 lg:pb-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
