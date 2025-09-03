import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";
import { requireAuth } from "../utils/auth.js";
import { UserOptionsInputSchema } from "../utils/schemas.js";

export function registerUserTools(
  server: McpServer,
  anilist: AniList,
  config: z.infer<typeof ConfigSchema>,
) {
  // anilist.user.all()
  server.tool(
    "get_full_user_info",
    "Get a user's complete profile and stats information",
    {
      user: z.union([z.number(), z.string()]).describe("Username or user ID"),
    },
    async ({ user }) => {
      try {
        const userInfo = await anilist.user.all(user);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(userInfo, null, 2),
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

  // anilist.user.follow()
  server.tool(
    "follow_user",
    "[Requires Login] Follow or unfollow a user by their ID",
    {
      userID: z
        .number()
        .describe("The user ID of the account to follow/unfollow"),
    },
    async ({ userID }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.user.follow(userID);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully followed user with ID ${userID}.`
                : `User with ID ${userID} was unfollowed or operation failed.`,
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

  // anilist.user.getAuthorized()
  server.tool(
    "get_authorized_user",
    "[Requires Login] Get profile information of the currently authorized user",
    {},
    async () => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const profile = await anilist.user.getAuthorized();
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

  // anilist.user.getRecentActivity()
  server.tool(
    "get_user_recent_activity",
    "Get recent activity from a user",
    {
      user: z
        .number()
        .describe(
          "The user's AniList ID (Number ID only, DO NOT use username, any kind of string or other types except for numbers.)",
        ),
    },
    async ({ user }) => {
      try {
        const activities = await anilist.user.getRecentActivity(user);
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

  // anilist.user.profile()
  server.tool(
    "get_user_profile",
    "Get a user's AniList profile",
    {
      user: z.union([z.number(), z.string()]).describe("Username or user ID"),
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

  // anilist.user.stats()
  server.tool(
    "get_user_stats",
    "Get a user's AniList statistics",
    {
      user: z.union([z.number(), z.string()]).describe("Username or user ID"),
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

  // anilist.user.update()
  server.tool(
    "update_user",
    "[Requires Login] Update user settings",
    {
      options: UserOptionsInputSchema.describe("User options to update"),
    },
    async ({ options }) => {
      try {
        const auth = requireAuth(config.anilistToken);
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const updatedOptions = await anilist.user.update(options);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(updatedOptions, null, 2),
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
