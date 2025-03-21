import { z } from "zod";

export const MediaTypeSchema = z.enum(["ANIME", "MANGA"]);

export const MediaFormatSchema = z.enum([
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
  "MANGA",
  "NOVEL",
  "ONE_SHOT",
]);

export const MediaStatusSchema = z.enum([
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
]);

export const MediaSeasonSchema = z.enum(["WINTER", "SPRING", "SUMMER", "FALL"]);

export const MediaSourceSchema = z.enum([
  "ORIGINAL",
  "MANGA",
  "LIGHT_NOVEL",
  "VISUAL_NOVEL",
  "VIDEO_GAME",
  "OTHER",
  "NOVEL",
  "DOUJINSHI",
  "ANIME",
]);

export const MediaSortSchema = z.enum([
  "ID",
  "ID_DESC",
  "TITLE_ROMAJI",
  "TITLE_ROMAJI_DESC",
  "TITLE_ENGLISH",
  "TITLE_ENGLISH_DESC",
  "TITLE_NATIVE",
  "TITLE_NATIVE_DESC",
  "TYPE",
  "TYPE_DESC",
  "FORMAT",
  "FORMAT_DESC",
  "START_DATE",
  "START_DATE_DESC",
  "END_DATE",
  "END_DATE_DESC",
  "SCORE",
  "SCORE_DESC",
  "POPULARITY",
  "POPULARITY_DESC",
  "TRENDING",
  "TRENDING_DESC",
  "EPISODES",
  "EPISODES_DESC",
  "DURATION",
  "DURATION_DESC",
  "STATUS",
  "STATUS_DESC",
  "CHAPTERS",
  "CHAPTERS_DESC",
  "VOLUMES",
  "VOLUMES_DESC",
  "UPDATED_AT",
  "UPDATED_AT_DESC",
  "SEARCH_MATCH",
  "FAVOURITES",
  "FAVOURITES_DESC",
]);

export const ActivitySortSchema = z.enum(["ID", "ID_DESC"]);

export const ActivityTypeSchema = z.enum([
  "TEXT",
  "ANIME_LIST",
  "MANGA_LIST",
  "MESSAGE",
  "MEDIA_LIST",
]);

export const UserTitleLanguageSchema = z.enum([
  "ROMAJI",
  "ENGLISH",
  "NATIVE",
  "ROMAJI_STYLISED",
  "ENGLISH_STYLISED",
  "NATIVE_STYLISED",
]);

export const UserStaffNameLanguageSchema = z.enum([
  "ROMAJI",
  "NATIVE",
  "ROMAJI_WESTERN",
]);

export const ScoreFormatSchema = z.enum([
  "POINT_100",
  "POINT_10_DECIMAL",
  "POINT_10",
  "POINT_5",
  "POINT_3",
]);

export const NotificationTypeSchema = z.enum([
  "ACTIVITY_MESSAGE",
  "ACTIVITY_REPLY",
  "FOLLOWING",
  "ACTIVITY_MENTION",
  "THREAD_COMMENT_MENTION",
  "THREAD_SUBSCRIBED",
  "THREAD_COMMENT_REPLY",
  "AIRING",
  "ACTIVITY_LIKE",
  "ACTIVITY_REPLY_LIKE",
  "THREAD_LIKE",
  "THREAD_COMMENT_LIKE",
  "ACTIVITY_REPLY_SUBSCRIBED",
  "RELATED_MEDIA_ADDITION",
  "MEDIA_DATA_CHANGE",
  "MEDIA_MERGE",
  "MEDIA_DELETION",
]);

export const NotificationOptionsSchema = z.object({
  type: NotificationTypeSchema,
  enabled: z.boolean(),
});

export const FuzzyDateSchema = z.object({
  year: z.number().nullable(),
  month: z.number().nullable(),
  day: z.number().nullable(),
});

export const MediaListOptionsSchema = z.object({
  sectionOrder: z.array(z.string()),
  splitCompletedSectionByFormat: z.boolean(),
  customLists: z.array(z.string()),
  advancedScoring: z.array(z.string()),
  advancedScoringEnabled: z.boolean(),
});

