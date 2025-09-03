import { ANILIST_TOKEN_HEADER } from "./constants.js";

export function requireAuth(anilistToken?: string): {
  isAuthorized: boolean;
  errorResponse?: any;
} {
  if (!anilistToken || anilistToken.trim().length === 0) {
    return {
      isAuthorized: false,
      errorResponse: {
        content: [
          {
            type: "text",
            text: `Error: This operation requires authentication.
For Streamable HTTP transport mode, please provide an AniList API token via header '${ANILIST_TOKEN_HEADER}'.
For STDIO transport mode, set the ANILIST_TOKEN environment variable before starting the server.`,
          },
        ],
        isError: true,
      },
    };
  }

  return { isAuthorized: true };
}
