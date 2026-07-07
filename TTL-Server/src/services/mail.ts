import { Resend } from "resend";
import { config } from "../config";
import { logger } from "../lib/logger";

const resend = new Resend(config.email.resendApiKey);

const FRONTEND_URL = config.email.frontendUrl;
const FROM = config.email.from;

const BRAND = {
  name: "TRUNG TÂM ĐỀ CỬ TINH HOA VIỆT",
  short: "TINH HOA VIỆT",
  gold: "#d4a843",
  goldLight: "#e8c76a",
  goldDark: "#b8912e",
  bg: "#0d0808",
  bgCard: "#1a0c0c",
  text: "#e8e4f0",
  textMuted: "#a09090",
  border: "rgba(212,168,67,0.15)",
};

const LOGO_URL = `${FRONTEND_URL}/images/tbv-logo.png`;

function wrapLayout(body: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${BRAND.bg};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 24px 16px;
    }
    .container {
      max-width: 520px; margin: 0 auto;
      background: ${BRAND.bgCard};
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid ${BRAND.border};
    }
    .header {
      background: linear-gradient(135deg, #1a0808, #2a0c0c);
      padding: 36px 28px 28px; text-align: center;
    }
    .logo { margin-bottom: 12px; display: inline-block; }
    .header h1 {
      color: ${BRAND.gold}; font-size: 18px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase;
    }
    .header .tagline {
      color: ${BRAND.textMuted}; font-size: 12px; margin-top: 4px; letter-spacing: 0.5px;
    }
    .body { padding: 28px; color: ${BRAND.text}; font-size: 14px; line-height: 1.7; }
    .body strong { color: #fff; }
    .btn {
      display: inline-block; margin: 20px 0;
      background: linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight});
      color: #0a0a1a !important; padding: 13px 36px; border-radius: 10px;
      text-decoration: none; font-weight: 700; font-size: 14px;
      box-shadow: 0 4px 24px rgba(212,168,67,0.3);
    }
    .fallback-link {
      color: ${BRAND.textMuted}; font-size: 12px; word-break: break-all;
      background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px;
      margin-top: 8px; display: block; border: 1px solid ${BRAND.border};
    }
    .divider { border: none; border-top: 1px solid ${BRAND.border}; margin: 24px 0; }
    .footer { padding: 20px 28px 28px; text-align: center; }
    .footer p { color: ${BRAND.textMuted}; font-size: 12px; line-height: 1.6; }
    .footer .brand-name { color: ${BRAND.gold}; font-weight: 700; }
    @media (max-width: 480px) {
      .body { padding: 20px; }
      .header { padding: 28px 20px 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"><img src="${LOGO_URL}" alt="${BRAND.short}" width="44" height="44" style="border-radius:50%;display:block;" /></div>
      <h1>${BRAND.short}</h1>
      <p class="tagline">Trung Tâm Đề Cử Tinh Hoa Việt</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="divider" />
    <div class="footer">
      <p>
        <span class="brand-name">${BRAND.short}</span><br />
        Hotline: 0904 373 123<br />
        Email: tinhhoanoidung@gmail.com
      </p>
      <p style="margin-top:10px;">
        <a href="${FRONTEND_URL}" style="color:${BRAND.gold}; text-decoration:none; font-size:12px;">doitac.tinhhoaviet.org.vn</a>
      </p>
      <p style="margin-top:12px; font-size:11px; color:rgba(160,144,144,0.4);">
        Email này được gửi tự động. Vui lòng không trả lời trực tiếp.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendActivationEmail(
  email: string,
  name: string,
  token: string,
) {
  const link = `${FRONTEND_URL}/auth/activate?token=${token}`;

  logger.info("sendActivationEmail", { email });

  const body = `
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Bạn vừa đăng ký tài khoản tại <strong>${BRAND.short}</strong> — Nơi hội tụ nhân tài, kết nối giá trị Việt.</p>
    <p style="margin-top:16px;">Nhấn nút bên dưới để kích hoạt tài khoản và bắt đầu hành trình phát triển:</p>
    <div style="text-align:center;">
      <a href="${link}" class="btn">Kích hoạt tài khoản</a>
    </div>
    <p style="color:${BRAND.textMuted}; font-size:13px; margin-top:8px;">Liên kết có hiệu lực trong <strong>24 giờ</strong>.</p>
    <p style="margin-top:20px;">Nếu nút không hoạt động, sao chép đường dẫn sau vào trình duyệt:</p>
    <code class="fallback-link">${link}</code>
    <div class="divider" />
    <p style="color:${BRAND.textMuted}; font-size:13px;">
      Bạn nhận được email này vì địa chỉ của bạn đã được dùng để đăng ký tại ${BRAND.short}.
      Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Kích hoạt tài khoản TINH HOA VIỆT",
      html: wrapLayout(body),
    });
  } catch (err) {
    logger.error("sendActivationEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    });
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
) {
  logger.info("sendWelcomeEmail", { email });

  const body = `
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Tài khoản <strong>${BRAND.short}</strong> của bạn đã được kích hoạt thành công!</p>
    <p style="margin-top:16px;">Bạn có thể bắt đầu ngay hành trình rèn luyện — đăng bài viết, viết đạo đức, nộp kỷ luật và theo dõi sự phát triển của bản thân.</p>
    <div style="text-align:center;">
      <a href="${FRONTEND_URL}/home" class="btn">Vào hệ thống</a>
    </div>
    <div class="divider" />
    <p style="color:${BRAND.textMuted}; font-size:13px;">
      Mọi thắc mắc vui lòng liên hệ hotline <strong>0904 373 123</strong>.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Chào mừng bạn đến với TINH HOA VIỆT",
      html: wrapLayout(body),
    });
  } catch (err) {
    logger.error("sendWelcomeEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    });
  }
}

export async function sendResetPasswordEmail(
  email: string,
  name: string,
  token: string,
) {
  const link = `${FRONTEND_URL}/auth/reset-password?token=${token}`;

  logger.info("sendResetPasswordEmail", { email });

  const body = `
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ${BRAND.short} của bạn.</p>
    <p style="margin-top:16px;">Nhấn nút bên dưới để tạo mật khẩu mới:</p>
    <div style="text-align:center;">
      <a href="${link}" class="btn">Đặt lại mật khẩu</a>
    </div>
    <p style="color:${BRAND.textMuted}; font-size:13px; margin-top:8px;">Liên kết có hiệu lực trong <strong>1 giờ</strong>.</p>
    <p style="margin-top:20px;">Nếu nút không hoạt động, sao chép đường dẫn sau vào trình duyệt:</p>
    <code class="fallback-link">${link}</code>
    <div class="divider" />
    <p style="color:${BRAND.textMuted}; font-size:13px;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ <strong>0904 373 123</strong> để được hỗ trợ.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Đặt lại mật khẩu TINH HOA VIỆT",
      html: wrapLayout(body),
    });
  } catch (err) {
    logger.error("sendResetPasswordEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    });
  }
}
