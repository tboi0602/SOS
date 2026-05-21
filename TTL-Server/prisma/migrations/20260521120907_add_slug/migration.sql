-- AlterTable
ALTER TABLE "users" ADD COLUMN "slug" TEXT;
ALTER TABLE "posts" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_slug_key" ON "users"("slug");
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");