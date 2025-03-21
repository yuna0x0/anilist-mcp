export { registerMiscTools } from "./misc.js";
export { registerActivityTools } from "./activity.js";
export { registerListsTools } from "./lists.js";
export { registerMediaTools } from "./media.js";
export { registerPeopleTools } from "./people.js";
export { registerRecommendationTools } from "./recommendation.js";
export { registerSearchTools } from "./search.js";
export { registerThreadTools } from "./thread.js";
export { registerUserTools } from "./user.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import AniList from "@yuna0x0/anilist-node";
import { registerMiscTools } from "./misc.js";
import { registerActivityTools } from "./activity.js";
import { registerListsTools } from "./lists.js";
import { registerMediaTools } from "./media.js";
import { registerPeopleTools } from "./people.js";
import { registerRecommendationTools } from "./recommendation.js";
import { registerSearchTools } from "./search.js";
import { registerThreadTools } from "./thread.js";
import { registerUserTools } from "./user.js";

export function registerAllTools(server: McpServer, anilist: AniList) {
  registerMiscTools(server, anilist);
  registerActivityTools(server, anilist);
  registerListsTools(server, anilist);
  registerMediaTools(server, anilist);
  registerPeopleTools(server, anilist);
  registerRecommendationTools(server, anilist);
  registerSearchTools(server, anilist);
  registerThreadTools(server, anilist);
  registerUserTools(server, anilist);
}
