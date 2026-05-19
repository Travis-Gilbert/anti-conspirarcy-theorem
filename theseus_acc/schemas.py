"""Schema constants for the EvidenceCockpit A2UI scene shape.

These constants describe the shape the EvidenceCockpit scene builders emit.
The browser-extension A2UI catalog renders against the same shape; the strict
schema validator in browser-extension/src/model/schemaValidator.js mirrors
these names when rejecting model output.

Intentionally string-based and lightweight: this module ships in the
public package, which avoids pulling pydantic or jsonschema as a runtime
dependency for callers who only need to check field names.
"""

from __future__ import annotations

# Scene envelope ---------------------------------------------------------------

SCENE_NAME = 'EvidenceCockpit'
SCENE_VERSION = '0.1.0'

SCENE_REQUIRED_FIELDS = ('scene', 'version', 'claim_count', 'components')

# Component types --------------------------------------------------------------

COMPONENT_CLAIM_CARD = 'ClaimCard'
COMPONENT_SOURCE_COLLAPSE_PANEL = 'SourceCollapsePanel'
COMPONENT_TRAIT_RADAR = 'TraitRadar'
COMPONENT_RULE_CHECKLIST = 'RuleChecklist'
COMPONENT_PENALTY_LIST = 'PenaltyList'
COMPONENT_CONTRADICTION_PANEL = 'ContradictionPanel'
COMPONENT_NEXT_CHECKS = 'NextChecks'
COMPONENT_CALIBRATION_BADGE = 'CalibrationBadge'
COMPONENT_MODEL_EXPLANATION_PANEL = 'ModelExplanationPanel'

# Required props per component. Validators use these to detect drops.
CLAIM_CARD_REQUIRED_PROPS = (
    'claim_id',
    'claim_text',
    'claim_state',
    'support_strength',
    'epistemic_risk',
    'verification_gap',
)

SOURCE_COLLAPSE_REQUIRED_PROPS = (
    'visible_source_count',
    'canonical_origin_count',
    'source_collapse_ratio',
    'warning',
)

TRAIT_RADAR_REQUIRED_PROPS = ('traits', 'weights')

RULE_CHECKLIST_REQUIRED_PROPS = ('rules',)

PENALTY_LIST_REQUIRED_PROPS = ('penalties', 'penalty_total')

CONTRADICTION_PANEL_REQUIRED_PROPS = ('contradiction_count',)

NEXT_CHECKS_REQUIRED_PROPS = ('actions',)

CALIBRATION_BADGE_REQUIRED_PROPS = ('source', 'score', 'threshold', 'version')

MODEL_EXPLANATION_REQUIRED_PROPS = ('summary',)

REQUIRED_PROPS_BY_COMPONENT = {
    COMPONENT_CLAIM_CARD: CLAIM_CARD_REQUIRED_PROPS,
    COMPONENT_SOURCE_COLLAPSE_PANEL: SOURCE_COLLAPSE_REQUIRED_PROPS,
    COMPONENT_TRAIT_RADAR: TRAIT_RADAR_REQUIRED_PROPS,
    COMPONENT_RULE_CHECKLIST: RULE_CHECKLIST_REQUIRED_PROPS,
    COMPONENT_PENALTY_LIST: PENALTY_LIST_REQUIRED_PROPS,
    COMPONENT_CONTRADICTION_PANEL: CONTRADICTION_PANEL_REQUIRED_PROPS,
    COMPONENT_NEXT_CHECKS: NEXT_CHECKS_REQUIRED_PROPS,
    COMPONENT_CALIBRATION_BADGE: CALIBRATION_BADGE_REQUIRED_PROPS,
    COMPONENT_MODEL_EXPLANATION_PANEL: MODEL_EXPLANATION_REQUIRED_PROPS,
}

# Calibration sources. Plain deterministic scenes emit 'deterministic'.
# Scenes with model explanations must set 'model-adjusted'; validators reject
# explanation panels that pretend to be deterministic.
CALIBRATION_SOURCES = ('deterministic', 'model-adjusted')

# The set of components every well-formed scene must include for at
# least one claim. SourceCollapsePanel and ContradictionPanel are
# conditional and not in this list.
ALWAYS_PRESENT_COMPONENTS = (
    COMPONENT_CLAIM_CARD,
    COMPONENT_TRAIT_RADAR,
    COMPONENT_RULE_CHECKLIST,
    COMPONENT_NEXT_CHECKS,
    COMPONENT_CALIBRATION_BADGE,
)
