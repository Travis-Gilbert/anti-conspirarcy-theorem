import test from "node:test";
import assert from "node:assert/strict";

import { stackRailDots } from "../src/content/gutter-rail.js";

test("stackRailDots keeps close claim dots from overlapping", () => {
  const dots = stackRailDots([
    { top: 20, claim: { id: "a" } },
    { top: 25, claim: { id: "b" } },
    { top: 80, claim: { id: "c" } },
  ]);

  assert.deepEqual(dots.map((dot) => dot.top), [20, 38, 80]);
});

test("stackRailDots sorts by viewport top and clamps to rail minimum", () => {
  const dots = stackRailDots([
    { top: 50, claim: { id: "b" } },
    { top: -10, claim: { id: "a" } },
  ]);

  assert.deepEqual(dots.map((dot) => dot.claim.id), ["a", "b"]);
  assert.equal(dots[0].top, 18);
});
