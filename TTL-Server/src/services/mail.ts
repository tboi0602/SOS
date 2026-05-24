import { Resend } from "resend";
import { config } from "../config";
import { logger } from "../lib/logger";

const resend = new Resend(config.email.resendApiKey);

const FRONTEND_URL = config.email.frontendUrl;
const FROM = config.email.from;

const BRAND = {
  name: "SOS — Sales Omni System",
  primary: "#1856ff",
  primaryLight: "#3b7aff",
  cyan: "#00c3ff",
  gold: "#f59e0b",
  bg: "#0c1e3a",
  bgCard: "#132545",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  border: "rgba(255,255,255,0.08)",
};

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
      background: linear-gradient(135deg, ${BRAND.primary}, ${BRAND.cyan});
      padding: 32px 28px; text-align: center;
    }
    .header h1 { color: #fff; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 4px; }
    .body { padding: 28px; color: ${BRAND.text}; font-size: 14px; line-height: 1.7; }
    .body strong { color: #fff; }
    .btn {
      display: inline-block; margin: 20px 0;
      background: linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight});
      color: #fff !important; padding: 14px 36px; border-radius: 12px;
      text-decoration: none; font-weight: 600; font-size: 15px;
      box-shadow: 0 4px 20px rgba(24,86,255,0.35);
    }
    .fallback-link {
      color: ${BRAND.textMuted}; font-size: 12px; word-break: break-all;
      background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px;
      margin-top: 8px; display: block; border: 1px solid ${BRAND.border};
    }
    .divider { border: none; border-top: 1px solid ${BRAND.border}; margin: 24px 0; }
    .footer { padding: 20px 28px 28px; text-align: center; }
    .footer p { color: ${BRAND.textMuted}; font-size: 12px; line-height: 1.6; }
    .footer .social { margin-top: 12px; }
    .footer .social a {
      display: inline-block; margin: 0 6px; padding: 6px 12px;
      background: rgba(255,255,255,0.06); border-radius: 6px;
      color: ${BRAND.textMuted}; text-decoration: none; font-size: 11px;
    }
    @media (max-width: 480px) {
      .body { padding: 20px; }
      .header { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${BRAND.name}</h1>
      <p>Đánh thức tiềm năng — Kiến tạo tương lai</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="divider" />
    <div class="footer">
      <p>
        <strong style="color:#fff;">SOS — Sales Omni System</strong><br />
        Hotline: 0904 373 123 · Email: support@vnsales.org
      </p>
      <div class="social">
        <a href="https://vnsales.org">Website</a>
        <a href="#">Facebook</a>
        <a href="#">Zalo</a>
      </div>
      <p style="margin-top:12px; font-size:11px; color:rgba(148,163,184,0.5);">
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
    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>SOS</strong> — Hệ thống đào tạo Sales &amp; Marketing thực chiến dành cho giới trẻ Việt Nam.</p>
    <p style="margin-top:16px;">Vui lòng nhấn nút bên dưới để kích hoạt tài khoản và bắt đầu hành trình phát triển kỹ năng của bạn:</p>
    <div style="text-align:center;">
      <a href="${link}" class="btn">Kích hoạt tài khoản</a>
    </div>
    <p style="color:${BRAND.textMuted}; font-size:13px; margin-top:8px;">Liên kết có hiệu lực trong <strong>24 giờ</strong>.</p>
    <p style="margin-top:20px;">Nếu nút không hoạt động, sao chép đường dẫn sau vào trình duyệt:</p>
    <code class="fallback-link">${link}</code>
    <div class="divider" />
    <p style="color:${BRAND.textMuted}; font-size:13px;">
      Bạn nhận được email này vì địa chỉ email của bạn đã được sử dụng để đăng ký tài khoản SOS.
      Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Kích hoạt tài khoản SOS — Sales Omni System",
      html: wrapLayout(body),
    });
  } catch (err) {
    logger.error("sendActivationEmail failed", {
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
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>SOS</strong> của bạn.</p>
    <p>Nhấn nút bên dưới để tạo mật khẩu mới:</p>
    <div style="text-align:center;">
      <a href="${link}" class="btn">Đặt lại mật khẩu</a>
    </div>
    <p style="color:${BRAND.textMuted}; font-size:13px; margin-top:8px;">Liên kết có hiệu lực trong <strong>1 giờ</strong>.</p>
    <p style="margin-top:20px;">Nếu nút không hoạt động, sao chép đường dẫn sau vào trình duyệt:</p>
    <code class="fallback-link">${link}</code>
    <div class="divider" />
    <p style="color:${BRAND.textMuted}; font-size:13px;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ hotline <strong>0904 373 123</strong> để được hỗ trợ.
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Đặt lại mật khẩu SOS — Sales Omni System",
      html: wrapLayout(body),
    });
  } catch (err) {
    logger.error("sendResetPasswordEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    });
  }
}
