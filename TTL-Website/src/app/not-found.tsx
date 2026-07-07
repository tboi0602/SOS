import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden select-none"
      style={{ color: "var(--text-primary)", background: "#0d0808" }}
    >
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-30 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.2) 0%, transparent 70%)",
          animationDuration: "4s",
        }}
      />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-20 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)",
          animationDuration: "5s",
          animationDelay: "-2s",
        }}
      />

      <div className="relative max-w-md space-y-6">
        <div className="text-[140px] font-bold leading-none"
          style={{
            background: "linear-gradient(135deg, #d4a843, #e8c76a, #d4a843)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(212,168,67,0.3))",
          }}
        >
          404
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Trang không tìm thấy</h1>
          <p className="text-sm max-w-xs mx-auto"
            style={{ color: "#a09090" }}
          >
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #d4a843, #e8c76a)",
            color: "#0d0808",
            boxShadow: "0 4px 20px rgba(212,168,67,0.25)",
          }}
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
