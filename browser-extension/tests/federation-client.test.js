import test from "node:test";
import assert from "node:assert/strict";

const storage = {};
globalThis.chrome = {
  storage: {
    sync: {
      async get(keys) {
        return Object.fromEntries(keys.map((key) => [key, storage[key]]));
      },
      async set(patch) {
        Object.assign(storage, patch);
      },
    },
    local: {
      async get() {
        return {};
      },
      async set() {},
    },
  },
};

const {
  discoverFederationMode,
  processFederationForScore,
} = await import("../src/inference/federation-client.js");

test("discovers peer mode first", async () => {
  const fetchImpl = async (url) => {
    if (String(url).endsWith("/health")) {
      return new Response("{}", { status: 200 });
    }
    return new Response("{}", { status: 404 });
  };
  assert.equal(await discoverFederationMode(fetchImpl), "peer");
});

test("processFederationForScore adds lookup badge data and submits mixed claim", async () => {
  storage.federationEnabled = true;
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith("/health")) {
      return new Response("{}", { status: 200 });
    }
    if (String(url).includes("/lookup/")) {
      return Response.json({
        present: true,
        entry: {
          structural_hash: "h",
          peer_count: 3,
          correlation_boosted: true,
        },
      });
    }
    if (String(url).endsWith("/flag")) {
      return Response.json({ accepted: true });
    }
    return new Response("{}", { status: 404 });
  };
  const scoreResult = {
    content_type: "factual",
    claims: [
      {
        id: "c1",
        verdict: "mixed",
        feature_breakdown: {
          root_depth: 0.2,
          source_independence: 0.1,
          rhetorical_red_flags: 0.9,
          citation_chain_closure: 0.2,
          claim_falsifiability: 0,
        },
      },
    ],
  };
  const out = await processFederationForScore(scoreResult, fetchImpl);
  assert.equal(out.claims[0].federation.correlation_boosted, true);
  assert.ok(calls.some((call) => call.url.endsWith("/flag")));
});
