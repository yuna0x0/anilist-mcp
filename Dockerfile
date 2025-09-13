FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Copy source code
COPY index.ts ./
COPY utils/ ./utils/
COPY tools/ ./tools/

RUN addgroup -g 1001 -S anilist-mcp && \
    adduser -S anilist-mcp -u 1001 -G anilist-mcp

RUN corepack enable pnpm && corepack install

# Install all dependencies (including dev deps for TypeScript compilation)
RUN pnpm install --frozen-lockfile

# Build TypeScript code
RUN pnpm run build

FROM node:22-alpine AS release

LABEL org.opencontainers.image.title="AniList MCP"
LABEL org.opencontainers.image.description="AniList MCP server for accessing AniList API data"
LABEL org.opencontainers.image.version="1.3.2"

LABEL org.opencontainers.image.vendor="yuna0x0"
LABEL org.opencontainers.image.authors="yuna0x0 <yuna@yuna0x0.com>"
LABEL org.opencontainers.image.url="https://github.com/yuna0x0/anilist-mcp"
LABEL org.opencontainers.image.source="https://github.com/yuna0x0/anilist-mcp"
LABEL org.opencontainers.image.licenses="MIT"

LABEL io.modelcontextprotocol.server.name="io.github.yuna0x0/anilist-mcp"

RUN addgroup -g 1001 -S anilist-mcp && \
    adduser -S anilist-mcp -u 1001 -G anilist-mcp

WORKDIR /app

# Copy package files and built code
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist/ ./dist/

RUN chown -R anilist-mcp:anilist-mcp /app

ENV NODE_ENV=production
ENV TRANSPORT=http

RUN corepack enable pnpm && corepack install

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

USER anilist-mcp

# Expose port for HTTP transport
EXPOSE 8081

CMD ["node", "dist/index.js"]
