import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";
import { filterMedia, type FilteredMediaEntry } from "../utils/mediaFilter.js";

export function registerMediaTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.media.anime()
  server.tool(
    "get_anime",
    "Get detailed information about anime by AniList ID(s)",
    {
      ids: z
        .union([z.number(), z.array(z.number())])
        .describe("The AniList ID or array of IDs of the anime"),
      fullData: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          "Set to true to get full unfiltered data (may be very large). Default is false to return only essential fields.",
        ),
    },
    {
      title: "Get Anime Details",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ ids, fullData }) => {
      try {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const results = await Promise.all(
          idArray.map((id) => anilist.media.anime(id)),
        );

        // Filter results unless fullData is explicitly requested
        const filteredResults = fullData ? results : filterMedia(results);

        // Return single object if single ID was provided, array if multiple
        const res = Array.isArray(ids)
          ? filteredResults
          : (filteredResults as FilteredMediaEntry[])[0];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(res, null, 2),
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
    {
      title: "Favourite/Unfavourite Anime",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
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
    {
      title: "Favourite/Unfavourite Manga",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
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
    "Get detailed information about manga by AniList ID(s)",
    {
      ids: z
        .union([z.number(), z.array(z.number())])
        .describe("The AniList ID or array of IDs of the manga"),
      fullData: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          "Set to true to get full unfiltered data (may be very large). Default is false to return only essential fields.",
        ),
    },
    {
      title: "Get Manga Details",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ ids, fullData }) => {
      try {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const results = await Promise.all(
          idArray.map((id) => anilist.media.manga(id)),
        );

        // Filter results unless fullData is explicitly requested
        const filteredResults = fullData ? results : filterMedia(results);

        // Return single object if single ID was provided, array if multiple
        const res = Array.isArray(ids)
          ? filteredResults
          : (filteredResults as FilteredMediaEntry[])[0];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(res, null, 2),
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
