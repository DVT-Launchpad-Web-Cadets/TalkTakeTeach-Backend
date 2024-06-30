import { Elysia } from "elysia";
import chatController from "./controllers/chatController";
import searchController from "./controllers/searchController";
import { cors } from "@elysiajs/cors";

export interface IUser {
  username: string;
}

export interface IMessage {
  text: string;
  username: string | undefined;
  timestamp: number;
}

const messages: IMessage[] = [];
let users: String[] = [];
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
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
  .get("/", () => "Hello Elysia")
  .ws("/chat", {
    transform() {},
    open(ws) {
      const username = `user_${ws.id}`; //TODO: replace with db user logic - once I understand it
      const joinedNotification: IMessage = {
        text: `${username} has joined the chat`,
        username: undefined,
        timestamp: Date.now(),
      };
      messages.push(joinedNotification);

      ws.subscribe("chat");

      // Send message to the newly connected client containing existing users and messages
      // TODO: replace with db logic - once I understand it
    },
    message(ws, data) {
      const message = data as IMessage;

      message.username = `user_${ws.id}`;
      message.timestamp = Date.now();
      messages.push(message);

      app.server?.publish(
        "chat",
        JSON.stringify({ type: "MESSAGES_ADD", data: message })
      );
    },
    close(ws) {
      const username = `user_${ws.id}`;
      users = users.filter((user) => user !== username);

      const leftNotification: IMessage = {
        text: `${username} has left the chat`,
        username: undefined,
        timestamp: Date.now(),
      };
      messages.push(leftNotification);

      // Send message to all clients STILL subscribed to the chat channel that user left (use ws.publish instead of server.publish)
      app.server?.publish(
        "chat",
        JSON.stringify({ type: "USERS_REMOVE", data: username })
      );
      app.server?.publish(
        "chat",
        JSON.stringify({ type: "MESSAGES_ADD", data: leftNotification })
      );
    },
  })
  .listen(process.env["PORT"] ?? 3000);
  .listen(process.env["PORT"] || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
