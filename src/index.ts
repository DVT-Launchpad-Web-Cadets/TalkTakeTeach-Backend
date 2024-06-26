import { Elysia } from "elysia";
import chatController from "./controllers/chatController";
import searchController from "./controllers/searchController";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "TTT-BFF",
          version: "1.0.0",
        },
      },
    })
  )
  .use(chatController)
  .use(searchController)
  .listen(process.env["PORT"] || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
