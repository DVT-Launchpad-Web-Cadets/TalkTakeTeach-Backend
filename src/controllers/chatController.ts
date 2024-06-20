// import { PrismaClient } from '@prisma/client'
import { Elysia, t } from "elysia";
import db from "../dbConnect";

const chatController = new Elysia().group(
  "chat",

  (app) =>
    app
      .get(
        "/",
        async ({ error }) =>
          await db.messageModel.findMany().catch(() => {
            return error(500, "Internal Server Error - Database Error");
          })
      )
      .post(
        "/",
        async ({ body, error }) =>
          db.messageModel
            .create({
              data: body,
            })
            .catch((er: Error) => {
              if (
                er
                  .toString()
                  .includes(`Duplicate message_id detected: ${body.message_id}`)
              ) {
                return error(
                  409,
                  `Duplicate message_id detected: ${body.message_id}`
                );
              }
              return error(500, "Internal Server Error - Database Error");
            }),
        {
          body: t.Object({
            message_id: t.String({ maxLength: 36, minLength: 36 }),
            message_text: t.String({
              maxLength: 120,
            }),
            timestamp_sent: t.Date(),
          }),
        }
      )
);

export default chatController;
