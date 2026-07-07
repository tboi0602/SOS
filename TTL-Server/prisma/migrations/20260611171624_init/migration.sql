-- CreateEnum
CREATE TYPE "visit_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "job" TEXT,
    "address" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "tiktok" TEXT,
    "youtube" TEXT,
    "zalo" TEXT,
    "referred_by" TEXT,
    "ky_luat" INTEGER NOT NULL DEFAULT 0,
    "dao_duc" INTEGER NOT NULL DEFAULT 0,
    "truyen_cam_hung" INTEGER NOT NULL DEFAULT 0,
    "post_score" INTEGER NOT NULL DEFAULT 0,
    "referred_score" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "activation_token" TEXT,
    "activation_token_expires" TIMESTAMP(3),
    "reset_token" TEXT,
    "reset_token_expires" TIMESTAMP(3),
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_submission_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" JSONB DEFAULT '[]',
    "points" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "video_url" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "points" INTEGER NOT NULL DEFAULT 0,
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" JSONB DEFAULT '[]',
    "videos" JSONB DEFAULT '[]',
    "product_link" TEXT,
    "hashtags" JSONB DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'manual',
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "images" JSONB DEFAULT '[]',
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_visit_images" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "status" "visit_status" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_visit_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_flows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Hội viên chính thức',
    "price" INTEGER NOT NULL DEFAULT 6000000,
    "rules" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membership_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_defs" (
    "id" TEXT NOT NULL,
    "membership_flow_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'online',
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,

    CONSTRAINT "lesson_defs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_membership_flows" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "membership_flow_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_docs',
    "documents_url" TEXT,
    "admin_note" TEXT,
    "payment_confirmed_at" TIMESTAMP(3),
    "payment_verified_at" TIMESTAMP(3),
    "payment_verified_by" TEXT,
    "quiz_id" TEXT,
    "quiz_exam_set_id" TEXT,
    "quiz_score" INTEGER,
    "quiz_correct_count" INTEGER,
    "quiz_attempts" INTEGER NOT NULL DEFAULT 0,
    "quiz_passed" BOOLEAN,
    "situation_1_id" TEXT,
    "situation_1_link" TEXT,
    "situation_1_score" INTEGER,
    "situation_2_id" TEXT,
    "situation_2_link" TEXT,
    "situation_2_score" INTEGER,
    "total_score" INTEGER DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_membership_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lessons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_def_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "product_url" TEXT,
    "score" INTEGER,
    "admin_note" TEXT,
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "membership_flow_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "situation_questions" (
    "id" TEXT NOT NULL,
    "membership_flow_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "situation_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_exam_sets" (
    "id" TEXT NOT NULL,
    "membership_flow_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pass_score" INTEGER NOT NULL DEFAULT 9,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_exam_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_exam_set_questions" (
    "id" TEXT NOT NULL,
    "exam_set_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_exam_set_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "journals_user_id_idx" ON "journals"("user_id");

-- CreateIndex
CREATE INDEX "journals_status_idx" ON "journals"("status");

-- CreateIndex
CREATE INDEX "submissions_user_id_idx" ON "submissions"("user_id");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "customer_visit_images_user_id_idx" ON "customer_visit_images"("user_id");

-- CreateIndex
CREATE INDEX "customer_visit_images_status_idx" ON "customer_visit_images"("status");

-- CreateIndex
CREATE INDEX "lesson_defs_membership_flow_id_idx" ON "lesson_defs"("membership_flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_membership_flows_user_id_key" ON "user_membership_flows"("user_id");

-- CreateIndex
CREATE INDEX "user_membership_flows_status_idx" ON "user_membership_flows"("status");

-- CreateIndex
CREATE INDEX "user_lessons_user_id_idx" ON "user_lessons"("user_id");

-- CreateIndex
CREATE INDEX "user_lessons_lesson_def_id_idx" ON "user_lessons"("lesson_def_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_lessons_user_id_lesson_def_id_key" ON "user_lessons"("user_id", "lesson_def_id");

-- CreateIndex
CREATE INDEX "quiz_questions_membership_flow_id_idx" ON "quiz_questions"("membership_flow_id");

-- CreateIndex
CREATE INDEX "situation_questions_membership_flow_id_idx" ON "situation_questions"("membership_flow_id");

-- CreateIndex
CREATE INDEX "quiz_exam_sets_membership_flow_id_idx" ON "quiz_exam_sets"("membership_flow_id");

-- CreateIndex
CREATE INDEX "quiz_exam_set_questions_exam_set_id_idx" ON "quiz_exam_set_questions"("exam_set_id");

-- CreateIndex
CREATE INDEX "quiz_exam_set_questions_question_id_idx" ON "quiz_exam_set_questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_exam_set_questions_exam_set_id_question_id_key" ON "quiz_exam_set_questions"("exam_set_id", "question_id");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_visit_images" ADD CONSTRAINT "customer_visit_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_visit_images" ADD CONSTRAINT "customer_visit_images_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_defs" ADD CONSTRAINT "lesson_defs_membership_flow_id_fkey" FOREIGN KEY ("membership_flow_id") REFERENCES "membership_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_membership_flow_id_fkey" FOREIGN KEY ("membership_flow_id") REFERENCES "membership_flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_quiz_exam_set_id_fkey" FOREIGN KEY ("quiz_exam_set_id") REFERENCES "quiz_exam_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_situation_1_id_fkey" FOREIGN KEY ("situation_1_id") REFERENCES "situation_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_situation_2_id_fkey" FOREIGN KEY ("situation_2_id") REFERENCES "situation_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_membership_flows" ADD CONSTRAINT "user_membership_flows_payment_verified_by_fkey" FOREIGN KEY ("payment_verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lessons" ADD CONSTRAINT "user_lessons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lessons" ADD CONSTRAINT "user_lessons_lesson_def_id_fkey" FOREIGN KEY ("lesson_def_id") REFERENCES "lesson_defs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_membership_flow_id_fkey" FOREIGN KEY ("membership_flow_id") REFERENCES "membership_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "situation_questions" ADD CONSTRAINT "situation_questions_membership_flow_id_fkey" FOREIGN KEY ("membership_flow_id") REFERENCES "membership_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_exam_sets" ADD CONSTRAINT "quiz_exam_sets_membership_flow_id_fkey" FOREIGN KEY ("membership_flow_id") REFERENCES "membership_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_exam_set_questions" ADD CONSTRAINT "quiz_exam_set_questions_exam_set_id_fkey" FOREIGN KEY ("exam_set_id") REFERENCES "quiz_exam_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_exam_set_questions" ADD CONSTRAINT "quiz_exam_set_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
