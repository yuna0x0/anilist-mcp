import AniList from "@yuna0x0/anilist-node";

const anilist = new AniList();

const result = await anilist.searchEntry.anime(undefined, {
  genre: "Slice of Life",
  sort: ["SCORE_DESC"],
});

console.log(JSON.stringify(result));