export const MediaListOptionsInputSchema = MediaListOptionsSchema.extend({
  theme: z.string(),
});

export const UserOptionsInputSchema = z.object({
  about: z.string().describe("The user's description"),
  titleLanguage: UserTitleLanguageSchema.describe(
    "The user's preferred title language",
  ),
  displayAdultContent: z
    .boolean()
    .describe("True if the user wants to display adult content"),
  airingNotifications: z
    .boolean()
    .describe("True if the user wants airing notifications"),
  profileColor: z.string().describe("The user's profile highlight color"),
  activityMergeTime: z
    .number()
    .describe(
      "The minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is always.",
    ),
  staffNameLanguage: UserStaffNameLanguageSchema.describe(
    "The user's preferred way to see staff and characters",
  ),
  notificationOptions: z
    .array(NotificationOptionsSchema)
    .describe("The user's notification options"),
  timezone: z.string().describe("The user's timezone offset format"),
  scoreFormat: ScoreFormatSchema.describe("The user's score format"),
  rowOrder: z.string().describe("The user's default list order"),
  animeListOptions: MediaListOptionsInputSchema.describe(
    "The user's options for anime lists",
  ),
  mangaListOptions: MediaListOptionsInputSchema.describe(
    "The user's options for manga lists",
  ),
});

export const UpdateEntryOptionsSchema = z
  .object({
    id: z.number().describe("The ID of the list entry"),
    mediaId: z.number().describe("The ID of the media to add"),
    status: z
      .enum([
        "CURRENT",
        "PLANNING",
        "COMPLETED",
        "PAUSED",
        "DROPPED",
        "REPEATING",
      ])
      .describe("The status of the media on the list"),
    score: z.number().describe("The score given to the media"),
    scoreRaw: z.number().describe("The raw score in 100 point format"),
    progress: z.number().describe("The amount of episodes/chapters consumed"),
    progressVolumes: z
      .number()
      .describe("The amount of volumes read (manga only)"),
    repeat: z.number().describe("Amount of times the media has been repeated"),
    priority: z.number().describe("Priority level of the media"),
    private: z.boolean().describe("Whether the entry should be private"),
    notes: z.string().describe("Text notes about the media"),
    hiddenFromStatusLists: z
      .boolean()
      .describe("Whether the entry should be hidden from non-custom lists"),
    customLists: z
      .array(z.string())
      .describe("Array of custom list names for the media"),
    advancedScores: z
      .array(z.number())
      .describe("Advanced scores as an object"),
    startedAt: z
      .object({
        year: z.number(),
        month: z.number(),
        day: z.number(),
      })
      .describe("When the user started the media"),
    completedAt: z
      .object({
        year: z.number(),
        month: z.number(),
        day: z.number(),
      })
      .describe("When the user completed the media"),
  })
  .describe("Values to save with the entry");

