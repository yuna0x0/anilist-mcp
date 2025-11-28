/**
 * Utility functions to filter media responses from AniList API
 * to reduce token usage and prevent crashes from large JSON payloads
 */

/**
 * Filters a single media object to include only essential fields
 * Removes large arrays like character lists, staff lists, relations, recommendations
 */
function filterSingleMedia(media: any): any {
  if (!media) return media;

  // Create a filtered object with only essential fields
  const filtered: any = {
    id: media.id,
    idMal: media.idMal,
    title: media.title,
    type: media.type,
    format: media.format,
    status: media.status,
    description: media.description,
    startDate: media.startDate,
    endDate: media.endDate,
    season: media.season,
    seasonYear: media.seasonYear,
    episodes: media.episodes,
    duration: media.duration,
    chapters: media.chapters,
    volumes: media.volumes,
    countryOfOrigin: media.countryOfOrigin,
    isLicensed: media.isLicensed,
    source: media.source,
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
    nextAiringEpisode: media.nextAiringEpisode,
    siteUrl: media.siteUrl,
  };

  // Include limited tags (top 5 only)
  if (media.tags && Array.isArray(media.tags)) {
    filtered.tags = media.tags.slice(0, 5).map((tag: any) => ({
      name: tag.name,
      rank: tag.rank,
      isMediaSpoiler: tag.isMediaSpoiler,
    }));
  }

  // Include limited studios (main studios only)
  if (media.studios?.nodes && Array.isArray(media.studios.nodes)) {
    filtered.studios = {
      nodes: media.studios.nodes.slice(0, 3).map((studio: any) => ({
        id: studio.id,
        name: studio.name,
        isAnimationStudio: studio.isAnimationStudio,
      })),
    };
  }

  // Include limited external links
  if (media.externalLinks && Array.isArray(media.externalLinks)) {
    filtered.externalLinks = media.externalLinks
      .slice(0, 5)
      .map((link: any) => ({
        site: link.site,
        url: link.url,
      }));
  }

  // Include limited streaming episodes
  if (media.streamingEpisodes && Array.isArray(media.streamingEpisodes)) {
    filtered.streamingEpisodes = media.streamingEpisodes
      .slice(0, 3)
      .map((ep: any) => ({
        title: ep.title,
        url: ep.url,
      }));
  }

  // Include top 3 rankings
  if (media.rankings && Array.isArray(media.rankings)) {
    filtered.rankings = media.rankings.slice(0, 3).map((ranking: any) => ({
      rank: ranking.rank,
      type: ranking.type,
      context: ranking.context,
      year: ranking.year,
      season: ranking.season,
    }));
  }

  // Remove undefined/null values to reduce size
  Object.keys(filtered).forEach((key) => {
    if (filtered[key] === undefined || filtered[key] === null) {
      delete filtered[key];
    }
  });

  return filtered;
}

/**
 * Filters media response(s) to include only essential fields
 * Handles both single media objects and arrays of media
 */
export function filterMedia(media: any | any[]): any | any[] {
  if (!media) return media;

  if (Array.isArray(media)) {
    return media.map(filterSingleMedia);
  }

  return filterSingleMedia(media);
}
