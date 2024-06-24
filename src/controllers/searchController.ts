import { Elysia, t } from "elysia";
import base64 from "base-64";

const searchController = new Elysia({ prefix: "/search" })
  .get(
    "/",
    async ({ query: { q } }) => {
      try {
        const payload = {
          query: {
            query_string: {
              query: q,
            },
          },
        };

        return fetch(`${process.env.ELASTIC_URL}/_search?pretty`, {
          method: "post",
          headers: {
            Authorization: `Basic ${base64.encode(
              `elastic:${process.env.ELASTIC_PASSWORD}`
            )}`,
            "Content-Type": "application/json",
          },
          tls: {
            rejectUnauthorized: false,
          },
          body: JSON.stringify(payload),
        })
          .then((resp) => resp.json())
          .then((res) => {
            const results = [];
            for (const hit of res.hits.hits) {
              results.push(hit._source);
            }
            return results;
          })
          .catch(() => {
            throw new Error("Internal Server Error");
          });
      } catch (err) {
        throw new Error("Internal Server Error");
      }
    },
    {
      query: t.Object({
        q: t.String(),
      }),
    }
  )
  .get("/search/products", () => {})
  .onError(({ code, error }) => {
    console.log(error);

    switch (code) {
      case "VALIDATION":
        return `Invalid query: ${
          error.validator.Errors(error.value).First().message
        }`;
      case "INTERNAL_SERVER_ERROR":
        return error.message;
      case "NOT_FOUND":
        return "Request not found";
    }
  });

export default searchController;
