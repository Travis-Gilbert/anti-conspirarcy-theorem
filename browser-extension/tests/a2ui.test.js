import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildEvidenceScene,
  buildModelAdjustedEvidenceScene,
  validateEvidenceScene,
} from "../src/inference/a2ui.js";
import {
  ALWAYS_PRESENT_COMPONENTS,
  CALIBRATION_SOURCES,
  COMPONENT_CALIBRATION_BADGE,
  COMPONENT_CLAIM_CARD,
  COMPONENT_CONTRADICTION_PANEL,
  COMPONENT_MODEL_EXPLANATION_PANEL,
  COMPONENT_NEXT_CHECKS,
  COMPONENT_SOURCE_COLLAPSE_PANEL,
  REQUIRED_PROPS_BY_COMPONENT,
  SCENE_NAME,
  SCENE_VERSION,
} from "../src/inference/schemas.js";

function fakeRule(id, opts = {}) {
  return {
    id,
    passed: opts.passed ?? true,
    value: opts.value ?? 0.8,
    threshold: opts.threshold ?? 0.5,
    reason: opts.reason ?? `Reason for ${id}`,
  };
}

function fakeAction(id, priority = "high") {
  return { id, priority, reason: `${id} reason` };
}

function fakeStrongScoreResult() {
  return {
    overall_score: 0.78,
    verdict: "trustworthy",
    linear_score: 0.7,
    geometric_core: 0.62,
    penalty_total: 0.0,
    rules: [fakeRule("requires_independent_sources", { value: 0.8 })],
    penalties: [],
    actions: [],
    content_type: "factual",
    weight_profile_used: "factual",
    features: {
      claim_specificity: 0.7,
      root_depth: 0.65,
      source_independence: 0.8,
      evidence_volume: 0.7,
      external_support_ratio: 0.6,
      temporal_spread: 0.55,
      consensus_alignment: 0.9,
      source_tier: 0.7,
      rhetorical_red_flags: 0.95,
      citation_chain_closure: 0.85,
      claim_falsifiability: 0.7,
    },
    claims: [
      {
        id: "claim_1",
        text: "On Jan 14 2026, NASA reported a 12 percent rise.",
        score: 0.78,
        verdict: "trustworthy",
        linear_score: 0.7,
        geometric_core: 0.62,
        penalty_total: 0.0,
        rules: [fakeRule("requires_independent_sources", { value: 0.8 })],
        penalties: [],
        actions: [],
        feature_breakdown: {
          claim_specificity: 0.7,
          root_depth: 0.65,
          source_independence: 0.8,
          evidence_volume: 0.7,
          external_support_ratio: 0.6,
          temporal_spread: 0.55,
          consensus_alignment: 0.9,
          source_tier: 0.7,
          rhetorical_red_flags: 0.95,
          citation_chain_closure: 0.85,
          claim_falsifiability: 0.7,
        },
      },
    ],
    meta: { algorithm_version: "2.1.0" },
  };
}

function fakeWeakScoreResult() {
  return {
    overall_score: 0.21,
    verdict: "unreliable",
    linear_score: 0.2,
    geometric_core: 0.1,
    penalty_total: 0.4,
    rules: [fakeRule("requires_independent_sources", { passed: false, value: 0.1 })],
    penalties: [
      {
        id: "single_source_collapse",
        severity: 0.7,
        weight: 0.2,
        impact: 0.14,
        reason: "Supporting evidence collapses into too little source independence.",
      },
    ],
    actions: [fakeAction("request_independent_source"), fakeAction("defer_promotion")],
    content_type: "factual",
    weight_profile_used: "factual",
    features: {
      claim_specificity: 0.1,
      root_depth: 0.1,
      source_independence: 0.1,
      evidence_volume: 0.1,
      external_support_ratio: 0.1,
      temporal_spread: 0.05,
      consensus_alignment: 0.2,
      source_tier: 0.2,
      rhetorical_red_flags: 0.4,
      citation_chain_closure: 0.2,
      claim_falsifiability: 0.0,
    },
    claims: [
      {
        id: "claim_1",
        text: "They hid it.",
        score: 0.21,
        verdict: "unreliable",
        linear_score: 0.2,
        geometric_core: 0.1,
        penalty_total: 0.4,
        rules: [fakeRule("requires_independent_sources", { passed: false, value: 0.1 })],
        penalties: [
          {
            id: "single_source_collapse",
            severity: 0.7,
            weight: 0.2,
            impact: 0.14,
            reason: "Supporting evidence collapses into too little source independence.",
          },
        ],
        actions: [fakeAction("request_independent_source"), fakeAction("defer_promotion")],
        feature_breakdown: {
          claim_specificity: 0.1,
          root_depth: 0.1,
          source_independence: 0.1,
          evidence_volume: 0.1,
          external_support_ratio: 0.1,
          temporal_spread: 0.05,
          consensus_alignment: 0.2,
          source_tier: 0.2,
          rhetorical_red_flags: 0.4,
          citation_chain_closure: 0.2,
          claim_falsifiability: 0.0,
        },
      },
    ],
    meta: { algorithm_version: "2.1.0" },
  };
}

