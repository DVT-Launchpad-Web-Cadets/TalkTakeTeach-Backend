import { t } from "elysia";

export const chatNewMessagePOSTRequest = {
    body: t.Object({
      userId: t.String({ maxLength: 36, minLength: 36 }),
      sessionState: t.String({pattern: "^(active|inactive)$", default: "active"}),
      messageText: t.String({
        maxLength: 120,
      }),
      timestampSent: t.Number(),
    }),
  }

export const chatDisconnectPATCHRequest = {
    body: t.Object({
      user_id: t.String({ maxLength: 36, minLength: 36 }),
    }),
  }