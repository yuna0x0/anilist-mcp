FROM imbios/bun-node:1-22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./
COPY index.ts ./
COPY utils/ ./utils
COPY tools/ ./tools

RUN bun install --frozen-lockfile

FROM imbios/bun-node:1-22-alpine AS release

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/dist/ ./dist

ENV NODE_ENV=production

RUN bun install --frozen-lockfile --production --ignore-scripts

ENTRYPOINT ["node", "/app/dist/index.js"]
