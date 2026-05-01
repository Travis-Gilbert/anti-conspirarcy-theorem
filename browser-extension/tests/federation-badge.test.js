import test from "node:test";
import assert from "node:assert/strict";

import { renderFederationBadge } from "../src/content/claim-panel.js";

test("renders federation badge only for boosted entries", () => {
  assert.equal(renderFederationBadge({}), "");
  const html = renderFederationBadge({
    federation: {
      catalog_entry: {
        correlation_boosted: true,
        peer_count: 3,
        updated_at: "2026-04-24T00:00:00Z",
        structural_hash: "a".repeat(64),
      },
    },
  });
  assert.match(html, /Flagged by 3 peers/);
  assert.match(html, /View on the network/);
  assert.match(html, /target="_blank"/);
});

test("escapes federation badge catalog metadata", () => {
  const html = renderFederationBadge({
    federation: {
      structural_hash: "b".repeat(64),
      catalog_entry: {
        correlation_boosted: true,
        peer_count: 2,
        updated_at: '" onmouseover="alert(1)',
      },
    },
  });
  assert.doesNotMatch(html, /onmouseover="alert/);
  assert.match(html, /&quot; onmouseover=&quot;alert/);
  assert.match(html, /\/entry\/bbbb/);
});