// ----- envelope -------------------------------------------------------------

test("scene has required envelope fields", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  assert.equal(scene.scene, SCENE_NAME);
  assert.equal(scene.version, SCENE_VERSION);
  assert.equal(scene.claim_count, 1);
  assert.ok(Array.isArray(scene.components));
  assert.equal(scene.summary, "");
});

test("scene round-trips through JSON without raising", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const json = JSON.stringify(scene);
  const parsed = JSON.parse(json);
  assert.equal(parsed.scene, SCENE_NAME);
});

test("strong score result builds a scene that passes the validator", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const errors = validateEvidenceScene(scene);
  assert.deepEqual(errors, []);
});

test("weak score result builds a scene that passes the validator", () => {
  const scene = buildEvidenceScene(fakeWeakScoreResult());
  const errors = validateEvidenceScene(scene);
  assert.deepEqual(errors, []);
});

test("model-adjusted builder emits explanation panel and badge source", () => {
  const scene = buildModelAdjustedEvidenceScene(
    fakeStrongScoreResult(),
    {
      claim_1: {
        summary: "The model highlights the independent source branches.",
        citations: ["claim_1", "  "],
      },
    },
    { summary: "The claim is strongly supported after model-side explanation." },
  );

  const panel = scene.components.find((c) => c.type === COMPONENT_MODEL_EXPLANATION_PANEL);
  const badge = scene.components.find((c) => c.type === COMPONENT_CALIBRATION_BADGE);

  assert.ok(panel, "expected ModelExplanationPanel");
  assert.equal(panel.props.summary, "The model highlights the independent source branches.");
  assert.deepEqual(panel.props.citations, ["claim_1"]);
  assert.equal(badge.props.source, "model-adjusted");
  assert.ok(scene.summary.startsWith("The claim is strongly supported"));
  assert.deepEqual(validateEvidenceScene(scene), []);
});

// ----- always-present components -------------------------------------------

test("every claim has all always-present components", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const byClaim = new Map();
  for (const component of scene.components) {
    if (component.type === COMPONENT_CLAIM_CARD) {
      byClaim.set(component.props.claim_id, new Set());
    }
  }
  for (const component of scene.components) {
    if (component.type === COMPONENT_CLAIM_CARD) {
      continue;
    }
    const claimId = component.id.slice(component.id.indexOf(".") + 1);
    if (!byClaim.has(claimId)) {
      byClaim.set(claimId, new Set());
    }
    byClaim.get(claimId).add(component.type);
  }
  for (const [claimId, present] of byClaim) {
    for (const required of ALWAYS_PRESENT_COMPONENTS) {
      if (required === COMPONENT_CLAIM_CARD) continue;
      assert.ok(present.has(required), `claim ${claimId} missing ${required}`);
    }
  }
});

// ----- conditional components ---------------------------------------------

test("source collapse panel appears when citation_chain_closure is low", () => {
  const result = fakeWeakScoreResult();
  result.claims[0].feature_breakdown.citation_chain_closure = 0.1;
  result.features.citation_chain_closure = 0.1;
  const scene = buildEvidenceScene(result);
  const panel = scene.components.find((c) => c.type === COMPONENT_SOURCE_COLLAPSE_PANEL);
  assert.ok(panel, "expected SourceCollapsePanel");
  assert.ok(panel.props.warning.includes("canonical") || panel.props.warning.includes("origin"));
});

test("source collapse panel absent when citation chain closure is healthy", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const panel = scene.components.find((c) => c.type === COMPONENT_SOURCE_COLLAPSE_PANEL);
  assert.equal(panel, undefined);
});

