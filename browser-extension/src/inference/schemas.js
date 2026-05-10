/**
 * Schema constants for the EvidenceCockpit A2UI scene shape.
 *
 * Mirrors theseus_acc/schemas.py byte-for-byte on names, versions, and the
 * required-props lists. The strict validator in
 * browser-extension/src/inference/a2ui.js consumes these constants when
 * rejecting Gemma output. Keep this file in sync with schemas.py: changes
 * to either side must update the other and the schema doc at
 * docs/a2ui-scene-schema.md.
 */

export const SCENE_NAME = "EvidenceCockpit";
export const SCENE_VERSION = "0.1.0";

export const SCENE_REQUIRED_FIELDS = ["scene", "version", "claim_count", "components"];

export const COMPONENT_CLAIM_CARD = "ClaimCard";
export const COMPONENT_SOURCE_COLLAPSE_PANEL = "SourceCollapsePanel";
export const COMPONENT_TRAIT_RADAR = "TraitRadar";
export const COMPONENT_RULE_CHECKLIST = "RuleChecklist";
export const COMPONENT_PENALTY_LIST = "PenaltyList";
export const COMPONENT_CONTRADICTION_PANEL = "ContradictionPanel";
export const COMPONENT_NEXT_CHECKS = "NextChecks";
export const COMPONENT_CALIBRATION_BADGE = "CalibrationBadge";
export const COMPONENT_MODEL_EXPLANATION_PANEL = "ModelExplanationPanel";

export const CLAIM_CARD_REQUIRED_PROPS = [
  "claim_id",
  "claim_text",
  "claim_state",
  "support_strength",
  "epistemic_risk",
  "verification_gap",
];

export const SOURCE_COLLAPSE_REQUIRED_PROPS = [
  "visible_source_count",
  "canonical_origin_count",
  "source_collapse_ratio",
  "warning",
];

export const TRAIT_RADAR_REQUIRED_PROPS = ["traits", "weights"];
export const RULE_CHECKLIST_REQUIRED_PROPS = ["rules"];
export const PENALTY_LIST_REQUIRED_PROPS = ["penalties", "penalty_total"];
export const CONTRADICTION_PANEL_REQUIRED_PROPS = ["contradiction_count"];
export const NEXT_CHECKS_REQUIRED_PROPS = ["actions"];
export const CALIBRATION_BADGE_REQUIRED_PROPS = ["source", "score", "threshold", "version"];
export const MODEL_EXPLANATION_REQUIRED_PROPS = ["summary"];

export const REQUIRED_PROPS_BY_COMPONENT = {
  [COMPONENT_CLAIM_CARD]: CLAIM_CARD_REQUIRED_PROPS,
  [COMPONENT_SOURCE_COLLAPSE_PANEL]: SOURCE_COLLAPSE_REQUIRED_PROPS,
  [COMPONENT_TRAIT_RADAR]: TRAIT_RADAR_REQUIRED_PROPS,
  [COMPONENT_RULE_CHECKLIST]: RULE_CHECKLIST_REQUIRED_PROPS,
  [COMPONENT_PENALTY_LIST]: PENALTY_LIST_REQUIRED_PROPS,
  [COMPONENT_CONTRADICTION_PANEL]: CONTRADICTION_PANEL_REQUIRED_PROPS,
  [COMPONENT_NEXT_CHECKS]: NEXT_CHECKS_REQUIRED_PROPS,
  [COMPONENT_CALIBRATION_BADGE]: CALIBRATION_BADGE_REQUIRED_PROPS,
  [COMPONENT_MODEL_EXPLANATION_PANEL]: MODEL_EXPLANATION_REQUIRED_PROPS,
};

export const CALIBRATION_SOURCES = ["deterministic", "model-adjusted"];

export const ALWAYS_PRESENT_COMPONENTS = [
  COMPONENT_CLAIM_CARD,
  COMPONENT_TRAIT_RADAR,
  COMPONENT_RULE_CHECKLIST,
  COMPONENT_NEXT_CHECKS,
  COMPONENT_CALIBRATION_BADGE,
];

export const CLAIM_STATES = [
  "well_supported",
  "source_collapsed",
  "contradicted",
  "rootless",
  "under_evidenced",
  "vague",
  "suspect",
  "unresolved",
];
