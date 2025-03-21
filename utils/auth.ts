export function requireAuth(): { isAuthorized: boolean; errorResponse?: any } {
  if (!process.env.ANILIST_TOKEN) {
    return {
      isAuthorized: false,
      errorResponse: {
        content: [
          {
            type: "text",
            text: "Error: This operation requires authentication. Please provide an AniList API token via the ANILIST_TOKEN environment variable.",
          },
        ],
        isError: true,
      },
    };
  }

  return { isAuthorized: true };
}
