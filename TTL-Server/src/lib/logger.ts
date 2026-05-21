type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  [key: string]: unknown
}

const isProduction = process.env.NODE_ENV === "production"

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  }

  if (isProduction) {
    if (level === "error") {
      console.error(JSON.stringify(entry))
    } else {
      console.log(JSON.stringify(entry))
    }
  } else {
    const prefix = `[${level.toUpperCase()}]`
    if (level === "error") {
      console.error(prefix, message, data || "")
    } else if (level === "warn") {
      console.warn(prefix, message, data || "")
    } else {
      console.log(prefix, message, data || "")
    }
  }
}

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => log("error", message, data),
  debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
}
