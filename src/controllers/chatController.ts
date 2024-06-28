// import { PrismaClient } from '@prisma/client'
import { Elysia, t } from "elysia";
import db from "../dbConnect";
import {
  chatDisconnectPATCHRequest,
  chatNewMessagePOSTRequest,
} from "../utils/chatBodyPayloads";

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
          body.userId = crypto.randomUUID();
          return await db.messageModel
            .create({
              data: body,
            })
            .catch((er: Error) => {
              console.error(er);

              return error(500, `Internal Server Error ${er.message}`);
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
