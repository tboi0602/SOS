import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import ThemeProvider from "@/components/ui/ThemeProvider";
import "./globals.css";
import ChatBoxGate from "@/components/ui/ChatBoxGate";

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

const siteUrl = "https://doitac.tinhhoaviet.org.vn/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT",
    template: "%s | Tinh Hoa Việt",
  },
  description:
    "Tìm kiếm đề cử Tinh Hoa Việt - Kiến tạo Di sản Việt - Chia sẻ - Truyền cảm hứng - Phát triển.",
  keywords: [
    "Tinh Hoa Việt",
    "đề cử",
    "di sản Việt",
    "văn hóa Việt",
    "truyền cảm hứng",
    "phát triển bản thân",
  ],
  authors: [{ name: "Tinh Hoa Việt" }],
  openGraph: {
    title: "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT",
    description:
      "Tìm kiếm đề cử Tinh Hoa Việt - Kiến tạo Di sản Việt - Chia sẻ - Truyền cảm hứng - Phát triển.",
    url: siteUrl,
    siteName: "Tinh Hoa Việt",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT",
    description:
      "Tìm kiếm đề cử Tinh Hoa Việt - Kiến tạo Di sản Việt - Chia sẻ - Truyền cảm hứng - Phát triển.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/tbv-logo.png",
    apple: "/images/tbv-logo.png",
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
          <ThemeProvider>
            <ToastProvider>
              <ChatBoxGate />
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
