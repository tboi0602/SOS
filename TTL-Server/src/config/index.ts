function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  port: Number(optionalEnv("PORT", "4000")),
  nodeEnv: optionalEnv("NODE_ENV", "development"),
  isProduction: optionalEnv("NODE_ENV", "development") === "production",

  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: "2h" as const,
  },

  db: {
    url: requireEnv("DATABASE_URL"),
  },

  cors: {
    origin: optionalEnv("CORS_ORIGIN", "http://localhost:3000"),
  },

  email: {
    resendApiKey: requireEnv("RESEND_API_KEY"),
    from: optionalEnv("EMAIL_FROM", "SOS onboarding@vnsales.org"),
    frontendUrl: optionalEnv("FRONTEND_URL", "http://localhost:3000"),
  },

  gemini: {
    apiKey: optionalEnv("GEMINI_API_KEY", ""),
  },

  google: {
    clientId: requireEnv("GOOGLE_CLIENT_ID"),
  },

  tbvOidc: {
    issuer: optionalEnv("TBV_OIDC_ISSUER", ""),
    clientId: optionalEnv("TBV_OIDC_CLIENT_ID", ""),
    clientSecret: optionalEnv("TBV_OIDC_CLIENT_SECRET", ""),
    redirectUri: optionalEnv("TBV_OIDC_REDIRECT_URI", "http://localhost:4000/api/v1/auth/oidc/callback"),
  },
} as const;
