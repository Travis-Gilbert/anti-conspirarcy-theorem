import test from "node:test";
import assert from "node:assert/strict";

import {
  buildClaimQuery,
  buildTheseusSearchUrl,
  selectClaimsForTavily,
  tavilyLookup,
} from "../src/background/tavily-client.js";

function extraction() {
  return {
    claims: [
      {
        id: "c2",
        text: "A lower specificity claim.",
        specificity_anchors: ["one"],
      },
      {
        id: "c0",
        text: "A precise claim about a 2025 filing and measured rate.",
        specificity_anchors: ["2025", "filing", "measured", "rate"],
      },
      {
        id: "c1",
        text: "Another precise claim about a 2024 data release.",
        specificity_anchors: ["2024", "data", "release"],
      },
    ],
  };
}

test("selectClaimsForTavily ranks by specificity anchors then id", () => {
  assert.deepEqual(selectClaimsForTavily(extraction().claims, 2).map((claim) => claim.id), ["c0", "c1"]);
});

test("buildClaimQuery includes claim text and quoted anchors", () => {
  const claim = {
    ...extraction().claims[0],
    specificity_anchors: ["one", "\"quoted\" anchor"],
  };
  const query = buildClaimQuery(claim);
  assert.match(query, /lower specificity claim/);
  assert.match(query, /"one"/);
  assert.match(query, /"quoted anchor"/);
  assert.doesNotMatch(query, /""quoted" anchor"/);
});

test("buildTheseusSearchUrl targets the browser search endpoint", () => {
  const url = buildTheseusSearchUrl("climate filing", {
    endpoint: "https://travisgilbert.me/api/v2/theseus/web/search/",
    maxResults: 3,
  });
  assert.equal(url, "https://travisgilbert.me/api/v2/theseus/web/search/?q=climate+filing&limit=3");
});

test("tavilyLookup uses bearer auth and isolates per-claim failures", async () => {
  const calls = [];
  const fetchImpl = async (_url, options = {}) => {
    calls.push(options);
    const body = JSON.parse(options.body);
    if (body.query.includes("2024 data")) {
      return new Response("bad", { status: 500 });
    }
    return Response.json({
      results: [
        {
          title: "Result",
          url: "https://example.org/story",
          published_date: "2025-01-02",
          score: 0.91,
          content: "short snippet",
        },
      ],
    });
  };

  const result = await tavilyLookup(extraction(), {
    apiKey: "tvly-test",
    fetchImpl,
    sleep: async () => {},
    limit: 2,
  });

  assert.equal(result.calls_made, 2);
  assert.equal(result.tavily_calls_made, 2);
  assert.equal(result.theseus_calls_made, 0);
  assert.equal(calls[0].headers.authorization, "Bearer tvly-test");
  assert.equal(result.by_claim_id.c0[0].domain, "example.org");
  assert.deepEqual(result.by_claim_id.c1, []);
  assert.equal(result.per_claim[1].ok, false);
});

test("tavilyLookup returns null when disabled by missing key and fallback", async () => {
  assert.equal(await tavilyLookup(extraction(), { apiKey: "" }), null);
});

test("tavilyLookup falls back to Theseus search when Tavily has no key", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    assert.equal(options.method, "GET");
    return Response.json([
      {
        title: "Theseus hit",
        url: "https://local.example/webdoc",
        snippet: "cached local evidence",
        fetched_at: "2026-04-20T12:00:00Z",
        score: 0.5,
      },
    ]);
  };

  const result = await tavilyLookup(extraction(), {
    apiKey: "",
    allowTheseusFallback: true,
    fetchImpl,
    limit: 1,
  });

  assert.equal(result.calls_made, 1);
  assert.equal(result.tavily_calls_made, 0);
  assert.equal(result.theseus_calls_made, 1);
  assert.match(calls[0].url, /\/api\/v2\/theseus\/web\/search\//);
  assert.equal(result.by_claim_id.c0[0].provider, "theseus_web_search");
  assert.equal(result.by_claim_id.c0[0].content, "cached local evidence");
  assert.equal(result.per_claim[0].fallback_used, true);
});

test("tavilyLookup falls back per claim after Tavily failure", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (options.method === "POST") {
      return new Response("bad", { status: 503 });
    }
    return Response.json([
      {
        title: "Recovered",
        url: "https://theseus.example/recovered",
        snippet: "fallback evidence",
        score: 0.4,
      },
    ]);
  };

  const result = await tavilyLookup(extraction(), {
    apiKey: "tvly-test",
    allowTheseusFallback: true,
    fetchImpl,
    sleep: async () => {},
    limit: 1,
  });

  assert.equal(result.calls_made, 2);
  assert.equal(result.tavily_calls_made, 1);
  assert.equal(result.theseus_calls_made, 1);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[1].options.method, "GET");
  assert.equal(result.per_claim[0].ok, true);
  assert.equal(result.per_claim[0].provider, "theseus_web_search");
  assert.match(result.per_claim[0].tavily_error, /503/);
});
