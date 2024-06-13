import { Elysia } from "elysia";
import { searchController } from "./controllers/searchController";
import { chatController } from "./controllers/chatController";

const app = new Elysia();

app.use(searchController);
app.use(chatController);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
