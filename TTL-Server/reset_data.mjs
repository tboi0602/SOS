import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

const adminEmail = 'admin@tinhhoaviet.org.vn'

const admin = await p.user.findUnique({ where: { email: adminEmail }, select: { id: true } })
if (!admin) { console.log('Admin not found!'); process.exit(1) }

// Clear nullable FKs pointing to users that will be deleted
await p.$executeRawUnsafe(`UPDATE customer_visit_images SET reviewed_by = NULL WHERE reviewed_by IS NOT NULL AND reviewed_by != $1`, admin.id)
await p.$executeRawUnsafe(`UPDATE user_membership_flows SET payment_verified_by = NULL WHERE payment_verified_by IS NOT NULL AND payment_verified_by != $1`, admin.id)
await p.$executeRawUnsafe(`UPDATE audit_logs SET user_id = NULL WHERE user_id IS NOT NULL AND user_id != $1`, admin.id)

// Delete all non-admin users (cascade handles their owned data)
const result = await p.user.deleteMany({ where: { id: { not: admin.id } } })
console.log(`Deleted ${result.count} users`)

// Clean up contact messages (non-user data)
const cm = await p.contactMessage.deleteMany()
console.log(`Deleted ${cm.count} contact messages`)

console.log('Done - all data reset, only admin account remains.')
await p.$disconnect()
