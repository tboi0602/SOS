import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center select-none" style={{ color: "var(--text-primary)", background: "var(--bg-base)" }}>
      <div className="max-w-md space-y-6">
        <div className="text-[120px] font-bold leading-none" style={{ color: "var(--clr-primary)" }}>
          404
        </div>
        <h1 className="text-2xl font-bold">Trang không tìm thấy</h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--clr-primary)", color: "#fff" }}
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
