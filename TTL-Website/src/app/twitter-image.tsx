import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

export default async function Image() {
  const logoUrl = new URL("/images/tbv-logo.png", "https://vnsales.org/").toString()

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 600,
          background: "linear-gradient(135deg, #0d0808 0%, #1a0c0c 50%, #0d0808 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.08) 0%, transparent 50%)",
          }}
        />
        <img
          src={logoUrl}
          alt=""
          width={160}
          height={160}
          style={{
            objectFit: "contain",
            marginBottom: "20px",
            filter: "drop-shadow(0 0 30px rgba(212,168,67,0.3))",
          }}
        />
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: "0.02em",
            textAlign: "center",
            background: "linear-gradient(135deg, #d4a843, #e8c76a)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
          }}
        >
          TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#a09090",
            marginTop: "12px",
            letterSpacing: "0.1em",
          }}
        >
          Kiến tạo Di sản Việt - Chia sẻ - Truyền cảm hứng - Phát triển
        </div>
      </div>
    ),
    { ...size },
  )
}
