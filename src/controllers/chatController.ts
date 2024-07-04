import { Elysia } from "elysia";
import { db } from '../dbConnect'
import { chatNewMessagePOSTRequest } from "../utils/chatBodyPayloads";
import { WebSocket } from "ws";
import {  IChatTable } from "../models/database";
import { fileLogger,  } from "@bogeychan/elysia-logger";

const chatController = new Elysia().use(fileLogger({file: "./backend.log"})).group(
  "chat",

  (app) =>
    app
      .get(
        "/", 
        async ({ error} ) => {
         
          return await db.selectFrom('tbchat').selectAll().execute().catch(() => {
            return error(500, "Internal Server Error - Database Error");
          });
        }
      )
      .post(
        "/",
        async ({ body, error }) => {
          const wss = new WebSocket(
            `${process.env.WEBSOCKET_URL ?? "ws://localhost:3000/chat"}`
          );

          return await db.insertInto('tbchat').values(body).returningAll().execute()
            .then((result :IChatTable[]) => {

              if (wss.OPEN) {
                wss.send(JSON.stringify(body));
                return result
              }

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