test("contradiction panel appears when consensus alignment is low", () => {
  const result = fakeWeakScoreResult();
  result.claims[0].feature_breakdown.consensus_alignment = 0.1;
  const scene = buildEvidenceScene(result);
  const panel = scene.components.find((c) => c.type === COMPONENT_CONTRADICTION_PANEL);
  assert.ok(panel, "expected ContradictionPanel");
  assert.ok(panel.props.contradiction_count >= 1);
});

test("contradiction panel absent when consensus alignment is healthy", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const panel = scene.components.find((c) => c.type === COMPONENT_CONTRADICTION_PANEL);
  assert.equal(panel, undefined);
});

// ----- validator catches drops --------------------------------------------

test("validator reports missing envelope field", () => {
  const errors = validateEvidenceScene({ scene: SCENE_NAME, version: SCENE_VERSION, claim_count: 1 });
  assert.ok(errors.some((e) => e.includes("components")));
});

test("validator reports unknown component type", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  scene.components.push({ type: "NotAComponent", id: "NotAComponent.x", props: {} });
  const errors = validateEvidenceScene(scene);
  assert.ok(errors.some((e) => e.includes("unknown type")));
});

test("validator reports missing required prop", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  for (const c of scene.components) {
    if (c.type === COMPONENT_CLAIM_CARD) {
      delete c.props.verification_gap;
      break;
    }
  }
  const errors = validateEvidenceScene(scene);
  assert.ok(errors.some((e) => e.includes("verification_gap")));
});

test("validator rejects invalid calibration source", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  for (const c of scene.components) {
    if (c.type === COMPONENT_CALIBRATION_BADGE) {
      c.props.source = "made-up-source";
      break;
    }
  }
  const errors = validateEvidenceScene(scene);
  assert.ok(errors.some((e) => e.includes("CalibrationBadge") && e.includes("invalid source")));
});

test("validator rejects model explanation with deterministic badge", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  const badgeIndex = scene.components.findIndex((c) => c.type === COMPONENT_CALIBRATION_BADGE);
  scene.components.splice(badgeIndex, 0, {
    type: COMPONENT_MODEL_EXPLANATION_PANEL,
    id: "ModelExplanationPanel.claim_1",
    props: { summary: "Model-generated explanation should change calibration source." },
  });

  const errors = validateEvidenceScene(scene);
  assert.ok(
    errors.some((e) => e.includes("ModelExplanationPanel") && e.includes("model-adjusted")),
  );
});

test("validator reports claim_count mismatch", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  scene.claim_count = 99;
  const errors = validateEvidenceScene(scene);
  assert.ok(errors.some((e) => e.includes("claim_count")));
});

test("validator reports claim missing required component", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult());
  scene.components = scene.components.filter((c) => c.type !== COMPONENT_NEXT_CHECKS);
  const errors = validateEvidenceScene(scene);
  assert.ok(errors.some((e) => e.includes("NextChecks")));
});

// ----- buildEvidenceScene options ------------------------------------------

test("buildEvidenceScene accepts model-adjusted calibration source", () => {
  const scene = buildEvidenceScene(fakeStrongScoreResult(), { calibrationSource: "model-adjusted" });
  const badge = scene.components.find((c) => c.type === COMPONENT_CALIBRATION_BADGE);
  assert.equal(badge.props.source, "model-adjusted");
});

test("buildEvidenceScene rejects invalid calibration source", () => {
  assert.throws(
    () => buildEvidenceScene(fakeStrongScoreResult(), { calibrationSource: "fabricated" }),
    /invalid calibrationSource/,
  );
});

test("CALIBRATION_SOURCES contains the only allowed values", () => {
  assert.deepEqual([...CALIBRATION_SOURCES].sort(), ["deterministic", "model-adjusted"]);
});

// ----- empty score result ---------------------------------------------------

test("buildEvidenceScene falls back to article_overall when no claims extracted", () => {
  const result = fakeStrongScoreResult();
  result.claims = [];
  const scene = buildEvidenceScene(result);
  assert.equal(scene.claim_count, 1);
  const card = scene.components.find((c) => c.type === COMPONENT_CLAIM_CARD);
  assert.equal(card.props.claim_id, "article_overall");
  const errors = validateEvidenceScene(scene);
  assert.deepEqual(errors, []);
});

test("REQUIRED_PROPS_BY_COMPONENT covers every emitted component type", () => {
  const scene = buildEvidenceScene(fakeWeakScoreResult());
  for (const component of scene.components) {
    assert.ok(
      REQUIRED_PROPS_BY_COMPONENT[component.type],
      `component type ${component.type} must be declared in REQUIRED_PROPS_BY_COMPONENT`,
    );
  }
});
