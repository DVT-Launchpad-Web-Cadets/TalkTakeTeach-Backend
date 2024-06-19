-- CreateTable
CREATE TABLE "tbchat" (
    "id" SERIAL NOT NULL,
    "message_text" VARCHAR(120) NOT NULL,
    "message_id" CHAR(36) NOT NULL,
    "timestamp_sent" TIMESTAMP NOT NULL,

    CONSTRAINT "tbchat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbchat_message_id_key" ON "tbchat"("message_id");
