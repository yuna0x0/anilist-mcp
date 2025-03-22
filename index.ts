#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import AniList from "@yuna0x0/anilist-node";

// Import tool registrations
import { registerAllTools } from "./tools/index.js";

// Create an MCP server for AniList
const server = new McpServer({
  name: "anilist-mcp",
  version: "1.1.8",
});

// Initialize AniList client
// For authenticated requests, a token can be provided via environment variable
const anilist = new AniList(process.env.ANILIST_TOKEN);

// Register all tools
registerAllTools(server, anilist);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
