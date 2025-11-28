/**
 * Utility functions to filter media responses from AniList API
 * to reduce token usage and prevent crashes from large JSON payloads
 */

// Import types from the AniList library
import type {
  AnimeEntry,
  MangaEntry,
  StudioRelation,
  Tags,
  AiringEntry,
  StreamingEpisode,
  Ranking,
} from "@yuna0x0/anilist-node";

/**
 * Filtered media response that includes only essential fields
 */
export interface FilteredMediaEntry {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  format: string;
  status: string;
  description: string;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  season?: string;
  seasonYear?: number;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  countryOfOrigin: string;
  isLicensed: number;
  source?: string;
  hashtag: string;
  updatedAt: number;
  coverImage: {
    large: string;
    medium: string;
    small: string;
    color: string;
  };
  bannerImage: string;
  genres: string[];
  synonyms: string[];
  averageScore: number;
  meanScore: number;
  popularity: number;
  favourites: number;
  isAdult: boolean;
  nextAiringEpisode?: Array<{
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  }>;
  siteUrl: string;
  tags?: Array<{
    id: number;
    name: string;
    isMediaSpoiler: boolean;
  }>;
  studios?: Array<{
    id: number;
    name: string;
    isAnimationStudio: boolean;
  }>;
  externalLinks?: string[];
  streamingEpisodes?: Array<{
    title: string;
    url: string;
  }>;
  rankings?: Array<{
    rank: number;
    type: string;
    context: string;
    year: number | null;
    season: string | null;
  }>;
}

/**
 * Filters a single media object to include only essential fields
 * Removes large arrays like character lists, staff lists, relations, recommendations
 */
function filterSingleMedia(media: AnimeEntry | MangaEntry): FilteredMediaEntry {
  // Create a filtered object with only essential fields
  const filtered: FilteredMediaEntry = {
    id: media.id,
    idMal: media.idMal,
    title: media.title,
    format: media.format,
    status: media.status,
    description: media.description,
    startDate: media.startDate,
    endDate: media.endDate,
    countryOfOrigin: media.countryOfOrigin,
    isLicensed: media.isLicensed,
    hashtag: media.hashtag,
    updatedAt: media.updatedAt,
    coverImage: media.coverImage,
    bannerImage: media.bannerImage,
    genres: media.genres,
    synonyms: media.synonyms,
    averageScore: media.averageScore,
    meanScore: media.meanScore,
    popularity: media.popularity,
    favourites: media.favourites,
    isAdult: media.isAdult,
    siteUrl: media.siteUrl,
  };

  // Add anime-specific fields (type guard for AnimeEntry)
  if ("episodes" in media && media.episodes !== undefined) {
    filtered.episodes = media.episodes;
    filtered.season = media.season;
    filtered.seasonYear = media.seasonYear;
    filtered.duration = media.duration;
    filtered.source = media.source;
  }

  // Add manga-specific fields (type guard for MangaEntry)
  if ("chapters" in media && media.chapters !== undefined) {
    filtered.chapters = media.chapters;
    filtered.volumes = media.volumes;
  }

  // Include nextAiringEpisode for anime
  if (media.nextAiringEpisode && Array.isArray(media.nextAiringEpisode)) {
    filtered.nextAiringEpisode = (media.nextAiringEpisode as AiringEntry[])
      .slice(0, 1) // Only include the next airing episode
      .map((airing) => ({
        airingAt: airing.airingAt,
        timeUntilAiring: airing.timeUntilAiring,
        episode: airing.episode,
      }));
  }

  // Include limited tags (top 5 by relevance)
  if (media.tags && Array.isArray(media.tags)) {
    filtered.tags = (media.tags as Tags[]).slice(0, 5).map((tag) => ({
      id: tag.id,
      name: tag.name,
      isMediaSpoiler: tag.isMediaSpoiler,
    }));
  }

  // Include limited studios (top 3 main studios)
  if (media.studios && Array.isArray(media.studios)) {
    filtered.studios = (media.studios as StudioRelation[])
      .slice(0, 3)
      .map((studio) => ({
        id: studio.id,
        name: studio.name,
        isAnimationStudio: studio.isAnimationStudio,
      }));
  }

  // Include external links (limited to top 5)
  if (media.externalLinks && Array.isArray(media.externalLinks)) {
    filtered.externalLinks = (media.externalLinks as string[]).slice(0, 5);
  }

  // Include limited streaming episodes (top 3)
  if (media.streamingEpisodes && Array.isArray(media.streamingEpisodes)) {
    filtered.streamingEpisodes = (media.streamingEpisodes as StreamingEpisode[])
      .slice(0, 3)
      .map((ep) => ({
        title: ep.title,
        url: ep.url,
      }));
  }

  // Include top 3 rankings
  if (media.rankings && Array.isArray(media.rankings)) {
    filtered.rankings = (media.rankings as Ranking[])
      .slice(0, 3)
      .map((ranking) => ({
        rank: ranking.rank,
        type: ranking.type,
        context: ranking.context,
        year: ranking.year,
        season: ranking.season,
      }));
  }

  // Remove undefined/null values to reduce payload size
  Object.keys(filtered).forEach((key) => {
    const typedKey = key as keyof FilteredMediaEntry;
    if (filtered[typedKey] === undefined || filtered[typedKey] === null) {
      delete filtered[typedKey];
    }
  });

  return filtered;
}

/**
 * Filters media response(s) to include only essential fields
 * Handles both single media objects and arrays of media
 */
export function filterMedia(
  media: AnimeEntry | MangaEntry | AnimeEntry[] | MangaEntry[],
): FilteredMediaEntry | FilteredMediaEntry[] {
  if (Array.isArray(media)) {
    return media.map((m) => filterSingleMedia(m));
  }

  return filterSingleMedia(media);
}
