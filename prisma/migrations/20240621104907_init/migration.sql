/*
  Warnings:

  - You are about to drop the column `message_id` on the `tbchat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `tbchat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `tbchat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tbchat_message_id_key";

-- AlterTable
ALTER TABLE "tbchat" DROP COLUMN "message_id",
ADD COLUMN     "user_id" CHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbchat_user_id_key" ON "tbchat"("user_id");
