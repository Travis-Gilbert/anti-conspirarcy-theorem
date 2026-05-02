import test from "node:test";
import assert from "node:assert/strict";

import {
  buildClassifyPrompt,
  buildExtractPrompt,
  clipPromptText,
  normalizeClassification,
  normalizeExtraction,
  parseModelJson,
} from "../src/inference/gemma-prompts.js";

test("prompt builders preserve exported task templates and clip page text", () => {
  const longText = "alpha ".repeat(5000);
  const clipped = clipPromptText(longText, 32);
  const classifyPrompt = buildClassifyPrompt(longText, { maxChars: 32 });
  const extractPrompt = buildExtractPrompt("A precise claim.", "opinion");

  assert.equal(clipped.length <= 32, true);
  assert.match(classifyPrompt, /<\|classify\|>/);
  assert.match(classifyPrompt, /Return exactly one JSON object/);
  assert.match(classifyPrompt, /Now classify this input:\nalpha/);
  assert.equal(classifyPrompt.includes(longText), false);
  assert.match(extractPrompt, /<\|extract\|>/);
  assert.match(extractPrompt, /content_type: opinion/);
  assert.match(extractPrompt, /specificity_anchors/);
});

test("parseModelJson accepts fenced JSON and prose-wrapped JSON", () => {
  assert.deepEqual(parseModelJson("```json\n{\"ok\":true}\n```"), { ok: true });
  assert.deepEqual(parseModelJson("Here is the JSON: {\"ok\":true,\"nested\":{\"n\":1}}"), {
    ok: true,
    nested: { n: 1 },
  });
  assert.throws(() => parseModelJson("no object here"), /JSON object/);
});

test("classification normalizer maps aliases and clamps probability values", () => {
  assert.deepEqual(normalizeClassification({
    label: "news",
    probability: 97,
    reason: "reported facts",
  }), {
    content_type: "factual",
    confidence: 0.97,
    rationale: "reported facts",
  });
});

test("extraction normalizer fills missing optional fields without inventing claim citations", () => {
  const text = "The 2026 survey measured 41 percent adoption across hospitals.";
  const extraction = normalizeExtraction({
    claims: [
      {
        claim: text,
        anchors: ["2026", "41 percent", "hospitals"],
      },
    ],
    article_level: {
      rhetorical_red_flags: ["false_precision"],
    },
  }, text, {
    url: "https://example.org/report",
    title: "Report",
  });

  assert.equal(extraction.claims[0].citation_kind, "unanchored");
  assert.deepEqual(extraction.claims[0].cited_source_refs, []);
  assert.equal(extraction.claims[0].falsifiability, "falsifiable");
  assert.equal(extraction.article_level.checkable_facts_per_paragraph.length, 1);
  assert.equal(extraction.article_level.rhetorical_red_flags.false_precision, 1);
  assert.equal(extraction.cited_sources[0].id, "page-source");
  assert.equal(extraction.cited_sources[0].domain, "example.org");
});

test("extraction normalizer preserves citations when source ids need cleaning", () => {
  const extraction = normalizeExtraction({
    claims: [
      {
        text: "A court filing reported the measured result.",
        cited_source_refs: ["Court Filing 1"],
        source_tier_refs: ["Court Filing 1"],
      },
    ],
    cited_sources: [
      {
        id: "Court Filing 1",
        domain: "court.example",
        name: "Court filing",
        tier: "primary",
      },
    ],
  });

  assert.equal(extraction.cited_sources[0].id, "Court-Filing-1");
  assert.deepEqual(extraction.claims[0].cited_source_refs, ["Court-Filing-1"]);
  assert.deepEqual(extraction.claims[0].source_tier_refs, ["Court-Filing-1"]);
  assert.equal(extraction.claims[0].citation_kind, "secondary");
});

test("extraction normalizer preserves self reinforcing citation counts", () => {
  const extraction = normalizeExtraction({
    claims: [
      {
        text: "Three sites cite each other as their only evidence.",
        citation_chain_markers: {
          self_reinforcing_citations: 3,
          total_citation_chains_described: 3,
        },
      },
    ],
  });

  assert.equal(extraction.claims[0].citation_chain_markers.self_reinforcing_citations, 3);
  assert.equal(extraction.claims[0].citation_chain_markers.total_citation_chains_described, 3);
});
