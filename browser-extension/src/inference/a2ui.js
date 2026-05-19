/**
 * Strict EvidenceCockpit A2UI scene validator and builder for the browser
 * extension side. Mirrors theseus_acc/a2ui.py.
 *
 * The validator is the security boundary that rejects Gemma output that
 * drops props, alters ACC scores, or invents claim ids. The builder
 * converts the existing scoring.js article-level + per-claim output into
 * the same scene shape the Python builder emits, optionally layering
 * model-written explanation panels on top of deterministic ACC scores.
 *
 * Shape contract is documented in docs/a2ui-scene-schema.md.
 */

import { ALGORITHM_VERSION } from "../shared/config.js";
import {
  ALWAYS_PRESENT_COMPONENTS,
  CALIBRATION_SOURCES,
  COMPONENT_CALIBRATION_BADGE,
  COMPONENT_CLAIM_CARD,
  COMPONENT_CONTRADICTION_PANEL,
  COMPONENT_MODEL_EXPLANATION_PANEL,
  COMPONENT_NEXT_CHECKS,
  COMPONENT_PENALTY_LIST,
  COMPONENT_RULE_CHECKLIST,
  COMPONENT_SOURCE_COLLAPSE_PANEL,
  COMPONENT_TRAIT_RADAR,
  REQUIRED_PROPS_BY_COMPONENT,
  SCENE_NAME,
  SCENE_REQUIRED_FIELDS,
  SCENE_VERSION,
} from "./schemas.js";

function round6(n) {
  return Number(Number(n).toFixed(6));
}

function clamp01(n) {
  return round6(Math.max(0, Math.min(1, Number(n))));
}

const CANONICAL_TRAIT_KEYS = [
  "root_depth",
  "source_independence",
  "support_ratio",
  "claim_specificity",
  "temporal_spread",
  "evidence_volume",
  "falsifiability",
  "rhetorical_pressure",
  "source_quality",
  "contradiction_load",
  "citation_chain_collapse",
];

