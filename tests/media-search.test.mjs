import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerAllTools } from "../dist/tools/index.js";

const page = {
  pageInfo: { currentPage: 1, hasNextPage: false, perPage: 5 },
  media: [{ id: 1, title: { romaji: "Cowboy Bebop", english: null } }],
};

async function connect(t, { token, body = { data: { Page: page } }, status = 200 } = {}) {
  const requests = [];
  const fetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...options, body: JSON.parse(options.body) });
    return new Response(JSON.stringify(body), { status });
  };
  t.after(() => { globalThis.fetch = fetch; });

  const server = new McpServer({ name: "test", version: "1.0.0" });
  const client = new Client({ name: "test", version: "1.0.0" });
  registerAllTools(server, {}, { anilistToken: token });
  t.after(async () => {
    await client.close();
    await server.close();
  });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, requests };
}

for (const type of ["ANIME", "MANGA"]) {
  const name = `search_${type.toLowerCase()}`;

  for (const [field, value, graphqlType] of [
    ["source", "ORIGINAL", "MediaSource"],
    ["countryOfOrigin", "JP", "CountryCode"],
    ["startDate", 19980403, "FuzzyDateInt"],
    ["endDate", 19990424, "FuzzyDateInt"],
  ]) {
    test(`${name} accepts ${field} and sends its AniList variable type`, async (t) => {
      const { client, requests } = await connect(t);
      const result = await client.callTool({ name, arguments: { filter: { [field]: value } } });
      assert.equal(result.isError, undefined);
      assert.deepEqual(JSON.parse(result.content[0].text), page);
      assert.equal(requests.length, 1);
      assert.equal(requests[0].url, "https://graphql.anilist.co");
      assert.equal(requests[0].method, "POST");
      assert.equal(requests[0].headers.Authorization, undefined);
      assert.ok(requests[0].signal instanceof AbortSignal);
      assert.deepEqual(requests[0].body.variables, { type, [field]: value, page: 1, perPage: 5 });
      assert.ok(requests[0].body.query.includes(`$${field}: ${graphqlType}`));
      assert.ok(requests[0].body.query.includes(`${field}: $${field}`));
    });
  }

  test(`${name} preserves combined filters, authentication, and pagination`, async (t) => {
    const { client, requests } = await connect(t, { token: "test-token" });
    const filter = {
      countryOfOrigin: "JP",
      source_in: ["WEB_NOVEL", "LIGHT_NOVEL"],
      genre_in: ["SCI-FI", 'A "quoted" genre'],
      format_in: ["TV", "MOVIE"],
      startDate_greater: 20000000,
      sort: ["POPULARITY_DESC"],
      onList: false,
      averageScore_greater: 0,
    };
    const term = 'A "title" \\ with\nnewlines';
    const result = await client.callTool({ name, arguments: { term, filter, page: 2, amount: 3 } });
    assert.equal(result.isError, undefined);
    assert.equal(requests[0].headers.Authorization, "Bearer test-token");
    assert.deepEqual(requests[0].body.variables, { ...filter, type, search: term, page: 2, perPage: 3 });
    assert.ok(requests[0].body.query.includes("$source_in: [MediaSource]"));
    assert.ok(requests[0].body.query.includes("$genre_in: [String]"));
    assert.ok(!requests[0].body.query.includes(term));
    assert.ok(!requests[0].body.query.includes("SCI-FI"));
    assert.ok(!requests[0].body.query.includes("undefined"));
  });

  test(`${name} works without filters and supports filter.search`, async (t) => {
    const { client, requests } = await connect(t);
    await client.callTool({ name, arguments: {} });
    await client.callTool({ name, arguments: { filter: { search: "Bebop" } } });
    assert.deepEqual(requests[0].body.variables, { type, page: 1, perPage: 5 });
    assert.ok(!requests[0].body.query.includes("$search"));
    assert.equal(requests[1].body.variables.search, "Bebop");
  });

  test(`${name} keeps the selected media type and gives term precedence`, async (t) => {
    const { client, requests } = await connect(t);
    await client.callTool({
      name,
      arguments: { term: "Bebop", filter: { type: type === "ANIME" ? "MANGA" : "ANIME", search: "ignored" } },
    });
    assert.equal(requests[0].body.variables.type, type);
    assert.equal(requests[0].body.variables.search, "Bebop");
    assert.equal((requests[0].body.query.match(/\$type: MediaType/g) || []).length, 1);
  });

  test(`${name} rejects incorrect filter types before requesting AniList`, async (t) => {
    const { client, requests } = await connect(t);
    for (const filter of [
      { source: "TV" },
      { countryOfOrigin: 81 },
      { countryOfOrigin: "JPN" },
      { startDate: { year: 1998, month: 4, day: 3 } },
      { endDate: 19990424.5 },
    ]) {
      const result = await client.callTool({ name, arguments: { filter } });
      assert.equal(result.isError, true);
    }
    assert.equal(requests.length, 0);
  });

  for (const [label, body, status, error] of [
    ["GraphQL errors", { errors: [{ message: "Invalid filter" }] }, 200, /Invalid filter/],
    ["HTTP errors", { errors: [{ message: "Too Many Requests" }] }, 429, /HTTP 429/],
    ["missing data", { data: null }, 200, /no search data/],
  ]) {
    test(`${name} returns ${label} as MCP errors`, async (t) => {
      const { client } = await connect(t, { body, status });
      const result = await client.callTool({ name, arguments: {} });
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, error);
    });
  }
}
