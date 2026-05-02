import test from "node:test";
import assert from "node:assert/strict";

import { MLCRunner } from "../src/inference/mlc-runner.js";

function fakeEngine(responses) {
  const requests = [];
  return {
    requests,
    chat: {
      completions: {
        async create(request) {
          requests.push(request);
          const content = responses.shift();
          return {
            choices: [
              {
                message: { content },
              },
            ],
          };
        },
      },
    },
  };
}

test("MLCRunner initializes WebLLM with a concrete app config", async () => {
  const progressEvents = [];
  let createArgs = null;
  const engine = fakeEngine([]);
  const runner = new MLCRunner("https://model.example/act", {
    modelId: "test-model-q4f16_1-MLC",
    modelLibUrl: "https://model.example/act/test-model.wasm",
    onProgress: (progress) => progressEvents.push(progress),
    createEngine: async (modelId, config, chatOpts) => {
      createArgs = { modelId, config, chatOpts };
      config.initProgressCallback({ progress: 0.4, text: "Fetching params" });
      return engine;
    },
  });

  const initialized = await runner.initialize();

  assert.equal(initialized, runner);
  assert.equal(runner.getState(), "ready");
  assert.equal(createArgs.modelId, "test-model-q4f16_1-MLC");
  assert.equal(createArgs.config.appConfig.useIndexedDBCache, true);
  assert.equal(createArgs.config.appConfig.model_list[0].model, "https://model.example/act");
  assert.equal(createArgs.config.appConfig.model_list[0].model_lib, "https://model.example/act/test-model.wasm");
  assert.equal(createArgs.config.appConfig.model_list[0].overrides.context_window_size, 4096);
  assert.equal(createArgs.config.appConfig.model_list[0].required_features[0], "shader-f16");
  assert.equal(progressEvents[1].percent, 40);
  assert.equal(runner.getLoadProgress().stage, "ready");
});

test("MLCRunner falls back when hosted custom model assets are missing", async () => {
  let createArgs = null;
  const engine = fakeEngine([]);
  const runner = new MLCRunner("https://bad.example/act", {
    modelId: "custom-model-q4f16_1-MLC",
    modelLibUrl: "https://bad.example/act/custom.wasm",
    fallbackModelId: "fallback-model-q4f16_1-MLC",
    fallbackManifestUrl: "https://good.example/fallback",
    fallbackModelLibUrl: "https://good.example/fallback.wasm",
    preflightFetch: async () => new Response("", { status: 404 }),
    createEngine: async (modelId, config) => {
      createArgs = { modelId, config };
      return engine;
    },
  });

  await runner.initialize();

  assert.equal(createArgs.modelId, "fallback-model-q4f16_1-MLC");
  assert.equal(createArgs.config.appConfig.model_list[0].model, "https://good.example/fallback");
  assert.equal(createArgs.config.appConfig.model_list[0].model_lib, "https://good.example/fallback.wasm");
  assert.equal(runner.getModelInfo().fallback_active, true);
  assert.match(runner.getModelInfo().fallback_reason, /MLC model manifest unavailable/);
});

test("classifyContent retries malformed JSON and normalizes confidence", async () => {
  const engine = fakeEngine([
    "not json",
    "{\"content_type\":\"editorial\",\"confidence\":82,\"rationale\":\"argumentative framing\"}",
  ]);
  const runner = new MLCRunner("https://model.example/act", {
    createEngine: async () => engine,
    parseRetries: 1,
    timeoutMs: 1000,
  });

  const result = await runner.classifyContent("I believe this editorial should be read as argument.");

  assert.equal(result.content_type, "opinion");
  assert.equal(result.confidence, 0.82);
  assert.equal(result.rationale, "argumentative framing");
  assert.equal(engine.requests.length, 2);
  assert.equal(engine.requests[0].response_format.type, "json_object");
  assert.match(engine.requests[1].messages.at(-1).content, /valid JSON/);
});

test("extractFeatures normalizes model output into scoring extraction shape", async () => {
  const articleText = "A 2024 court filing reported that three agencies measured emissions in the river basin.";
  const engine = fakeEngine([
    JSON.stringify({
      claims: [
        {
          text: articleText,
          specificity_anchors: ["2024", "court filing", "emissions"],
          citation_kind: "direct_primary",
          cited_source_refs: ["s1"],
          contradicts_consensus: null,
          engages_consensus: true,
          source_tier_refs: ["s1"],
          citation_chain_markers: {
            self_reinforcing_citations: 0,
            total_citation_chains_described: 2,
          },
          falsifiability: "falsifiable",
        },
      ],
      article_level: {
        checkable_facts_per_paragraph: [3],
        rhetorical_red_flags: {
          urgency_framing: true,
        },
      },
      cited_sources: [
        {
          id: "s1",
          domain: "https://example.org/report",
          name: "Court filing",
          tier: "primary",
        },
      ],
    }),
  ]);
  const runner = new MLCRunner("https://model.example/act", {
    createEngine: async () => engine,
    timeoutMs: 1000,
  });

  const extraction = await runner.extractFeatures(articleText, "factual", {
    url: "https://example.org/story",
    title: "Example",
  });

  assert.equal(extraction.claims.length, 1);
  assert.equal(extraction.claims[0].id, "c0");
  assert.equal(extraction.claims[0].char_start, 0);
  assert.equal(extraction.claims[0].char_end, articleText.length);
  assert.deepEqual(extraction.claims[0].cited_source_refs, ["s1"]);
  assert.equal(extraction.claims[0].citation_kind, "direct_primary");
  assert.equal(extraction.article_level.rhetorical_red_flags.urgency_framing, 1);
  assert.equal(extraction.article_level.rhetorical_red_flags.false_precision, 0);
  assert.equal(extraction.cited_sources[0].domain, "example.org");
});
