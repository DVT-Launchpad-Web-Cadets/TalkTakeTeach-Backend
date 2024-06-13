import { Elysia } from "elysia";

export const chatController = new Elysia({ prefix: "/chat" }).get("/", () => {
  return "Hello chat";
});
