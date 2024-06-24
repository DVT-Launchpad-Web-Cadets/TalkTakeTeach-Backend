// import { PrismaClient } from '@prisma/client'
import { Elysia, t } from "elysia";
import db from "../dbConnect";
import { chatDisconnectPATCHRequest, chatNewMessagePOSTRequest } from "../utils/chatBodyPayloads";

const chatController = new Elysia().group(
  "chat",

  (app) =>
    app
      .get(
        "/",
        async ({ error, query }) => {
            if (query.alias_exists !== undefined && query.alias_exists !== ""){
                return db.messageModel.findMany({
                    where: {
                    AND: [{user_alias: {equals : query.alias_exists}},
                        {session_state: {equals : "active"}}]
                        
                    }
                }).then((results) => {
                    if (results.length === 0){
                        return {user_alias: query.alias_exists, exists : false}
                    }
                    console.log(results)
                    return error(409, {user_alias: query.alias_exists, exists : true} )
                }).catch(() => {
                    return error(500, "Internal Server Error - Database Error");
                })
            }
          return await db.messageModel.findMany().catch(() => {
            return error(500, "Internal Server Error - Database Error");
          })}, {
            query: t.Object({
                alias_exists: t.Optional(t.String())
            })}
      )
      .post(
        "/",
        async ({ body, error, headers }) => {
            body.user_id = crypto.randomUUID();
            if (body.user_alias === undefined || body.user_alias === ""){
              body.user_alias = "Anonymous";
            }
          return await db.messageModel
            .create({
              data: body
            })
            .catch((er: Error) => {
                const isTriggerErrorId = er.toString().includes(`Duplicate user_id detected: ${body.user_id}`);
                const isTriggerErrorAlias = er.toString().includes(`${body.user_alias} is already taken. Please choose another alias.`);

                if (isTriggerErrorId) {
                    console.log('error id')
                  return error(
                    409,
                    {message: `Duplicate user_id detected: ${body.user_id}`,
                    user_id: body.user_id,
                    error_on: "user_id"}
                  );
                }
                if (isTriggerErrorAlias) {
                    console.log('error alias')
                    console.log(er)
                    console.log(headers)
                  return error(
                    409,
                    {message: `${body.user_alias} is already taken. Please choose another alias.`,
                    user_alias: body.user_alias,
                    error_on: "user_alias"}
                  );
                }
              return error(500, "Internal Server Error - Database Error");
            })}, {body: chatNewMessagePOSTRequest.body}
        
      ).patch('disconnect', async ({ body, error  }) => {
        return await db.messageModel.update({
          where: { user_id: body.user_id },
          data: { session_state: "inactive" }
        }).catch(() => {
          return error(500, "Internal Server Error - Database Error");
        })
      }, {body: chatDisconnectPATCHRequest.body},
    )
      
);

export default chatController;
