import { Elysia } from "elysia";

export const searchController = new Elysia({ prefix: "/search" }).get(
  "/",
  () => {
    return "Hello search";
  }
);
