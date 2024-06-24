/*
  Warnings:

  - Added the required column `user_alias` to the `tbchat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbchat" ADD COLUMN     "session_state" VARCHAR(20) NOT NULL DEFAULT 'active',
ADD COLUMN     "user_alias" VARCHAR(20) NOT NULL;
