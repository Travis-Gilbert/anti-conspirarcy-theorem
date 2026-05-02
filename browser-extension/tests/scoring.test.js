import test from "node:test";
import assert from "node:assert/strict";

import {
  FACTUAL_WEIGHTS,
  OPINION_WEIGHTS,
  REFERENCE_WEIGHTS,
  round6,
  computeFeatureScores,
  computeOverallScore,
  computePerClaimScore,
  scoreText,
} from "../src/inference/scoring.js";
import { loadDomainList } from "../src/inference/domain-list.js";

function minimalExtraction() {
  return {
    claims: [
      {
        id: "c0",
        text: "A measured claim with a source.",
        char_start: 0,
        char_end: 30,
        specificity_anchors: ["measured", "source"],
        citation_kind: "secondary",
        cited_source_refs: ["s0"],
        contradicts_consensus: null,
        engages_consensus: true,
        source_tier_refs: ["s0"],
        citation_chain_markers: {
          self_reinforcing_citations: 0,
          total_citation_chains_described: 1,
        },
        falsifiability: "vague",
      },
    ],
    article_level: {
      checkable_facts_per_paragraph: [1],
      rhetorical_red_flags: {
        urgency_framing: 0,
        suppressed_truth_narrative: 0,
        emotional_appeal_decoupled: 0,
        identity_based_dismissal: 0,
        false_precision: 0,
        appeal_to_hidden_knowledge: 0,
      },
    },
    cited_sources: [{ id: "s0", domain: "wikipedia.org", name: "Wiki", tier: "secondary" }],
  };
}

test("weight profile factual sums to one", () => {
  assert.equal(round6(Object.values(FACTUAL_WEIGHTS).reduce((a, b) => a + b, 0)), 1);
});

test("weight profile opinion sums to one", () => {
  assert.equal(round6(Object.values(OPINION_WEIGHTS).reduce((a, b) => a + b, 0)), 1);
});

test("weight profile reference sums to one", () => {
  assert.equal(round6(Object.values(REFERENCE_WEIGHTS).reduce((a, b) => a + b, 0)), 1);
});

test("source independence defaults without citations", async () => {
  await loadDomainList();
  const extraction = minimalExtraction();
  extraction.claims[0].cited_source_refs = [];
  const features = computeFeatureScores(extraction, null);
  assert.equal(features.source_independence, 0.1);
});

test("external support ratio is clamped", async () => {
  await loadDomainList();
  const extraction = minimalExtraction();
  extraction.article_level.checkable_facts_per_paragraph = [10];
  const features = computeFeatureScores(extraction, null);
  assert.equal(features.external_support_ratio, 1.0);
});

test("temporal spread is null without tavily", async () => {
  await loadDomainList();
  const features = computeFeatureScores(minimalExtraction(), null);
  assert.equal(features.temporal_spread, null);
});

test("consensus alignment is null without judgment", async () => {
  await loadDomainList();
  const features = computeFeatureScores(minimalExtraction(), null);
  assert.equal(features.consensus_alignment, null);
});

test("compute overall score redistributes missing weights", () => {
  const features = {
    claim_specificity: 1,
    root_depth: 1,
    source_independence: 1,
    external_support_ratio: 1,
    temporal_spread: null,
    consensus_alignment: null,
    source_tier: 1,
    rhetorical_red_flags: 1,
    citation_chain_closure: 1,
    claim_falsifiability: 1,
  };
  const out = computeOverallScore(features, FACTUAL_WEIGHTS);
  assert.ok(out.score >= 0.999999);
  assert.equal(out.verdict, "trustworthy");
});

test("verdict thresholds match spec", () => {
  assert.equal(computeOverallScore({ claim_specificity: 0.7 }, { claim_specificity: 1 }).verdict, "trustworthy");
  assert.equal(computeOverallScore({ claim_specificity: 0.699999 }, { claim_specificity: 1 }).verdict, "mixed");
  assert.equal(computeOverallScore({ claim_specificity: 0.4 }, { claim_specificity: 1 }).verdict, "mixed");
  assert.equal(computeOverallScore({ claim_specificity: 0.399999 }, { claim_specificity: 1 }).verdict, "unreliable");
});

test("fiction bypass returns fiction result", () => {
  const result = scoreText(minimalExtraction(), null, "fiction", 0.95);
  assert.equal(result.verdict, "fiction");
  assert.equal(result.overall_score, null);
  assert.equal(result.features, null);
  assert.deepEqual(result.claims, []);
});

test("compute per claim score uses renormalization", () => {
  const claimFeatures = {
    claim_specificity: 0.8,
    root_depth: 0.6,
    temporal_spread: null,
    consensus_alignment: null,
    source_tier: 0.7,
    citation_chain_closure: 0.8,
    claim_falsifiability: 0.9,
  };
  const out = computePerClaimScore(claimFeatures, FACTUAL_WEIGHTS);
  assert.ok(out.score >= 0 && out.score <= 1);
  assert.ok(["trustworthy", "mixed", "unreliable"].includes(out.verdict));
});

test("round6 contract helper", () => {
  assert.equal(round6(0.123456789), 0.123457);
});

test("score text shape includes algorithm metadata", async () => {
  await loadDomainList();
  const result = scoreText(minimalExtraction(), null, "factual", 0.9);
  assert.equal(result.meta.algorithm_version, "2.0.0");
  assert.ok(["factual", "opinion", "reference", "fiction"].includes(result.content_type));
});

test("compute feature scores returns all feature keys", async () => {
  await loadDomainList();
  const features = computeFeatureScores(minimalExtraction(), null);
  const keys = Object.keys(features).sort();
  assert.deepEqual(keys, [
    "citation_chain_closure",
    "claim_falsifiability",
    "claim_specificity",
    "consensus_alignment",
    "evidence_volume",
    "external_support_ratio",
    "rhetorical_red_flags",
    "root_depth",
    "source_independence",
    "source_tier",
    "temporal_spread",
  ]);
});

test("score text creates claim mini graph strings", async () => {
  await loadDomainList();
  const result = scoreText(minimalExtraction(), null, "factual", 0.9);
  assert.equal(typeof result.claims[0].mini_graph_svg, "string");
  assert.ok(result.claims[0].mini_graph_svg.startsWith('<svg viewBox="0 0 320 240"'));
});

test("score text includes deterministic ACC v2 trace fields", async () => {
  await loadDomainList();
  const result = scoreText(minimalExtraction(), null, "factual", 0.9);
  assert.equal(typeof result.linear_score, "number");
  assert.equal(typeof result.geometric_core, "number");
  assert.equal(typeof result.penalty_total, "number");
  assert.ok(Array.isArray(result.rules));
  assert.ok(Array.isArray(result.penalties));
  assert.ok(Array.isArray(result.actions));
  assert.equal(typeof result.claims[0].feature_breakdown.evidence_volume, "number");
  assert.ok(Array.isArray(result.claims[0].rules));
});
