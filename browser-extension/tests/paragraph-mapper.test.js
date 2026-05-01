import test from "node:test";
import assert from "node:assert/strict";

import { findSegmentForCharRange } from "../src/content/paragraph-mapper.js";

test("findSegmentForCharRange chooses segment with largest overlap", () => {
  const segments = [
    { index: 0, char_start: 0, char_end: 50 },
    { index: 1, char_start: 52, char_end: 120 },
  ];
  assert.equal(findSegmentForCharRange(segments, 80, 100).index, 1);
});

test("findSegmentForCharRange falls back to containing start", () => {
  const segments = [{ index: 0, char_start: 10, char_end: 20 }];
  assert.equal(findSegmentForCharRange(segments, 12, 12).index, 0);
});
