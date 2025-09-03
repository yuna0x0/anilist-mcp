import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";

export function registerMediaTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.media.anime()
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

  // anilist.media.favouriteAnime()
  server.tool(
    "favourite_anime",
    "[Requires Login] Favourite or unfavourite an anime by its ID",
    {
      id: z
        .number()
        .describe("The AniList ID of the anime to favourite/unfavourite"),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.media.favouriteAnime(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully added anime with ID ${id} to favourites.`
                : `Anime with ID ${id} was removed from favourites or operation failed.`,
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

  // anilist.media.favouriteManga()
  server.tool(
    "favourite_manga",
    "[Requires Login] Favourite or unfavourite a manga by its ID",
    {
      id: z
        .number()
        .describe("The AniList ID of the manga to favourite/unfavourite"),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.media.favouriteManga(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully added manga with ID ${id} to favourites.`
                : `Manga with ID ${id} was removed from favourites or operation failed.`,
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

  // anilist.media.manga()
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
}
