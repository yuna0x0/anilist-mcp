import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";

export function registerThreadTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.thread.delete()
  server.tool(
    "delete_thread",
    "[Requires Login] Delete a thread by its ID",
    {
      id: z.number().describe("The AniList thread ID to delete"),
    },
    {
      title: "Delete AniList Thread",
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

        const result = await anilist.thread.delete(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully deleted thread with ID ${id}.`
                : `Failed to delete thread with ID ${id}.`,
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

  // anilist.thread.get()
  server.tool(
    "get_thread",
    "Get a specific thread by its AniList ID",
    {
      id: z.number().describe("The AniList ID of the thread"),
    },
    {
      title: "Get AniList Thread",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ id }) => {
      try {
        const thread = await anilist.thread.get(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(thread, null, 2),
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

  // anilist.thread.getComments()
  server.tool(
    "get_thread_comments",
    "Get comments for a specific thread",
    {
      id: z.number().describe("The AniList thread ID"),
      page: z.number().optional().default(1).describe("The page number"),
      perPage: z
        .number()
        .optional()
        .default(25)
        .describe("How many comments per page"),
    },
    {
      title: "Get AniList Thread Comments",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ id, page = 1, perPage = 25 }) => {
      try {
        const comments = await anilist.thread.getComments(id, page, perPage);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(comments, null, 2),
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