export const ActivityFilterTypesSchema = z.object({
  id: z.number().optional().describe("The id of the activity"),
  userId: z
    .number()
    .optional()
    .describe("The userID of the account with the activity"),
  messengerId: z.number().optional().describe("The ID of who sent the message"),
  mediaId: z.number().optional().describe("The ID of the media"),
  type: ActivityTypeSchema.optional().describe("The type of activity"),
  isFollowing: z
    .boolean()
    .optional()
    .describe(
      "[Requires Login] Filter users by who is following the authorized user",
    ),
  hasReplies: z
    .boolean()
    .optional()
    .describe("Filter by which activities have replies"),
  hasRepliesOrTypeText: z
    .boolean()
    .optional()
    .describe("Filter by which activities have replies or text"),
  createdAt: z
    .number()
    .optional()
    .describe("The time at which the activity was created"),
  id_not: z
    .number()
    .optional()
    .describe("Exclude an activity with the given ID"),
  id_in: z
    .array(z.number())
    .optional()
    .describe("Include any activities with the given IDs"),
  id_not_in: z
    .array(z.number())
    .optional()
    .describe("Excludes any activities with the given IDs"),
  userId_not: z
    .number()
    .optional()
    .describe("Exclude any activity with the given userID"),
  userId_in: z
    .array(z.number())
    .optional()
    .describe("Includes any activity with the given userIDs"),
  userId_not_in: z
    .array(z.number())
    .optional()
    .describe("Exclude any activity with the given userIDs"),
  messengerId_not: z
    .number()
    .optional()
    .describe("Exclude any activity with the given message sender ID"),
  messengerId_in: z
    .array(z.number())
    .optional()
    .describe("Include any activity with the given message sender IDs"),
  messengerId_not_in: z
    .array(z.number())
    .optional()
    .describe("Exclude any activity with the given message sender IDs"),
  mediaId_not: z
    .number()
    .optional()
    .describe("Exclude any activity with the given media ID"),
  mediaId_in: z
    .array(z.number())
    .optional()
    .describe("Include any activity with the given media IDs"),
  mediaId_not_in: z
    .array(z.number())
    .optional()
    .describe("Exclude any activity with the given media IDs"),
  type_not: ActivityTypeSchema.optional().describe(
    "Exclude any activity with the same ActivityType",
  ),
  type_in: z
    .array(ActivityTypeSchema)
    .optional()
    .describe("Include any activity with the given ActivityTypes"),
  type_not_in: z
    .array(ActivityTypeSchema)
    .optional()
    .describe("Exclude any activity with the given ActivityTypes"),
  createdAt_greater: z
    .number()
    .optional()
    .describe("Include any activity created at the given date or more recent"),
  createdAt_lesser: z
    .number()
    .optional()
    .describe("Include any activity created at the given date or less recent"),
  sort: z
    .array(ActivitySortSchema)
    .optional()
    .describe("Sort the query by the parameters given."),
});

