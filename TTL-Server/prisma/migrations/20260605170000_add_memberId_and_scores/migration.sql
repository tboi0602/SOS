-- CreateEnum
CREATE TYPE "visit_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "member_id" TEXT,
ADD COLUMN     "post_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referred_score" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "customer_visit_images" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "status" "visit_status" NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_visit_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_visit_images_user_id_idx" ON "customer_visit_images"("user_id");

-- CreateIndex
CREATE INDEX "customer_visit_images_status_idx" ON "customer_visit_images"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_member_id_key" ON "users"("member_id");

-- AddForeignKey
ALTER TABLE "customer_visit_images" ADD CONSTRAINT "customer_visit_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_visit_images" ADD CONSTRAINT "customer_visit_images_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
