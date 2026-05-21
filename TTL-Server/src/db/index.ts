import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export function getDb() {
  return prisma
}

export async function initDb() {
  await prisma.$connect()
}

export async function closeDb() {
  await prisma.$disconnect()
}
