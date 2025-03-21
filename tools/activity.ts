import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import AniList from "@yuna0x0/anilist-node";
import { requireAuth } from "../utils/auth.js";

export function registerActivityTools(server: McpServer, anilist: AniList) {
  // anilist.activity.delete()
  server.tool(
    "delete_activity",
    "[Requires Login] Delete the current authorized user's activity post",
    {
      id: z.number().describe("The AniList activity ID to delete"),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth();
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.activity.delete(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully deleted activity with ID ${id}.`
                : `Failed to delete activity with ID ${id}.`,
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

  // anilist.activity.get()
  server.tool(
    "get_activity",
    "Get a specific AniList activity by its ID",
    {
      activityID: z.number().describe("The AniList activity ID"),
    },
    async ({ activityID }) => {
      try {
        const activity = await anilist.activity.get(activityID);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(activity, null, 2),
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

  // anilist.activity.getUserActivity()
  server.tool(
    "get_user_activity",
    "Fetch activities from a user",
    {
      user: z.number().describe("The user's AniList ID"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("The page number to display"),
      perPage: z
        .number()
        .optional()
        .default(25)
        .describe("How many entries to display on one page (max 25)"),
    },
    async ({ user, page, perPage }) => {
      try {
        const activities = await anilist.activity.getUserActivity(
          user,
          page,
          perPage,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(activities, null, 2),
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

  // anilist.activity.postMessage()
  server.tool(
    "post_message_activity",
    "[Requires Login] Post a new message activity or update an existing one",
    {
      text: z.string().describe("The activity message text"),
      recipientId: z
        .number()
        .describe("The target user to send the message to"),
      isPrivate: z
        .boolean()
        .optional()
        .default(false)
        .describe("Set to true if it is a private message"),
      id: z
        .number()
        .nullable()
        .describe("AniList Activity ID (null to create new, number to update)"),
    },
    async ({ text, recipientId, isPrivate, id }) => {
      try {
        const auth = requireAuth();
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.activity.postMessage(
          text,
          recipientId,
          isPrivate,
          id,
        );
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

  // anilist.activity.postText()
  server.tool(
    "post_text_activity",
    "[Requires Login] Post a new text activity or update an existing one",
    {
      text: z.string().describe("The content of the activity"),
      id: z
        .number()
        .nullable()
        .describe("AniList Activity ID (null to create new, number to update)"),
    },
    async ({ text, id }) => {
      try {
        const auth = requireAuth();
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.activity.postText(text, id);
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
