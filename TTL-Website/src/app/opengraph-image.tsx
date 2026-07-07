import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logoUrl = new URL("/images/tbv-logo.png", "https://doitac.tinhhoaviet.org.vn/").toString()

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "80%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.03) 0%, transparent 60%)",
          }}
        />
        <img
          src={logoUrl}
          alt=""
          width={200}
          height={200}
          style={{
            objectFit: "contain",
            marginBottom: "24px",
            filter: "drop-shadow(0 0 30px rgba(212,168,67,0.3))",
          }}
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "0.02em",
            textAlign: "center",
            background: "linear-gradient(135deg, #d4a843, #e8c76a)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
          }}
        >
          TRUNG TÂM ĐỀ CỬ
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "0.02em",
            textAlign: "center",
            background: "linear-gradient(135deg, #d4a843, #e8c76a)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
          }}
        >
          TINH HOA VIỆT
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#a09090",
            marginTop: "16px",
            letterSpacing: "0.1em",
          }}
        >
          Kiến tạo Di sản Việt
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
