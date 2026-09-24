import type { z } from "zod";
import type { MediaSearchEntry } from "@yuna0x0/anilist-node";
import type { MediaFilterTypesSchema } from "./schemas.js";

// AniList accepts individual media arguments, not a filter input object.
const filterTypes = {
  id: "Int",
  idMal: "Int",
  startDate: "FuzzyDateInt",
  endDate: "FuzzyDateInt",
  season: "MediaSeason",
  seasonYear: "Int",
  type: "MediaType",
  format: "MediaFormat",
  status: "MediaStatus",
  episodes: "Int",
  duration: "Int",
  chapters: "Int",
  volumes: "Int",
  isAdult: "Boolean",
  genre: "String",
  tag: "String",
  minimumTagRank: "Int",
  tagCategory: "String",
  onList: "Boolean",
  licensedBy: "String",
  averageScore: "Int",
  popularity: "Int",
  source: "MediaSource",
  countryOfOrigin: "CountryCode",
  search: "String",
  id_not: "Int",
  id_in: "[Int]",
  id_not_in: "[Int]",
  idMal_not: "Int",
  idMal_in: "[Int]",
  idMal_not_in: "[Int]",
  startDate_greater: "FuzzyDateInt",
  startDate_lesser: "FuzzyDateInt",
  startDate_like: "String",
  endDate_greater: "FuzzyDateInt",
  endDate_lesser: "FuzzyDateInt",
  endDate_like: "String",
  format_in: "[MediaFormat]",
  format_not: "MediaFormat",
  format_not_in: "[MediaFormat]",
  status_in: "[MediaStatus]",
  status_not: "MediaStatus",
  status_not_in: "[MediaStatus]",
  episodes_greater: "Int",
  episodes_lesser: "Int",
  duration_greater: "Int",
  duration_lesser: "Int",
  chapters_greater: "Int",
  chapters_lesser: "Int",
  volumes_greater: "Int",
  volumes_lesser: "Int",
  genre_in: "[String]",
  genre_not_in: "[String]",
  tag_in: "[String]",
  tag_not_in: "[String]",
  tagCategory_in: "[String]",
  tagCategory_not_in: "[String]",
  licensedBy_in: "[String]",
  averageScore_not: "Int",
  averageScore_greater: "Int",
  averageScore_lesser: "Int",
  popularity_not: "Int",
  popularity_greater: "Int",
  popularity_lesser: "Int",
  source_in: "[MediaSource]",
  sort: "[MediaSort]",
} satisfies Record<keyof z.infer<typeof MediaFilterTypesSchema>, string>;

export async function searchMedia(
  type: "ANIME" | "MANGA",
  { term, filter, page, amount }: {
    term?: string;
    filter?: z.infer<typeof MediaFilterTypesSchema>;
    page: number;
    amount: number;
  },
  token?: string,
) {
  const filters = Object.entries({
    ...filter,
    type,
    search: term ?? filter?.search,
  }).filter(([, value]) => value !== undefined);

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      query: `query ($page: Int, $perPage: Int, ${filters
        .map(([name]) => `$${name}: ${filterTypes[name as keyof typeof filterTypes]}`)
        .join(", ")}) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { total currentPage lastPage hasNextPage perPage }
          media(${filters.map(([name]) => `${name}: $${name}`).join(", ")}) {
            id
            title { romaji english native userPreferred }
          }
        }
      }`,
      variables: { page, perPage: amount, ...Object.fromEntries(filters) },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `AniList returned HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const result: {
    data?: { Page: MediaSearchEntry };
    errors?: { message: string }[];
  } = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors.map(({ message }) => message).join("; "));
  }
  if (!result.data?.Page) {
    throw new Error("AniList returned no search data.");
  }

  return result.data.Page;
}
