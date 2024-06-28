-- CreateTable
CREATE TABLE "tbchat" (
    "id" SERIAL NOT NULL,
    "messageText" VARCHAR(120) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "timestampSent" INTEGER NOT NULL,
    "sessionState" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "tbchat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbchat_userId_key" ON "tbchat"("userId");
