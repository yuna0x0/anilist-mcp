import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";

export function registerMiscTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.favouriteStudio()
  server.tool(
    "favourite_studio",
    "[Requires Login] Favourite or unfavourite a studio by its ID",
    {
      id: z
        .number()
        .describe("The AniList ID of the studio to favourite/unfavourite"),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.favouriteStudio(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully added studio with ID ${id} to favourites.`
                : `Studio with ID ${id} was removed from favourites or operation failed.`,
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

  // anilist.genres()
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

  // anilist.mediaTags()
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

  // anilist.siteStatistics()
  server.tool(
    "get_site_statistics",
    "Get AniList site statistics over the last seven days",
    {},
    async () => {
      try {
        const statistics = await anilist.siteStatistics();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(statistics, null, 2),
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

  // anilist.studio()
  server.tool(
    "get_studio",
    "Get information about a studio by its AniList ID or name",
    {
      studio: z
        .union([z.string(), z.number()])
        .describe("The studio ID or name"),
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
}
