import { Elysia } from "elysia";
import chatController from "./controllers/chatController";
import searchController from "./controllers/searchController";

const app = new Elysia()
  .use(chatController)
  .use(searchController)
  .get("/", () => "Hello Elysia")
  .listen(process.env["PORT"] || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
