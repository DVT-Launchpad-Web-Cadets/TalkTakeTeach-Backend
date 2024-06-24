FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY prisma prisma
COPY .env .env
RUN apt-get update && apt-get install -y netcat
COPY bff-entrypoint.sh .
RUN chmod +x bff-entrypoint.sh

ENV NODE_ENV development

CMD ["bun", "src/index.ts"]

EXPOSE 3000

ENTRYPOINT ["./bff-entrypoint.sh"]