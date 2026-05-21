import { Resend } from "resend"
import { config } from "../config"
import { logger } from "../lib/logger"

const resend = new Resend(config.email.resendApiKey)

const FRONTEND_URL = config.email.frontendUrl
const FROM = config.email.from

export async function sendActivationEmail(email: string, name: string, token: string) {
  const link = `${FRONTEND_URL}/auth/activate?token=${token}`

  logger.info("sendActivationEmail", { email, link })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a56db;">Kích hoạt tài khoản SOS</h2>
      <p>Xin chào <strong>${name}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>SOS - Sales Omni System</strong>.</p>
      <p>Vui lòng nhấn nút bên dưới để kích hoạt tài khoản:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}"
           style="background: #1a56db; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Kích hoạt tài khoản
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
      <p style="color: #666; font-size: 12px; word-break: break-all;">${link}</p>
      <p style="color: #666; font-size: 14px;">Liên kết có hiệu lực trong 24 giờ.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Kích hoạt tài khoản SOS",
      html,
    })
  } catch (err) {
    logger.error("sendActivationEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    })
  }
}

export async function sendResetPasswordEmail(email: string, name: string, token: string) {
  const link = `${FRONTEND_URL}/auth/reset-password?token=${token}`

  logger.info("sendResetPasswordEmail", { email, link })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a56db;">Đặt lại mật khẩu SOS</h2>
      <p>Xin chào <strong>${name}</strong>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng nhấn nút bên dưới để đặt lại mật khẩu:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}"
           style="background: #1a56db; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Đặt lại mật khẩu
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
      <p style="color: #666; font-size: 12px; word-break: break-all;">${link}</p>
      <p style="color: #666; font-size: 14px;">Liên kết có hiệu lực trong 1 giờ.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Đặt lại mật khẩu SOS",
      html,
    })
  } catch (err) {
    logger.error("sendResetPasswordEmail failed", {
      error: err instanceof Error ? err.message : String(err),
      email,
    })
  }
}
