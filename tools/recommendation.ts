import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type AniList from "@yuna0x0/anilist-node";
import type { ConfigSchema } from "../utils/schemas.js";

export function registerRecommendationTools(
  server: McpServer,
  anilist: AniList,
) {
  // anilist.recommendation.get()
  server.tool(
    "get_recommendation",
    "Get an AniList recommendation by its ID",
    {
      recommendID: z.number().describe("The AniList recommendation ID"),
    },
    {
      title: "Get AniList Recommendation by ID",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ recommendID }) => {
      try {
        const recommendation = await anilist.recommendation.get(recommendID);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(recommendation, null, 2),
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

  // anilist.recommendation.getList()
  server.tool(
    "get_recommendations_for_media",
    "Get AniList recommendations for a specific media",
    {
      mediaID: z.number().describe("The AniList media ID"),
      page: z
        .number()
        .optional()
        .default(1)
        .describe("Target a specific page number for recommendations"),
      perPage: z
        .number()
        .optional()
        .default(25)
        .describe("Limit the page amount (max 25 per AniList limits)"),
    },
    {
      title: "Get AniList Recommendations for Media",
      readOnlyHint: true,
      openWorldHint: true,
    },
    async ({ mediaID, page, perPage }) => {
      try {
        const recommendationList = await anilist.recommendation.getList(
          mediaID,
          page,
          perPage,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(recommendationList, null, 2),
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
