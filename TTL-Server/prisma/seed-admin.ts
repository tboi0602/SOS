import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function generateMemberId(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  return `THV-TV-${digits}`;
}

async function main() {
  const email = "admin@vnsales.org";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin account already exists:", email);
    await prisma.user.update({ where: { email }, data: { role: "admin" } });
    console.log("Updated role to admin");
  } else {
    const id = generateMemberId();
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    await prisma.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        isActive: true,
      },
    });
    console.log("Created admin account:", email);
    console.log("Password: Admin@123");
    console.log("Admin ID:", id);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
