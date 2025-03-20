# AniList MCP Server

A Model Context Protocol (MCP) server that interfaces with the AniList API, allowing LLM clients to access and interact with anime, manga, character, staff, and user data from AniList.

## Features

- Search for anime, manga, characters, staff, and studios
- Get detailed information about specific anime, manga, characters, and staff members
- Access user profiles and lists
- Support for advanced filtering options
- Retrieve genres and media tags

## Installation

### Prerequisites

- Node.js 18+
- AniList API token (optional, for authenticated operations like personal favorites)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yuna0x0/anilist-mcp.git
cd anilist-mcp
bun install  # or use npm, yarn, pnpm
```

## API Token Configuration (Optional)

### Option 1: Using a .env file

1. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your AniList API token:
   ```
   ANILIST_TOKEN=your_api_token
   ```

### Option 2: Using environment variables inline

You can also provide the API token directly when running the server:

```bash
ANILIST_TOKEN=your_api_token bun start
```

You can get an API token from [AniList settings](https://anilist.co/settings/developer).

## Usage

### Start the MCP server

#### Local installation:

```bash
bun start  # or use npm, yarn, pnpm
```

#### Using bunx (without cloning):

```bash
ANILIST_TOKEN=your_api_token bunx anilist-mcp
```

### Debugging with MCP Inspector

You can use the MCP Inspector to test and debug the AniList MCP server:

```bash
# Using the package.json script
bun run inspector  # or use npm, yarn, pnpm

# Alternative: Direct use with bunx (or npx)
bunx @modelcontextprotocol/inspector -e ANILIST_TOKEN=your_api_token bunx anilist-mcp
```

Then open your browser to the provided URL (usually http://localhost:5173) to access the MCP Inspector interface. From there, you can:

1. Connect to your running AniList MCP server
2. Browse available tools
3. Run tools with custom parameters
4. View the responses

This is particularly useful for testing your setup before connecting it to Claude or another AI assistant.

### Using with Claude Desktop or other MCP clients

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

2. Restart Claude Desktop
3. Use the tools to interact with AniList

## Available Tools

### Anime Tools
- `get_anime` - Get detailed information about an anime by its AniList ID
- `search_anime` - Search for anime based on a query term
- `anime_filter` - Search for anime with advanced filters

### Manga Tools
- `get_manga` - Get detailed information about a manga by its AniList ID
- `search_manga` - Search for manga based on a query term
- `manga_filter` - Search for manga with advanced filters

### Character & Staff Tools
- `get_character` - Get information about a character by their AniList ID
- `search_character` - Search for characters based on a query term
- `get_staff` - Get information about staff member by their AniList ID
- `search_staff` - Search for staff members based on a query term

### User Tools
- `get_user_profile` - Get a user's AniList profile
- `get_user_stats` - Get a user's AniList statistics
- `get_user_anime_list` - Get a user's anime list
- `get_user_manga_list` - Get a user's manga list

### Studio Tools
- `get_studio` - Get information about a studio by its AniList ID or name
- `search_studio` - Search for studios based on a query term

### Genre & Tag Tools
- `get_genres` - Get all available genres on AniList
- `get_media_tags` - Get all available media tags on AniList

## Examples

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

## License

MIT License
