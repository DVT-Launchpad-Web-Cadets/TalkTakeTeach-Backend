import { t } from "elysia";

export const chatNewMessagePOSTRequest = {
    body: t.Object({
      user_id: t.String({ maxLength: 36, minLength: 36 }),
      user_alias: t.String({ maxLength: 20, default: "Anonymous"}),
      session_state: t.String({pattern: "^(active|inactive)$", default: "active"}),
      message_text: t.String({
        maxLength: 120,
      }),
      timestamp_sent: t.Date(),
    }),
  }

export const chatDisconnectPATCHRequest = {
    body: t.Object({
      user_id: t.String({ maxLength: 36, minLength: 36 }),
    }),
  }