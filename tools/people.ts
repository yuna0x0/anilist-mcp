import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import AniList from "@yuna0x0/anilist-node";
import { requireAuth } from "../utils/auth.js";

export function registerPeopleTools(server: McpServer, anilist: AniList) {
  // anilist.people.character()
  server.tool(
    "get_character",
    "Get information about a character by their AniList ID",
    {
      id: z
        .union([z.number(), z.string()])
        .describe("The AniList ID of the character"),
    },
    async ({ id }) => {
      try {
        const character = await anilist.people.character(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(character, null, 2),
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

  // anilist.people.favouriteChar()
  server.tool(
    "favourite_character",
    "[Requires Login] Favourite or unfavourite a character by its ID",
    {
      id: z
        .number()
        .describe("The AniList ID of the character to favourite/unfavourite"),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth();
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.people.favouriteChar(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully added character with ID ${id} to favourites.`
                : `Character with ID ${id} was removed from favourites or operation failed.`,
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

  // anilist.people.favouriteStaff()
  server.tool(
    "favourite_staff",
    "[Requires Login] Favourite or unfavourite a staff member by their ID",
    {
      id: z
        .number()
        .describe(
          "The AniList ID of the staff member to favourite/unfavourite",
        ),
    },
    async ({ id }) => {
      try {
        const auth = requireAuth();
        if (!auth.isAuthorized) {
          return auth.errorResponse;
        }

        const result = await anilist.people.favouriteStaff(id);
        return {
          content: [
            {
              type: "text",
              text: result
                ? `Successfully added staff member with ID ${id} to favourites.`
                : `Staff member with ID ${id} was removed from favourites or operation failed.`,
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

  // anilist.people.getBirthdayCharacters()
  server.tool(
    "get_todays_birthday_characters",
    "Get all characters whose birthday is today",
    {
      page: z
        .number()
        .optional()
        .default(1)
        .describe("What page in the search to target"),
    },
    async ({ page }) => {
      try {
        const characters = await anilist.people.getBirthdayCharacters(page);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(characters, null, 2),
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

  // anilist.people.getBirthdayStaff()
  server.tool(
    "get_todays_birthday_staff",
    "Get all staff members whose birthday is today",
    {
      page: z
        .number()
        .optional()
        .default(1)
        .describe("What page in the search to target"),
    },
    async ({ page }) => {
      try {
        const staffMembers = await anilist.people.getBirthdayStaff(page);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(staffMembers, null, 2),
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

  // anilist.people.staff()
  server.tool(
    "get_staff",
    "Get information about staff member by their AniList ID or name",
    {
      id: z
        .union([z.number(), z.string()])
        .describe("The AniList ID or name of the staff member"),
    },
    async ({ id }) => {
      try {
        const staff = await anilist.people.staff(id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(staff, null, 2),
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
