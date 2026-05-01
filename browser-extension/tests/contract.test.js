import test from "node:test";
import assert from "node:assert/strict";

import { FIXTURES } from "../src/inference/data/contract_fixtures.js";
import { scoreText } from "../src/inference/scoring.js";
import { renderClaimMiniGraph } from "../src/inference/mini-graph-render.js";
import { loadDomainList } from "../src/inference/domain-list.js";

await loadDomainList();

test("all fixtures match deterministic scoring contract", () => {
  for (const fixture of FIXTURES) {
    const got = scoreText(
      fixture.extraction,
      fixture.tavily_result,
      fixture.content_type,
      fixture.content_confidence,
    );

    assert.equal(got.overall_score, fixture.expected_score_result.overall_score, `overall score mismatch for ${fixture.id}`);

    const expectedFeatures = fixture.expected_score_result.features;
    if (expectedFeatures) {
      for (const [key, value] of Object.entries(expectedFeatures)) {
        assert.equal(got.features[key], value, `feature ${key} mismatch for ${fixture.id}`);
      }
    }

    assert.equal(got.claims.length, fixture.expected_score_result.claims.length, `claim length mismatch for ${fixture.id}`);

    for (let idx = 0; idx < got.claims.length; idx += 1) {
      const gotClaim = got.claims[idx];
      const expectedClaim = fixture.expected_score_result.claims[idx];
      assert.equal(gotClaim.score, expectedClaim.score, `claim score mismatch for ${fixture.id} claim ${idx}`);
      assert.equal(gotClaim.verdict, expectedClaim.verdict, `claim verdict mismatch for ${fixture.id} claim ${idx}`);

      const expectedSvg = fixture.expected_svg[idx];
      assert.equal(gotClaim.mini_graph_svg, expectedSvg, `claim mini graph mismatch for ${fixture.id} claim ${idx}`);
      assert.equal(renderClaimMiniGraph(gotClaim), expectedSvg, `renderer mini graph mismatch for ${fixture.id} claim ${idx}`);
    }
  }
});
