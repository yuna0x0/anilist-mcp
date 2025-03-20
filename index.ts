#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { union, z } from "zod";
import AniList from "@yuna0x0/anilist-node";

// Create an MCP server for AniList
const server = new McpServer({
  name: "anilist-mcp",
  version: "1.0.1",
});

// Initialize AniList client
// For authenticated requests, a token can be provided via environment variable
const anilist = new AniList(process.env.ANILIST_TOKEN);

// ANIME TOOLS

server.tool(
  "get_anime",
  "Get detailed information about an anime by its AniList ID",
  {
    id: z.number().describe("The AniList ID of the anime"),
  },
  async ({ id }) => {
    try {
      const anime = await anilist.media.anime(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(anime, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "search_anime",
  "Search for anime based on a query term",
  {
    term: z.string().describe("Search term for finding anime"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.anime(
        term,
        undefined,
        page,
        perPage,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "anime_filter",
  "Search for anime with advanced filters",
  {
    term: z.string().optional().describe("Optional search term"),
    filter: z.record(z.any()).describe("Filter object for searching anime"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, filter, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.anime(
        term,
        filter,
        page,
        perPage,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// MANGA TOOLS

server.tool(
  "get_manga",
  "Get detailed information about a manga by its AniList ID",
  {
    id: z.number().describe("The AniList ID of the manga"),
  },
  async ({ id }) => {
    try {
      const manga = await anilist.media.manga(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(manga, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "search_manga",
  "Search for manga based on a query term",
  {
    term: z.string().describe("Search term for finding manga"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.manga(
        term,
        undefined,
        page,
        perPage,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "manga_filter",
  "Search for manga with advanced filters",
  {
    term: z.string().optional().describe("Optional search term"),
    filter: z.record(z.any()).describe("Filter object for searching manga"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, filter, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.manga(
        term,
        filter,
        page,
        perPage,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// CHARACTER & STAFF TOOLS

server.tool(
  "get_character",
  "Get information about a character by their AniList ID",
  {
    id: z.number().describe("The AniList ID of the character"),
  },
  async ({ id }) => {
    try {
      const character = await anilist.people.character(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(character, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "search_character",
  "Search for characters based on a query term",
  {
    term: z.string().describe("Search term for finding characters"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.character(term, page, perPage);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_staff",
  "Get information about staff member by their AniList ID",
  {
    id: z.number().describe("The AniList ID of the staff member"),
  },
  async ({ id }) => {
    try {
      const staff = await anilist.people.staff(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(staff, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "search_staff",
  "Search for staff members based on a query term",
  {
    term: z.string().describe("Search term for finding staff members"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.staff(term, page, perPage);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// USER TOOLS

server.tool(
  "get_user_profile",
  "Get a user's AniList profile",
  {
    user: z.string().describe("Username or user ID"),
  },
  async ({ user }) => {
    try {
      const profile = await anilist.user.profile(user);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(profile, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_user_stats",
  "Get a user's AniList statistics",
  {
    user: z.string().describe("Username or user ID"),
  },
  async ({ user }) => {
    try {
      const stats = await anilist.user.stats(user);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_user_anime_list",
  "Get a user's anime list",
  {
    user: z.string().describe("Username or user ID"),
  },
  async ({ user }) => {
    try {
      const list = await anilist.lists.anime(user);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_user_manga_list",
  "Get a user's manga list",
  {
    user: z.string().describe("Username or user ID"),
  },
  async ({ user }) => {
    try {
      const list = await anilist.lists.manga(user);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// STUDIO TOOLS

server.tool(
  "get_studio",
  "Get information about a studio by its AniList ID or name",
  {
    studio: z.union([z.string(), z.number()]).describe("The studio ID or name"),
  },
  async ({ studio }) => {
    try {
      const studioInfo = await anilist.studio(studio);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(studioInfo, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "search_studio",
  "Search for studios based on a query term",
  {
    term: z.string().describe("Search term for finding studios"),
    page: z.number().optional().describe("Page number for results"),
    perPage: z.number().optional().describe("Results per page (max 25)"),
  },
  async ({ term, page = 1, perPage = 10 }) => {
    try {
      const results = await anilist.searchEntry.studio(term, page, perPage);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// GENRE & TAG TOOLS

server.tool(
  "get_genres",
  "Get all available genres on AniList",
  {},
  async () => {
    try {
      const genres = await anilist.genres();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(genres, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_media_tags",
  "Get all available media tags on AniList",
  {},
  async () => {
    try {
      const tags = await anilist.mediaTags();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tags, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
