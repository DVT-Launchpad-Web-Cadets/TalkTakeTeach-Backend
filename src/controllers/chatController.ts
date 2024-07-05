import { Elysia } from "elysia";
import { db } from '../dbConnect'
import { chatNewMessagePOSTRequest } from "../utils/chatBodyPayloads";
import { WebSocket } from "ws";
import {  IChatTable } from "../models/database";
import { appendFile } from "node:fs/promises";

const chatController = new Elysia().group(
  "chat",

  (app) =>
    app.onBeforeHandle(async ({request, body}) => {
      const accessFile = Bun.file('chat-access.log')
      if (await accessFile.exists() == false) {
        appendFile('chat-error.log', `Access to ${request.url} from ${request.headers.get("host")} not logged properly. Cannot find chat-access.log file.`)
      }
      const logObject = { HTTPRequest: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: body,
        timestamp: new Date().toISOString(),
      }};
      await appendFile('chat-access.log', JSON.stringify(logObject) + '\n').catch(() => {
        console.error('Error writing to access log file')
      })
      
    }).onAfterHandle(async ({set, response}) => {
      if (set.status === 200) {
      const logObject = { 
        responsePayload: response,
        responseStatus: set.status,
        
      }
      await appendFile('chat-access.log', JSON.stringify(logObject) + '\n').catch(() => {
        console.error('Error writing response to access log file')
      })
    }
      if (set.status !== 200) {
        const logObject = { 
          responsePayload: response ,
          responseStatus: set.status,
          
        }
        await appendFile('chat-error.log', JSON.stringify(logObject) + '\n').catch(() => {
          console.error('Error writing response to error log file')
        })
        
    }
      

    })
      .get(
        "/", 
        async ({ error, } ) => {
         
          return await db.selectFrom('tbchat').selectAll().execute().catch(() => {
            return error(500, "Internal Server Error - Database Error");
          });
        }, 
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
