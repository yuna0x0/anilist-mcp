FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY index.ts ./
COPY utils/ ./utils
COPY tools/ ./tools

RUN corepack enable pnpm && corepack install

RUN pnpm install --frozen-lockfile


FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist/ ./dist

ENV NODE_ENV=production

RUN corepack enable pnpm && corepack install

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

ENTRYPOINT ["node", "/app/dist/index.js"]
