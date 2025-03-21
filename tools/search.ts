import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import AniList from "@yuna0x0/anilist-node";
import {
  ActivityFilterTypesSchema,
  MediaFilterTypesSchema,
} from "../utils/schemas.js";

export function registerSearchTools(server: McpServer, anilist: AniList) {
  // anilist.searchEntry.activity
  server.tool(
    "search_activity",
    "Search for activities on AniList",
    {
      activityID: z
        .number()
        .optional()
        .describe("The activity ID to lookup (leave empty for no specific ID)"),
      filter: ActivityFilterTypesSchema.optional().describe(
        "Filter object for searching activities (leave empty for no specific filter)",
      ),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      perPage: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ activityID, filter, page, perPage }) => {
      try {
        const results = await anilist.searchEntry.activity(
          activityID,
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

  // anilist.searchEntry.anime()
  server.tool(
    "search_anime",
    "Search for anime with query term and filters",
    {
      term: z.string().describe("Search term for finding anime"),
      filter: MediaFilterTypesSchema.optional().describe(
        "Filter object for searching anime (leave empty for no specific filter)",
      ),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, filter, page, amount }) => {
      try {
        const results = await anilist.searchEntry.anime(
          term,
          filter,
          page,
          amount,
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

  // anilist.searchEntry.character()
  server.tool(
    "search_character",
    "Search for characters based on a query term",
    {
      term: z.string().describe("Search term for finding characters"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, page, amount }) => {
      try {
        const results = await anilist.searchEntry.character(term, page, amount);
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

  // anilist.searchEntry.manga()
  server.tool(
    "search_manga",
    "Search for manga with query term and filters",
    {
      term: z.string().describe("Search term for finding manga"),
      filter: MediaFilterTypesSchema.optional().describe(
        "Filter object for searching manga (leave empty for no specific filter)",
      ),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, filter, page, amount }) => {
      try {
        const results = await anilist.searchEntry.manga(
          term,
          filter,
          page,
          amount,
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

  // anilist.searchEntry.staff()
  server.tool(
    "search_staff",
    "Search for staff members based on a query term",
    {
      term: z.string().describe("Search term for finding staff members"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, page, amount }) => {
      try {
        const results = await anilist.searchEntry.staff(term, page, amount);
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

  // anilist.searchEntry.studio
  server.tool(
    "search_studio",
    "Search for studios based on a query term",
    {
      term: z.string().describe("Search term for finding studios"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, page, amount }) => {
      try {
        const results = await anilist.searchEntry.studio(term, page, amount);
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

  // anilist.searchEntry.user
  server.tool(
    "search_user",
    "Search for users on AniList",
    {
      term: z.string().describe("Search term for finding users"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Page number for results"),
      amount: z
        .number()
        .optional()
        .default(5)
        .describe("Results per page (max 25)"),
    },
    async ({ term, page, amount }) => {
      try {
        const results = await anilist.searchEntry.user(term, page, amount);
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
}
