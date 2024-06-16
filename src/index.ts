import { PrismaClient } from "@prisma/client";
import { Elysia, t } from "elysia";
import chatController from "./controllers/chat-controller";

const db = new PrismaClient();

const app = new Elysia().use(chatController).get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