function firstFinite(...values) {
  for (const value of values) {
    if (value != null && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function withCanonicalTraits(features) {
  const out = { ...(features || {}) };
  const external = firstFinite(out.external_support_ratio);
  const consensus = firstFinite(out.consensus_alignment);
  if (out.support_ratio == null) {
    if (external != null && consensus != null) {
      out.support_ratio = clamp01(Math.min(external, consensus));
    } else if (external != null || consensus != null) {
      out.support_ratio = clamp01(external ?? consensus);
    }
  }
  const aliases = {
    falsifiability: firstFinite(out.falsifiability, out.claim_falsifiability),
    rhetorical_pressure: firstFinite(out.rhetorical_pressure, out.rhetorical_red_flags),
    source_quality: firstFinite(out.source_quality, out.source_tier),
    contradiction_load: firstFinite(out.contradiction_load, out.consensus_alignment, 1),
    citation_chain_collapse: firstFinite(out.citation_chain_collapse, out.citation_chain_closure),
  };
  for (const [key, value] of Object.entries(aliases)) {
    if (out[key] == null && value != null) {
      out[key] = clamp01(value);
    }
  }
  return out;
}

function makeComponent(type, claimId, props) {
  return {
    type,
    id: `${type}.${claimId}`,
    props,
  };
}

function normalizeModelExplanations(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}

function modelExplanationProps(value) {
  let summary = "";
  let citations = [];

  if (typeof value === "string") {
    summary = value.trim();
  } else if (value && typeof value === "object" && !Array.isArray(value)) {
    summary = String(value.summary ?? "").trim();
    if (Array.isArray(value.citations)) {
      citations = value.citations.map((item) => String(item).trim()).filter(Boolean);
    }
  } else {
    return null;
  }

  if (!summary) {
    return null;
  }

  const props = { summary };
  if (citations.length) {
    props.citations = citations;
  }
  return props;
}

function hasModelExplanation(modelExplanations) {
  return Object.values(modelExplanations).some((value) => modelExplanationProps(value));
}

/**
 * Build an EvidenceCockpit scene from scoring.js output.
 *
 * @param {object} scoreResult - The object returned by scoreText() in
 *   inference/scoring.js. Must include `claims`, `features`, `rules`,
 *   `penalties`, `actions`, `weight_profile_used`, etc.
 * @param {object} [options]
 * @param {string} [options.calibrationSource] - Defaults to "model-adjusted"
 *   when model explanations are present; otherwise "deterministic".
 * @param {object} [options.modelExplanations] - Mapping of claim id to
 *   explanation summary or `{summary, citations}` payload.
 * @param {string} [options.summary] - Optional scene-level summary.
 * @param {number} [options.threshold] - Suspect threshold; defaults to 0.55.
 * @returns {object} A JSON-serializable EvidenceCockpit scene.
 */
export function buildEvidenceScene(scoreResult, options = {}) {
  const modelExplanations = normalizeModelExplanations(
    options.modelExplanations ?? scoreResult?.model_explanations ?? scoreResult?.modelExplanations,
  );
  const calibrationSource = options.calibrationSource
    || (hasModelExplanation(modelExplanations) ? "model-adjusted" : "deterministic");
  const threshold = typeof options.threshold === "number" ? options.threshold : 0.55;
  const summary = String(options.summary ?? scoreResult?.summary ?? "").trim();

  if (!CALIBRATION_SOURCES.includes(calibrationSource)) {
    throw new Error(`invalid calibrationSource: ${calibrationSource}`);
  }

  const components = [];
  const claims = Array.isArray(scoreResult?.claims) ? scoreResult.claims : [];
  const overallTraits = scoreResult?.features ? { ...scoreResult.features } : {};
  // Resolved per-key weights are written by callers when they want them
  // surfaced inside TraitRadar.props.weights. Default to an empty object
  // so the validator's required-prop check passes without forcing a
  // circular import on scoring.js.
  const weightsByProfile = {};

  // The browser extension scores per-claim; emit one set of components
  // per claim. The article-level "overall" score is exposed through the
  // CalibrationBadge of the synthetic _article_overall claim if no real
  // claims were extracted.
  if (!claims.length) {
    const claimId = "article_overall";
    components.push(...buildComponentsForRecord({
      claimId,
      claimText: "",
      record: {
        score: scoreResult?.overall_score ?? 0,
        verdict: scoreResult?.verdict ?? "unreliable",
        rules: scoreResult?.rules ?? [],
        penalties: scoreResult?.penalties ?? [],
        actions: scoreResult?.actions ?? [],
        feature_breakdown: overallTraits,
        linear_score: scoreResult?.linear_score ?? 0,
        geometric_core: scoreResult?.geometric_core ?? 0,
        penalty_total: scoreResult?.penalty_total ?? 0,
      },
      weights: weightsByProfile,
      calibrationSource,
      modelExplanation: modelExplanationProps(modelExplanations[claimId]),
      threshold,
    }));
  } else {
    for (const claim of claims) {
      components.push(...buildComponentsForRecord({
        claimId: claim.id,
        claimText: claim.text || "",
        record: claim,
        weights: weightsByProfile,
        calibrationSource,
        modelExplanation: modelExplanationProps(modelExplanations[claim.id]),
        threshold,
      }));
    }
  }

  return {
    scene: SCENE_NAME,
    version: SCENE_VERSION,
    acc_version: ALGORITHM_VERSION,
    claim_count: claims.length || 1,
    threshold,
    summary,
    components,
  };
}

export function buildModelAdjustedEvidenceScene(scoreResult, modelExplanations, options = {}) {
  return buildEvidenceScene(scoreResult, {
    ...options,
    modelExplanations,
    calibrationSource: "model-adjusted",
  });
}

function buildComponentsForRecord({
  claimId,
  claimText,
  record,
  weights,
  calibrationSource,
  modelExplanation,
  threshold,
}) {
  const list = [];
  const features = record.feature_breakdown || {};

  list.push(
    makeComponent(COMPONENT_CLAIM_CARD, claimId, {
      claim_id: claimId,
      claim_text: claimText,
      claim_state: classifyClaimState(record, threshold),
      support_strength: round6(supportStrengthFromRecord(record)),
      epistemic_risk: round6(epistemicRiskFromRecord(record)),
      verification_gap: verificationGapFromRecord(record),
    }),
  );

  const collapseProps = sourceCollapsePropsFromRecord(record, features);
  if (collapseProps) {
    list.push(makeComponent(COMPONENT_SOURCE_COLLAPSE_PANEL, claimId, collapseProps));
  }

  list.push(
    makeComponent(COMPONENT_TRAIT_RADAR, claimId, {
      traits: roundFeatures(features),
      weights: weights || {},
    }),
  );

  list.push(
    makeComponent(COMPONENT_RULE_CHECKLIST, claimId, {
      rules: (record.rules || []).map(roundRule),
    }),
  );

  if ((record.penalties || []).length) {
    list.push(
      makeComponent(COMPONENT_PENALTY_LIST, claimId, {
        penalties: record.penalties.map(roundPenalty),
        penalty_total: round6(record.penalty_total || 0),
      }),
    );
  }

  const contradictionCount = inferContradictionCount(features);
  if (contradictionCount > 0) {
    list.push(
      makeComponent(COMPONENT_CONTRADICTION_PANEL, claimId, {
        contradiction_count: contradictionCount,
      }),
    );
  }

  list.push(
    makeComponent(COMPONENT_NEXT_CHECKS, claimId, {
      actions: (record.actions || []).map((action) => ({
        id: action.id,
        priority: action.priority,
        reason: action.reason,
      })),
    }),
  );

  if (modelExplanation) {
    list.push(makeComponent(COMPONENT_MODEL_EXPLANATION_PANEL, claimId, modelExplanation));
  }

  list.push(
    makeComponent(COMPONENT_CALIBRATION_BADGE, claimId, {
      source: calibrationSource,
      score: round6(record.score || 0),
      threshold: round6(threshold),
      version: ALGORITHM_VERSION,
    }),
  );

  return list;
}

function supportStrengthFromRecord(record) {
  if (Number.isFinite(Number(record.support_strength))) {
    return clamp01(record.support_strength);
  }
  const linear = Number(record.linear_score || 0);
  const core = Number(record.geometric_core || 0);
  return clamp01(0.65 * linear + 0.35 * core);
}

function epistemicRiskFromRecord(record) {
  if (Number.isFinite(Number(record.epistemic_risk))) {
    return clamp01(record.epistemic_risk);
  }
  // Mirrors the Python formula from compute_acc; the JS scorer does not
  // produce all five components, so use the available proxies:
  //   penalty_total / 0.45                        weight 0.40
  //   1 - source_independence (article)           weight 0.30
  //   1 - root_depth (article)                    weight 0.20
  //   1 - evidence_volume (article)               weight 0.10
  const features = withCanonicalTraits(record.feature_breakdown || {});
  const penalty = Math.min(1, Number(record.penalty_total || 0) / 0.45);
  const indep = 1 - clamp01(features.source_independence || 0);
  const rootless = 1 - clamp01(features.root_depth || 0);
  const thin = 1 - clamp01(features.evidence_volume || 0);
  return clamp01(0.4 * penalty + 0.3 * indep + 0.2 * rootless + 0.1 * thin);
}

function verificationGapFromRecord(record) {
  if (typeof record.verification_gap === "string") {
    return record.verification_gap;
  }
  const features = withCanonicalTraits(record.feature_breakdown || {});
  const independence = Number(features.source_independence ?? 1);
  const root = Number(features.root_depth ?? 0);
  const contradiction = Number(features.contradiction_load ?? features.consensus_alignment ?? 1);
  const evidence = Number(features.evidence_volume ?? 0);
  const specificity = Number(features.claim_specificity ?? 0);
  const temporal = Number(features.temporal_spread ?? 1);

  if (record.score == null && (record.rules || []).length === 0) {
    return "No supporting evidence has been linked yet.";
  }
  if (independence < 0.35 && (record.feature_breakdown?.evidence_volume ?? 0) > 0) {
    return "Multiple citations trace back to fewer canonical origins. Find an independent primary source.";
  }
  if (root < 0.25) {
    return "Needs a verified or reviewed primary root.";
  }
  if (contradiction < 0.5) {
    return "Contradiction pressure outweighs support. Adjudicate before promoting.";
  }
  if (evidence < 0.3) {
    return "Direct support volume is too low. Gather more evidence.";
  }
  if (specificity < 0.25) {
    return "Claim is too vague to adjudicate cleanly. Sharpen with concrete anchors.";
  }
  if (temporal < 0.15 && evidence >= 0.5) {
    return "Evidence collapses into a narrow time window. Broaden temporal sampling.";
  }
  return "";
}

function classifyClaimState(record, threshold) {
  if (typeof record.claim_state === "string" && record.claim_state) {
    return record.claim_state;
  }
  const features = withCanonicalTraits(record.feature_breakdown || {});
  const score = Number(record.score || 0);
  const independence = Number(features.source_independence ?? 1);
  const evidence = Number(features.evidence_volume ?? 0);
  const root = Number(features.root_depth ?? 0);
  const closure = Number(features.citation_chain_collapse ?? features.citation_chain_closure ?? 1);
  const contradiction = Number(features.contradiction_load ?? features.consensus_alignment ?? 1);
  const specificity = Number(features.claim_specificity ?? 0);
  const branchCount = (record.rules || []).find((r) => r.id === "requires_independent_sources")?.value ?? 0;

  if (score >= Math.max(0.65, threshold) && independence >= 0.5 && root >= 0.25 && contradiction >= 0.5) {
    return "well_supported";
  }
  if (closure < 0.5 && independence < 0.5) {
    return "source_collapsed";
  }
  if (contradiction < 0.5) {
    return "contradicted";
  }
  if (evidence < 0.3 || branchCount === 0) {
    return "under_evidenced";
  }
  if (root < 0.25) {
    return "rootless";
  }
  if (specificity < 0.25) {
    return "vague";
  }
  if (score < threshold) {
    return "suspect";
  }
  return "unresolved";
}

function sourceCollapsePropsFromRecord(record, features) {
  if (record.diagnostics && Number(record.diagnostics.visible_source_count || 0) >= 2) {
    const collapseRatio = clamp01(record.diagnostics.source_collapse_ratio ?? 0);
    if (collapseRatio <= 0) {
      return null;
    }
    return {
      visible_source_count: Number(record.diagnostics.visible_source_count || 0),
      canonical_origin_count: Number(record.diagnostics.canonical_origin_count || 0),
      source_collapse_ratio: round6(collapseRatio),
      warning:
        collapseRatio >= 0.5
          ? "Many citations trace back to fewer canonical origins. Find an independent primary source."
          : "Some citations share canonical origins. Worth verifying independence.",
    };
  }
  // The browser scoring path doesn't track canonical_origin counts; fall
  // back to citation_chain_closure as a proxy: closure < 0.5 indicates
  // collapse pressure. Skip the panel when no signal is present.
  const normalized = withCanonicalTraits(features);
  const closure = Number(normalized.citation_chain_collapse ?? normalized.citation_chain_closure ?? 1);
  if (closure >= 0.7) {
    return null;
  }
  // Approximate visible/canonical from independence and closure.
  // independence captures top-share; lower independence = higher collapse.
  const independence = clamp01(normalized.source_independence ?? 1);
  const visible = Math.max(2, Math.round(record.feature_breakdown?.evidence_volume * 8) || 2);
  const collapseRatio = clamp01(1 - closure);
  const canonical = Math.max(1, Math.round(visible * (1 - collapseRatio)));
  let warning;
  if (collapseRatio >= 0.5) {
    warning =
      "Many citations trace back to fewer canonical origins. Find an independent primary source.";
  } else if (collapseRatio >= 0.25) {
    warning = "Some citations share canonical origins. Worth verifying independence.";
  } else {
    warning = "Citations appear to come from independent canonical origins.";
  }
  return {
    visible_source_count: visible,
    canonical_origin_count: canonical,
    source_collapse_ratio: round6(collapseRatio),
    warning,
    independence_proxy: round6(independence),
  };
}

function inferContradictionCount(features) {
  const normalized = withCanonicalTraits(features);
  const contradiction = Number(normalized?.contradiction_load ?? 1);
  if (contradiction >= 0.5) {
    return 0;
  }
  return Math.max(1, Math.round((1 - contradiction) * 3));
}

function roundFeatures(features) {
  const out = {};
  const normalized = withCanonicalTraits(features);
  for (const k of CANONICAL_TRAIT_KEYS) {
    const v = normalized[k];
    if (v == null) {
      continue;
    }
    out[k] = round6(v);
  }
  return out;
}

function roundRule(rule) {
  return {
    id: rule.id,
    passed: Boolean(rule.passed),
    value: rule.value == null ? null : round6(rule.value),
    threshold: round6(rule.threshold),
    reason: rule.reason,
  };
}

function roundPenalty(penalty) {
  return {
    id: penalty.id,
    severity: round6(penalty.severity),
    weight: round6(penalty.weight),
    impact: round6(penalty.impact),
    reason: penalty.reason,
  };
}

/**
 * Strict validator. Returns a list of human-readable error strings.
 * Empty list means the scene is valid.
 *
 * @param {unknown} scene
 * @returns {string[]}
 */
export function validateEvidenceScene(scene) {
  const errors = [];
  if (!scene || typeof scene !== "object" || Array.isArray(scene)) {
    return ["scene is not a JSON object"];
  }

  for (const field of SCENE_REQUIRED_FIELDS) {
    if (!(field in scene)) {
      errors.push(`scene missing required field: ${field}`);
    }
  }

  if (scene.scene !== SCENE_NAME) {
    errors.push(`scene name must be "${SCENE_NAME}"`);
  }

  if (!Array.isArray(scene.components)) {
    errors.push("components must be a list");
    return errors;
  }

  const claimCardIds = new Set();
  const componentsByClaim = new Map();
  const calibrationSourceByClaim = new Map();
  const modelExplanationClaims = new Set();

  scene.components.forEach((component, index) => {
    if (!component || typeof component !== "object") {
      errors.push(`component[${index}] is not a JSON object`);
      return;
    }
    const { type, id, props } = component;
    if (typeof type !== "string") {
      errors.push(`component[${index}] missing type`);
      return;
    }
    if (typeof id !== "string") {
      errors.push(`component[${index}] missing id`);
    }
    if (!props || typeof props !== "object") {
      errors.push(`component[${index}] (${type}) missing props`);
      return;
    }

    const required = REQUIRED_PROPS_BY_COMPONENT[type];
    if (!required) {
      errors.push(`component[${index}] unknown type "${type}"`);
      return;
    }
    for (const propName of required) {
      if (!(propName in props)) {
        errors.push(`component[${index}] (${type}) missing prop: ${propName}`);
      }
    }

    if (type === COMPONENT_CALIBRATION_BADGE) {
      if (!CALIBRATION_SOURCES.includes(props.source)) {
        errors.push(
          `component[${index}] CalibrationBadge has invalid source "${props.source}"`,
        );
      }
      if (typeof id === "string" && id.includes(".") && typeof props.source === "string") {
        calibrationSourceByClaim.set(id.slice(id.indexOf(".") + 1), props.source);
      }
    }

    if (type === COMPONENT_CLAIM_CARD) {
      if (typeof props.claim_id === "string") {
        claimCardIds.add(props.claim_id);
      }
    } else if (typeof id === "string" && id.includes(".")) {
      const claimId = id.slice(id.indexOf(".") + 1);
      if (!componentsByClaim.has(claimId)) {
        componentsByClaim.set(claimId, new Set());
      }
      componentsByClaim.get(claimId).add(type);
      if (type === COMPONENT_MODEL_EXPLANATION_PANEL) {
        modelExplanationClaims.add(claimId);
      }
    }
  });

  if (typeof scene.claim_count === "number" && scene.claim_count !== claimCardIds.size) {
    errors.push(
      `claim_count ${scene.claim_count} does not match number of ClaimCards ${claimCardIds.size}`,
    );
  }

  for (const claimId of claimCardIds) {
    const present = componentsByClaim.get(claimId) || new Set();
    for (const componentType of ALWAYS_PRESENT_COMPONENTS) {
      if (componentType === COMPONENT_CLAIM_CARD) {
        continue;
      }
      if (!present.has(componentType)) {
        errors.push(`claim "${claimId}" missing required component: ${componentType}`);
      }
    }
    if (
      modelExplanationClaims.has(claimId)
      && calibrationSourceByClaim.get(claimId) !== "model-adjusted"
    ) {
      errors.push(
        `claim "${claimId}" has ModelExplanationPanel but CalibrationBadge source is not model-adjusted`,
      );
    }
  }

  return errors;
}
