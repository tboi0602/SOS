import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { v4 as uuid } from "uuid"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@vnsos.org"
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin account already exists:", email)
    await prisma.user.update({ where: { email }, data: { role: "admin" } })
    console.log("Updated role to admin")
  } else {
    const id = uuid()
    const hashedPassword = await bcrypt.hash("Admin@123", 12)
    await prisma.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        referralCode: id,
        isActive: true,
      },
    })
    console.log("Created admin account:", email)
    console.log("Password: Admin@123")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())