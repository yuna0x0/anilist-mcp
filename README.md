# AniList MCP Server
[![smithery badge](https://smithery.ai/badge/@yuna0x0/anilist-mcp)](https://smithery.ai/server/@yuna0x0/anilist-mcp)

A Model Context Protocol (MCP) server that interfaces with the AniList API, allowing LLM clients to access and interact with anime, manga, character, staff, and user data from AniList.

## Features

- Search for anime, manga, characters, staff, and studios
- Get detailed information about specific anime, manga, characters, and staff members
- Access user profiles and lists
- Support for advanced filtering options
- Retrieve genres and media tags

## Prerequisites

- Node.js 18+

## Using with Claude Desktop (or other MCP clients)

### Installing via Smithery

To install AniList MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@yuna0x0/anilist-mcp):

```bash
npx -y @smithery/cli install @yuna0x0/anilist-mcp --client claude

# For other MCP clients, use the following command:
# List available clients
npx -y @smithery/cli list clients
# Install to other clients
npx -y @smithery/cli install @yuna0x0/anilist-mcp --client <client_name>
```

### Installing via mcp-get

```bash
npx @michaellatman/mcp-get@latest install anilist-mcp
```

### Manual Installation

1. Add this server to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "anilist": {
      "command": "npx",
      "args": ["-y", "anilist-mcp"],
      "env": {
        "ANILIST_TOKEN": "your_api_token"
      }
    }
  }
}
```

You may remove the `env` object entirely, if you are not planning to use the AniList Token for operations that require login.

2. Restart Claude Desktop
3. Use the tools to interact with AniList

## Environment Variables

- `ANILIST_TOKEN`: (Optional) AniList API Token (Only needed for operations that require login)

### Get an AniList API Token (Optional)

To get an API token, follow these steps:

1. Go to [AniList settings](https://anilist.co/settings/developer).
2. Click on "Create New Client".
3. Use this URL as your client's "Redirect URL":
```
https://anilist.co/api/v2/oauth/pin
```

4. Click "Save"
5. Then go to https://anilist.co/api/v2/oauth/authorize?client_id={clientID}&response_type=token, replace the `{clientID}` with the client ID you get. It will ask you to log in and then provide you with the token to use.
6. Copy the generated token and use it in your `.env` file or environment variables.

## Available Tools

### Misc Tools
- **get_genres**: Get all available genres on AniList
- **get_media_tags**: Get all available media tags on AniList
- **get_site_statistics**: Get AniList site statistics over the last seven days
- **get_studio**: Get information about a studio by its AniList ID or name
- **favourite_studio**: [Requires Login] Favourite or unfavourite a studio by its ID

### Activity Tools
- **delete_activity**: [Requires Login] Delete the current authorized user's activity post
- **get_activity**: Get a specific AniList activity by its ID
- **get_user_activity**: Fetch activities from a user
- **post_message_activity**: [Requires Login] Post a new message activity or update an existing one
- **post_text_activity**: [Requires Login] Post a new text activity or update an existing one

### List Tools
- **get_user_anime_list**: Get a user's anime list
- **get_user_manga_list**: Get a user's manga list
- **add_list_entry**: [Requires Login] Add an entry to the authorized user's list
- **remove_list_entry**: [Requires Login] Remove an entry from the authorized user's list
- **update_list_entry**: [Requires Login] Update an entry on the authorized user's list

### Media Tools
- **get_anime**: Get detailed information about an anime by its AniList ID
- **get_manga**: Get detailed information about a manga by its AniList ID
- **favourite_anime**: [Requires Login] Favourite or unfavourite an anime by its ID
- **favourite_manga**: [Requires Login] Favourite or unfavourite a manga by its ID

### People Tools
- **get_character**: Get information about a character by their AniList ID
- **get_staff**: Get information about staff member by their AniList ID
- **favourite_character**: [Requires Login] Favourite or unfavourite a character by its ID
- **favourite_staff**: [Requires Login] Favourite or unfavourite a staff member by their ID
- **get_todays_birthday_characters**: Get all characters whose birthday is today
- **get_todays_birthday_staff**: Get all staff members whose birthday is today

### Recommendation Tools
- **get_recommendation**: Get an AniList recommendation by its ID
- **get_recommendations_for_media**: Get AniList recommendations for a specific media

### Search Tools
- **search_activity**: Search for activities on AniList
- **search_anime**: Search for anime with query term and filters
- **search_manga**: Search for manga with query term and filters
- **search_character**: Search for characters based on a query term
- **search_staff**: Search for staff members based on a query term
- **search_studio**: Search for studios based on a query term
- **search_user**: Search for users on AniList

### Thread Tools
- **get_thread**: Get a specific thread by its AniList ID
- **get_thread_comments**: Get comments for a specific thread
- **delete_thread**: [Requires Login] Delete a thread by its ID

### User Tools
- **get_user_profile**: Get a user's AniList profile
- **get_user_stats**: Get a user's AniList statistics
- **get_full_user_info**: Get a user's complete profile and stats information
- **get_user_recent_activity**: Get recent activity from a user
- **get_authorized_user**: [Requires Login] Get profile information of the currently authorized user
- **follow_user**: [Requires Login] Follow or unfollow a user by their ID
- **update_user**: [Requires Login] Update user settings

## Example Usage

### Basic Anime Search

```
Can you search for anime similar to "Bocchi the Rock!"?
```

### Get Character Info

```
Can you tell me about the character Hitori Gotou? Use the AniList tools to find information.
```

### Compare Studio Works

```
What anime has Studio Ghibli produced? Can you list their most popular works?
```

## Local Development

This project uses [Bun](https://bun.sh) as its package manager. You should install it if you haven't already.

Clone the repository and install dependencies:

```bash
git clone https://github.com/yuna0x0/anilist-mcp.git
cd anilist-mcp
bun install
```

### Configuration (Optional)

1. Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your AniList API token:
```
ANILIST_TOKEN=your_api_token
```

## Debugging with MCP Inspector

You can use the MCP Inspector to test and debug the AniList MCP server:

```bash
npx @modelcontextprotocol/inspector -e ANILIST_TOKEN=your_api_token npx anilist-mcp

# Use this instead when Local Development
bun run inspector
```

Then open your browser to the provided URL (usually http://127.0.0.1:6274) to access the MCP Inspector interface. From there, you can:

1. Connect to your running AniList MCP server
2. Browse available tools
3. Run tools with custom parameters
4. View the responses

This is particularly useful for testing your setup before connecting it to Claude or another AI assistant.

## Docker

Pull from Docker Hub:
```bash
docker pull yuna0x0/anilist-mcp
```

Docker build (Local Development):
```bash
docker build -t yuna0x0/anilist-mcp .
```

Docker multi-platform build (Local Development):
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t yuna0x0/anilist-mcp .
```

## Security Notice

This MCP server accepts your AniList API token in the .env file or as an environment variable. Keep this information secure and never commit it to version control.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
