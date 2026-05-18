import test from "node:test";
import assert from "node:assert/strict";

import {
  binsFromFeatureBreakdown,
  computeAccStructuralHashV2,
} from "../src/inference/structural-hash.js";

test("ACC v2.1 structural hash matches Python contract", async () => {
  const bins = {
    root_depth: 1,
    source_independence: 0,
    rhetorical_red_flags: 4,
    citation_chain_closure: 1,
    claim_falsifiability: 0,
  };
  assert.equal(
    await computeAccStructuralHashV2({ contentType: "factual", bins }),
    "ef7ed09cba94c219eab12049e7c9d3b6ea4a9f7cbb40ea38192b6ac1c89c26ea",
  );
});

test("feature breakdown maps to five hash bins", () => {
  assert.deepEqual(
    binsFromFeatureBreakdown({
      root_depth: 0.2,
      source_independence: 0.1,
      rhetorical_red_flags: 0.9,
      citation_chain_closure: 0.2,
      claim_falsifiability: 0,
    }),
    {
      root_depth: 1,
      source_independence: 0,
      rhetorical_red_flags: 4,
      citation_chain_closure: 1,
      claim_falsifiability: 0,
    },
  );
});
