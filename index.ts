#!/usr/bin/env node

import express, { Request, Response } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import AniList from "@yuna0x0/anilist-node";
import dotenv from "dotenv";
import { z } from "zod";
import { registerAllTools } from "./tools/index.js";
import { ConfigSchema } from "./utils/schemas.js";
import { ANILIST_TOKEN_HEADER } from "./utils/constants.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 8081;

// CORS configuration for browser-based MCP clients
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    exposedHeaders: ["Mcp-Session-Id", ANILIST_TOKEN_HEADER],
    allowedHeaders: ["Content-Type", "mcp-session-id", ANILIST_TOKEN_HEADER],
  }),
);

app.use(express.json());

// Parse configuration from header or query parameters (for Smithery)
function parseConfig(req: Request) {
  const anilistTokenHeader = req.headers[ANILIST_TOKEN_HEADER.toLowerCase()];
  if (
    typeof anilistTokenHeader === "string" &&
    anilistTokenHeader.trim().length > 0
  ) {
    return { anilistToken: anilistTokenHeader };
  }

  // Smithery passes config as base64-encoded JSON in query parameters
  const configParam = req.query.config;
  if (typeof configParam === "string" && configParam.trim().length > 0) {
    return JSON.parse(Buffer.from(configParam, "base64").toString());
  }

  return {};
}

// Create MCP server with AniList integration
function createServer({ config }: { config: z.infer<typeof ConfigSchema> }) {
  const server = new McpServer({
    name: "anilist-mcp",
    version: "1.4.0",
  });

  // Initialize AniList client with token from config or environment
  const anilist = new AniList(config.anilistToken);

  // Register all tools
  registerAllTools(server, anilist, config);

  return server;
}

// Handle MCP requests at /mcp endpoint
app.post("/mcp", async (req: Request, res: Response) => {
  try {
    // Parse configuration
    const rawConfig = parseConfig(req);

    // Validate and parse configuration
    const config = ConfigSchema.parse({
      anilistToken: rawConfig.anilistToken || process.env.ANILIST_TOKEN,
    });

    const server = createServer({ config });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    // Clean up on request close
    res.on("close", () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

// SSE notifications not supported in stateless mode
app.get("/mcp", async (req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
  );
});

// Session termination not needed in stateless mode
app.delete("/mcp", async (req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
  );
});

// Main function to start the server in the appropriate mode
async function main() {
  const transport = process.env.TRANSPORT || "stdio";

  if (transport === "http") {
    // Run in HTTP mode
    app.listen(PORT, () => {
      console.log(`MCP HTTP Server listening on port ${PORT}`);
    });
  } else {
    if (transport !== "stdio") {
      console.warn(
        `Unknown TRANSPORT "${transport}", defaulting to "stdio" mode.`,
      );
    }

    // Run in STDIO mode for backward compatibility
    const config = ConfigSchema.parse({
      anilistToken: process.env.ANILIST_TOKEN,
    });

    // Create server with configuration
    const server = createServer({ config });

    // Start receiving messages on stdin and sending messages on stdout
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error("MCP Server running in stdio mode");
  }
}

// Start the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
