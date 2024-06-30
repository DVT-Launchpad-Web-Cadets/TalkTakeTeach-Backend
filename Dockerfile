FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY prisma .

RUN bun install --production

RUN bunx prisma generate 
RUN npx prisma migrate dev 

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000