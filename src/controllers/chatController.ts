import { Elysia, t } from "elysia";
import { db } from '../dbConnect'
import { ChatUpdate, Chat, NewChat } from '../models/database'
import { chatNewMessagePOSTRequest } from "../utils/chatBodyPayloads";
import { WebSocket } from "ws";

const chatController = new Elysia().group(
  "chat",

  (app) =>
    app
      .get(
        "/",
        async ({ error }) => {
          return await db.selectFrom('tbchat').execute().catch(() => {
            return error(500, "Internal Server Error - Database Error");
          });
        },
        {
          query: t.Object({
            alias_exists: t.Optional(t.String()),
          }),
        }
      )
      .post(
        "/",
        async ({ body, error }) => {
          const wss = new WebSocket(
            `${process.env.WEBSOCKET_URL ?? "ws://localhost:3000/chat"}`
          );

          return await db.insertInto('tbchat').values(body).returningAll().execute()
            .then(() => {
              if (wss.OPEN) wss.send(JSON.stringify(body));
              else throw Error("Message failed to send");
            })
            .catch((er: Error) => {
              return error(500, `Internal Server Error ${er.message}`);
            })
            .finally(() => {
              wss.close();
            });
        },
        { body: chatNewMessagePOSTRequest.body }
      )
);

export default chatController;
