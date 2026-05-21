-- Add admin approval fields to journals
ALTER TABLE "journals" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "journals" ADD COLUMN IF NOT EXISTS "admin_note" TEXT;
ALTER TABLE "journals" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS "journals_status_idx" ON "journals"("status");

-- Update existing journals to approved (backward compatibility)
UPDATE "journals" SET "status" = 'approved' WHERE "status" = 'pending';

-- Add last_submission_date to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_submission_date" TIMESTAMPTZ;

-- Create submissions table
CREATE TABLE IF NOT EXISTS "submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "video_url" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "points" INTEGER NOT NULL DEFAULT 0,
    "admin_note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "submissions_user_id_idx" ON "submissions"("user_id");
CREATE INDEX IF NOT EXISTS "submissions_status_idx" ON "submissions"("status");

ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
