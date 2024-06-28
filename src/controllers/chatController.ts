import { Elysia, t } from "elysia";
import db from "../dbConnect";
import {
  chatDisconnectPATCHRequest,
  chatNewMessagePOSTRequest,
} from "../utils/chatBodyPayloads";
import { WebSocket } from "ws";

const chatController = new Elysia().group(
  "chat",

  (app) =>
    app
      .get(
        "/",
        async ({ error }) => {
          return await db.messageModel.findMany().catch(() => {
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
          const wss = new WebSocket("ws://localhost:3000/chat");
          
          body.userId = crypto.randomUUID();
          return await db.messageModel
            .create({
              data: body,
            })
            .then(() => {
              if (wss.OPEN) wss.send(JSON.stringify(body));
              else throw Error("Message failed to send");
            })
            .catch((er: Error) => {
              console.error(er);

              return error(500, `Internal Server Error ${er.message}`);
            })
            .finally(() => {
              wss.close();
            });
        },
        { body: chatNewMessagePOSTRequest.body }
      )
      .patch(
        "disconnect",
        async ({ body, error }) => {
          return await db.messageModel
            .update({
              where: { userId: body.user_id },
              data: { sessionState: "inactive" },
            })
            .catch(() => {
              return error(500, "Internal Server Error - Database Error");
            });
        },
        { body: chatDisconnectPATCHRequest.body }
      )
);

export default chatController;
