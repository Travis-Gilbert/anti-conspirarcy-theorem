import test from "node:test";
import assert from "node:assert/strict";

import { FIXTURES } from "../src/inference/data/contract_fixtures.js";
import { renderClaimMiniGraph } from "../src/inference/mini-graph-render.js";

const ALLOWED_COLORS = new Set(["#4A8A96", "#C49A4A", "#C4503C", "#1A1A1A", "#F4F3F0", "#7B8EA0"]);

function sampleClaim() {
  const fixture = FIXTURES.find((item) => item.expected_score_result.claims.length > 0);
  return fixture.expected_score_result.claims[0];
}

test("svg is deterministic for same input", () => {
  const claim = sampleClaim();
  const svg1 = renderClaimMiniGraph(claim);
  const svg2 = renderClaimMiniGraph(claim);
  assert.equal(svg1, svg2);
});

test("svg starts with required header", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  assert.ok(svg.startsWith('<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">'));
});

test("svg contains expected viewbox dimensions", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  assert.ok(svg.includes('viewBox="0 0 320 240"'));
});

test("element ordering contract", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  const idxBg = svg.indexOf('class="bg"');
  const idxStyle = svg.indexOf("<style>");
  const idxReference = svg.indexOf('class="reference-poly"');
  const idxClaimPoly = svg.indexOf('class="claim-poly"');
  const idxDivider = svg.indexOf('class="divider"');
  const idxClaimNode = svg.indexOf('class="claim-node"');
  assert.ok(idxBg < idxStyle && idxStyle < idxReference && idxReference < idxClaimPoly && idxClaimPoly < idxDivider && idxDivider < idxClaimNode);
});

test("null feature markers render x shape", () => {
  const fixture = FIXTURES.find((item) => item.id === "null_temporal_spread");
  const claim = fixture.expected_score_result.claims[0];
  const svg = renderClaimMiniGraph(claim);
  assert.ok(svg.split('class="null-mark"').length - 1 >= 2);
});

test("source node count is capped at eight", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  assert.ok(svg.split('class="source-node"').length - 1 <= 8);
});

test("accessibility elements present", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  assert.ok(svg.includes("<title>"));
  assert.ok(svg.includes("<desc>"));
});

test("svg uses only allowed color tokens", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  const matches = svg.match(/#[0-9A-Fa-f]{6}/g) || [];
  assert.ok(matches.length > 0);
  for (const color of matches) {
    assert.ok(ALLOWED_COLORS.has(color));
  }
});

test("svg has no external references", () => {
  const svg = renderClaimMiniGraph(sampleClaim());
  assert.equal(svg.split("http://www.w3.org/2000/svg").length - 1, 1);
  assert.equal(svg.includes("https://"), false);
});
