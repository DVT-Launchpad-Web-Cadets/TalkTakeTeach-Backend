import { Elysia, t } from "elysia";
import base64 from "base-64";
import { Product, Result } from "./models/searchResult";
import { Percolation } from "./models/percolation";

const searchController = new Elysia({ prefix: "/search" })
  .get(
    "",
    async ({ query: { q } }) => {
      try {
        if (q.length) {
          const payload = {
            suggest: {
              "product-suggest-fuzzy": {
                prefix: q,
                completion: {
                  field: "name",
                  fuzzy: {
                    fuzziness: 1,
                  },
                },
              },
            },
          };

          return fetch(
            `${
              process.env.ELASTIC_URL ?? "https://localhost:9200"
            }/_search?pretty`,
            {
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
            }
          )
            .then((resp) => resp.json())
            .then((res: Result) => {
              const results: Product[] = [];
              for (const option of res?.suggest?.["product-suggest-fuzzy"]?.[0]
                .options) {
                const product = {
                  ...option?._source,
                  name: option?._source?.name?.input[0],
                };
                results.push(product);
              }
              fetch(`${process.env.ELASTIC_URL}/percolator/_doc`);
              return results;
            })
            .catch((err) => {
              console.error(err);

              throw new Error("Internal Server Error");
            });
        } else {
          const payload = {
            size: 10,
            query: {
              match_all: {},
            },
          };
          return fetch(
            `${process.env.ELASTIC_URL ?? "https://localhost:9200"}/_search`,
            {
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
            }
          )
            .then((resp) => resp.json())
            .then((res: Percolation) => {
              const results: Product[] = [];
              for (const hit of res?.hits?.hits) {
                const product = {
                  ...hit._source,
                  name: hit?._source?.name?.input[0],
                };
                results.push(product);
              }
              fetch(`${process.env.ELASTIC_URL}/percolator/_doc`);
              return results;
            })
            .catch((err) => {
              throw new Error("Internal Server Error: " + err.message);
            });
        }
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
  .onError(({ code, error }) => {
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
