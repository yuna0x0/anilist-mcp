import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";
import { UpdateEntryOptionsSchema } from "../utils/schemas.js";

export function registerListsTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.lists.addEntry()
  server.tool(
    "add_list_entry",
    "[Requires Login] Add an entry to the authorized user's list",
    {
      id: z.number().describe("The AniList ID of the media entry to add"),
      options: UpdateEntryOptionsSchema,
    },
    {
      title: "Add List Entry",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ id, options }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.lists.addEntry(id, options);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
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

  // anilist.lists.anime()
  server.tool(
    "get_user_anime_list",
    "Get a user's anime list",
    {
      user: z.union([z.number(), z.string()]).describe("Username or user ID"),
    },
    {
      title: "Get User Anime List",
      readOnlyHint: true,
      openWorldHint: true,
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

  // anilist.lists.manga()
  server.tool(
    "get_user_manga_list",
    "Get a user's manga list",
    {
      user: z.union([z.number(), z.string()]).describe("Username or user ID"),
    },
    {
      title: "Get User Manga List",
      readOnlyHint: true,
      openWorldHint: true,
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

  // anilist.lists.removeEntry()
  server.tool(
    "remove_list_entry",
    "[Requires Login] Remove an entry from the authorized user's list",
    {
      id: z.number().describe("The AniList list ID of the entry to remove"),
    },
    {
      title: "Remove List Entry",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ id }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.lists.removeEntry(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully removed list entry with ID ${id}.`
                : `Failed to remove list entry with ID ${id}.`,
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

  // anilist.lists.updateEntry()
  server.tool(
    "update_list_entry",
    "[Requires Login] Update an entry on the authorized user's list",
    {
      id: z.number().describe("The AniList list ID of the entry to edit"),
      options: UpdateEntryOptionsSchema,
    },
    {
      title: "Update List Entry",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ id, options }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.lists.updateEntry(id, options);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
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
