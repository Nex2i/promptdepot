/*
  Warnings:

  - You are about to drop the column `content` on the `prompts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentCommitId]` on the table `prompts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_users" DROP CONSTRAINT "project_users_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_users" DROP CONSTRAINT "project_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_directoryId_fkey";

-- DropForeignKey
ALTER TABLE "user_tenants" DROP CONSTRAINT "user_tenants_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "user_tenants" DROP CONSTRAINT "user_tenants_userId_fkey";

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "content",
ADD COLUMN     "currentCommitId" TEXT;

-- CreateTable
CREATE TABLE "prompt_commits" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "message" TEXT,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promptId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "prompt_commits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompt_commits_promptId_version_key" ON "prompt_commits"("promptId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "prompts_currentCommitId_key" ON "prompts"("currentCommitId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "user_tenants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "user_tenants_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_users" ADD CONSTRAINT "project_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_users" ADD CONSTRAINT "project_users_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "directories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_currentCommitId_fkey" FOREIGN KEY ("currentCommitId") REFERENCES "prompt_commits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "directories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_commits" ADD CONSTRAINT "prompt_commits_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_commits" ADD CONSTRAINT "prompt_commits_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
