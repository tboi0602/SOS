import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import ChatBox from "@/components/landing/ChatBox";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://vnsales.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SOS — Sales Omni System",
  description:
    "Đánh thức tiềm năng — Kiến tạo tương lai. Trang bị hành trang Sales & Marketing thực chiến cho thế hệ trẻ Việt Nam.",
  icons: [{ url: "/images/logo.png", type: "image/png" }],
  openGraph: {
    title: "SOS — Sales Omni System",
    description:
      "Đánh thức tiềm năng — Kiến tạo tương lai. Trang bị hành trang Sales & Marketing thực chiến cho thế hệ trẻ Việt Nam.",
    url: siteUrl,
    siteName: "SOS",
    images: [{ url: "/images/hero-visual.png", width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOS — Sales Omni System",
    description:
      "Đánh thức tiềm năng — Kiến tạo tương lai. Trang bị hành trang Sales & Marketing thực chiến cho thế hệ trẻ Việt Nam.",
    images: ["/images/hero-visual.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ChatBox />
          {children}
        </AuthProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
