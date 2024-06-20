import { Elysia } from "elysia";

const searchController = new Elysia({ prefix: "/search" }).get(
  "/",
  () => {
    return "Hello search";
  }
);

export default searchController
