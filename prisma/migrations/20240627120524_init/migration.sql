/*
  Warnings:

  - You are about to drop the column `message_text` on the `tbchat` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `tbchat` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp_sent` on the `tbchat` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tbchat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `tbchat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageText` to the `tbchat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestampSent` to the `tbchat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `tbchat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tbchat_user_id_key";

-- AlterTable
ALTER TABLE "tbchat" DROP COLUMN "message_text",
DROP COLUMN "session_state",
DROP COLUMN "timestamp_sent",
DROP COLUMN "user_id",
ADD COLUMN     "messageText" VARCHAR(120) NOT NULL,
ADD COLUMN     "sessionState" VARCHAR(20) NOT NULL DEFAULT 'active',
ADD COLUMN     "timestampSent" INTEGER NOT NULL,
ADD COLUMN     "userId" CHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbchat_userId_key" ON "tbchat"("userId");
