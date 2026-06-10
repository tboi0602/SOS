import crypto from "crypto"
import bcrypt from "bcryptjs"
import { v4 as uuid } from "uuid"
import { config } from "../config"
import { getDb } from "../db"
import { signToken } from "../utils/jwt"
import { toSafeUser } from "../lib/safeUser"
import { logger } from "../lib/logger"
import { BadRequestError, ServiceUnavailableError, UnauthorizedError } from "../lib/errors"

interface OidcStoreEntry {
  verifier: string
  createdAt: number
}

const oidcStore = new Map<string, OidcStoreEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of oidcStore) {
    if (now - val.createdAt > 600_000) {
      oidcStore.delete(key)
    }
  }
}, 300_000)

function isConfigured() {
  return Boolean(config.tbvOidc.issuer && config.tbvOidc.clientId && config.tbvOidc.clientSecret)
}

function buildAuthUrl(state: string, challenge: string): string {
  const params = new URLSearchParams({
    client_id: config.tbvOidc.clientId,
    redirect_uri: config.tbvOidc.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  })
  return `${config.tbvOidc.issuer}/auth?${params.toString()}`
}

async function exchangeCode(code: string, verifier: string): Promise<{ access_token: string; id_token: string }> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.tbvOidc.redirectUri,
    client_id: config.tbvOidc.clientId,
    client_secret: config.tbvOidc.clientSecret,
    code_verifier: verifier,
  })

  const res = await fetch(`${config.tbvOidc.issuer}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    logger.error("TBV OIDC token exchange failed", { status: res.status, body: text })
    throw new UnauthorizedError("Xác thực TBV thất bại", "TBV_OIDC_TOKEN_FAILED")
  }

  return await res.json() as { access_token: string; id_token: string }
}

async function fetchUserinfo(accessToken: string): Promise<{ sub: string; email: string; name: string; picture?: string }> {
  const res = await fetch(`${config.tbvOidc.issuer}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const text = await res.text()
    logger.error("TBV OIDC userinfo failed", { status: res.status, body: text })
    throw new UnauthorizedError("Không thể lấy thông tin người dùng TBV", "TBV_OIDC_USERINFO_FAILED")
  }

  return await res.json() as { sub: string; email: string; name: string; picture?: string }
}

export const oidcService = {
  initOidcLogin(): { authUrl: string } {
    if (!isConfigured()) {
      throw new ServiceUnavailableError("TBV SSO chưa được cấu hình", "TBV_OIDC_NOT_CONFIGURED")
    }

    const state = crypto.randomUUID()
    const verifier = crypto.randomBytes(32).toString("hex")
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url")

    oidcStore.set(state, { verifier, createdAt: Date.now() })

    const authUrl = buildAuthUrl(state, challenge)
    logger.info("TBV OIDC init", { state })
    return { authUrl }
  },

  async handleOidcCallback(code: string, state: string) {
    if (!isConfigured()) {
      throw new ServiceUnavailableError("TBV SSO chưa được cấu hình", "TBV_OIDC_NOT_CONFIGURED")
    }

    const entry = oidcStore.get(state)
    if (!entry) {
      throw new BadRequestError("Yêu cầu không hợp lệ", "TBV_OIDC_INVALID_STATE")
    }

    if (Date.now() - entry.createdAt > 600_000) {
      oidcStore.delete(state)
      throw new BadRequestError("Yêu cầu đã hết hạn", "TBV_OIDC_STATE_EXPIRED")
    }

    oidcStore.delete(state)

    const tokens = await exchangeCode(code, entry.verifier)
    if (!tokens.access_token) {
      throw new UnauthorizedError("TBV không trả về access token")
    }
    const profile = await fetchUserinfo(tokens.access_token)

    if (!profile.sub || !profile.email) {
      throw new UnauthorizedError("Thông tin TBV không hợp lệ", "TBV_OIDC_INVALID_PROFILE")
    }

    if (!config.isProduction) {
      logger.info("TBV OIDC userinfo", {
        sub: profile.sub,
        email: profile.email,
        name: profile.name,
      })
    }

    let user = await getDb().user.findUnique({ where: { email: profile.email } })

    if (!user) {
      const id = uuid()
      const tempPassword = await bcrypt.hash(uuid(), 12)
      await getDb().user.create({
        data: {
          id,
          email: profile.email,
          name: profile.name || profile.email,
          avatar: profile.picture || null,
          password: tempPassword,
          referralCode: id,
          isActive: true,
        },
      })
      user = await getDb().user.findUnique({ where: { email: profile.email } })!
    } else {
      if (!user.avatar && profile.picture) {
        await getDb().user.update({
          where: { id: user.id },
          data: { avatar: profile.picture },
        })
        user = await getDb().user.findUnique({ where: { id: user.id } })!
      }
    }

    const perms = Array.isArray(user!.permissions) ? user!.permissions as string[] : []
    const token = signToken({
      userId: user!.id,
      email: user!.email,
      tokenVersion: user!.tokenVersion,
      role: user!.role,
      permissions: perms,
    })

    return { user: toSafeUser(user!), token }
  },
}