export const MediaFilterTypesSchema = z.object({
  id: z.number().optional().describe("The AniList ID"),
  idMal: z.number().optional().describe("The MyAnimeList ID"),
  startDate: FuzzyDateSchema.optional().describe("The start date of the media"),
  endDate: FuzzyDateSchema.optional().describe("The end date of the media"),
  season: MediaSeasonSchema.optional().describe("The season the media aired"),
  seasonYear: z.number().optional().describe("The year of the season"),
  type: MediaTypeSchema.optional().describe(
    "The type of the media (ANIME or MANGA)",
  ),
  format: MediaFormatSchema.optional().describe("The format of the media"),
  status: MediaStatusSchema.optional().describe(
    "The current status of the media",
  ),
  episodes: z
    .number()
    .optional()
    .describe("The number of episodes in the media"),
  duration: z
    .number()
    .optional()
    .describe("The duration of episodes in minutes"),
  chapters: z
    .number()
    .optional()
    .describe("The number of chapters in the media"),
  volumes: z.number().optional().describe("The number of volumes in the media"),
  isAdult: z
    .boolean()
    .optional()
    .describe("If the media is intended for adult audiences"),
  genre: z.string().optional().describe("Filter by a specific genre"),
  tag: z.string().optional().describe("Filter by a specific tag"),
  minimumTagRank: z
    .number()
    .optional()
    .describe("The minimum tag rank to filter by"),
  tagCategory: z.string().optional().describe("Filter by tag category"),
  onList: z
    .boolean()
    .optional()
    .describe(
      "[Requires Login] Filter by if the media is on the authenticated user's list",
    ),
  licensedBy: z
    .string()
    .optional()
    .describe("Filter by media licensed by a specific company"),
  averageScore: z
    .number()
    .optional()
    .describe("Filter by the media's average score"),
  popularity: z
    .number()
    .optional()
    .describe("Filter by the media's popularity"),
  source: MediaFormatSchema.optional().describe(
    "Filter by the media's source type",
  ),
  countryOfOrigin: z
    .number()
    .optional()
    .describe(
      "Filter by the country where the media was created (ISO 3166-1 alpha-2 country code)",
    ),
  search: z.string().optional().describe("Filter by search query"),
  id_not: z
    .number()
    .optional()
    .describe("Filter by media ID not equal to value"),
  id_in: z.array(z.number()).optional().describe("Filter by media ID in array"),
  id_not_in: z
    .array(z.number())
    .optional()
    .describe("Filter by media ID not in array"),
  idMal_not: z
    .number()
    .optional()
    .describe("Filter by MyAnimeList ID not equal to value"),
  idMal_in: z
    .array(z.number())
    .optional()
    .describe("Filter by MyAnimeList ID in array"),
  idMal_not_in: z
    .array(z.number())
    .optional()
    .describe("Filter by MyAnimeList ID not in array"),
  startDate_greater: z
    .number()
    .optional()
    .describe("Filter by start date greater than value (FuzzyDateInt format)"),
  startDate_lesser: z
    .number()
    .optional()
    .describe("Filter by start date less than value (FuzzyDateInt format)"),
  startDate_like: z
    .string()
    .optional()
    .describe("Filter by start date that matches pattern"),
  endDate_greater: z
    .number()
    .optional()
    .describe("Filter by end date greater than value (FuzzyDateInt format)"),
  endDate_lesser: z
    .number()
    .optional()
    .describe("Filter by end date less than value (FuzzyDateInt format)"),
  endDate_like: z
    .string()
    .optional()
    .describe("Filter by end date that matches pattern"),
  format_in: z
    .array(MediaFormatSchema)
    .optional()
    .describe("Filter by media format in array"),
  format_not: MediaFormatSchema.optional().describe(
    "Filter by media format not equal to value",
  ),
  format_not_in: z
    .array(MediaFormatSchema)
    .optional()
    .describe("Filter by media format not in array"),
  status_in: z
    .array(MediaStatusSchema)
    .optional()
    .describe("Filter by media status in array"),
  status_not: MediaStatusSchema.optional().describe(
    "Filter by media status not equal to value",
  ),
  status_not_in: z
    .array(MediaStatusSchema)
    .optional()
    .describe("Filter by media status not in array"),
  episodes_greater: z
    .number()
    .optional()
    .describe("Filter by episode count greater than value"),
  episodes_lesser: z
    .number()
    .optional()
    .describe("Filter by episode count less than value"),
  duration_greater: z
    .number()
    .optional()
    .describe("Filter by episode duration greater than value"),
  duration_lesser: z
    .number()
    .optional()
    .describe("Filter by episode duration less than value"),
  chapters_greater: z
    .number()
    .optional()
    .describe("Filter by chapter count greater than value"),
  chapters_lesser: z
    .number()
    .optional()
    .describe("Filter by chapter count less than value"),
  volumes_greater: z
    .number()
    .optional()
    .describe("Filter by volume count greater than value"),
  volumes_lesser: z
    .number()
    .optional()
    .describe("Filter by volume count less than value"),
  genre_in: z
    .array(z.string())
    .optional()
    .describe("Filter by genres in array"),
  genre_not_in: z
    .array(z.string())
    .optional()
    .describe("Filter by genres not in array"),
  tag_in: z.array(z.string()).optional().describe("Filter by tags in array"),
  tag_not_in: z
    .array(z.string())
    .optional()
    .describe("Filter by tags not in array"),
  tagCategory_in: z
    .array(z.string())
    .optional()
    .describe("Filter by tag categories in array"),
  tagCategory_not_in: z
    .array(z.string())
    .optional()
    .describe("Filter by tag categories not in array"),
  licensedBy_in: z
    .array(z.string())
    .optional()
    .describe("Filter by media licensed by companies in array"),
  averageScore_not: z
    .number()
    .optional()
    .describe("Filter by average score not equal to value"),
  averageScore_greater: z
    .number()
    .optional()
    .describe("Filter by average score greater than value"),
  averageScore_lesser: z
    .number()
    .optional()
    .describe("Filter by average score less than value"),
  popularity_not: z
    .number()
    .optional()
    .describe("Filter by popularity not equal to value"),
  popularity_greater: z
    .number()
    .optional()
    .describe("Filter by popularity greater than value"),
  popularity_lesser: z
    .number()
    .optional()
    .describe("Filter by popularity less than value"),
  source_in: z
    .array(MediaSourceSchema)
    .optional()
    .describe("Filter by source types in array"),
  sort: z
    .array(MediaSortSchema)
    .optional()
    .describe("Sort the results by the provided sort options"),
});
