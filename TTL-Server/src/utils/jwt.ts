import jwt from "jsonwebtoken"
import { config } from "../config"

export interface JwtPayload {
  userId: string
  email: string
  tokenVersion: number
  role: string
}

export function signToken(payload: { userId: string; email: string; tokenVersion: number; role: string }): string {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload
  } catch {
    return null
  }
}
