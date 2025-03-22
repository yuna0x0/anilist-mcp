import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import {
  ActivityFilterTypesSchema,
  MediaFilterTypesSchema,
} from "../utils/schemas.js";

export function registerSearchTools(server: McpServer, anilist: AniList) {
  // anilist.searchEntry.activity()
  server.tool(
    "search_activity",
    "Search for activities on AniList",
    {
      activityID: z
        .number()
        .optional()
        .describe(
          "The activity ID to lookup (leave it as undefined for no specific ID)",
        ),
      filter: ActivityFilterTypesSchema.optional().describe(
        "Filter object for searching activities (leave it as undefined for no specific filter)",
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
      term: z
        .string()
        .optional()
        .describe(
          `Query term for finding anime (leave it as undefined when no query term specified.)
Query term is used for searching with specific word or title in mind.

You SHOULD not include things that can be found in the filter object, such as genre or tag.
Those things should be included in the filter object instead.

To check whether a user requested term should be considered as a query term or a filter term.
It is recommended to use tools like 'get_genres' and 'get_media_tags' first.`,
        ),
      filter: MediaFilterTypesSchema.optional().describe(
        `Filter object for searching anime.
You MUST NOT include "{ "type": "ANIME" }" in the filter object. As it is already included in the API call.
When no sorting method or any filter is specified, you SHOULD use the site default: "{ "sort": "SCORE_DESC" }".
Otherwise, request is likely to fail or return no results.`,
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
      term: z
        .string()
        .optional()
        .describe(
          `Query term for finding manga (leave it as undefined when no query term specified.)
Query term is used for searching with specific word or title in mind.

You SHOULD not include things that can be found in the filter object, such as genre or tag.
Those things should be included in the filter object instead.

To check whether a user requested term should be considered as a query term or a filter term.
It is recommended to use tools like 'get_genres' and 'get_media_tags' first.`,
        ),
      filter: MediaFilterTypesSchema.optional().describe(
        `Filter object for searching manga.
You MUST NOT include "{ "type": "MANGA" }" in the filter object. As it is already included in the API call.
When no sorting method or any filter is specified, you SHOULD use the site default: "{ "sort": "SCORE_DESC" }".
Otherwise, request is likely to fail or return no results.`,
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

  // anilist.searchEntry.studio()
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
