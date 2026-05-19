"""A2UI EvidenceCockpit scene builders.

Converts an ACCReport into a JSON-serializable scene that the browser
extension's A2UI catalog renders without running a model. Model-generated
explanations can be layered on top with a validator-checked
``ModelExplanationPanel`` while preserving ACC scores.

This module never calls a model, never reaches the network, and never depends
on private Theseus code. It is published as part of the public theseus_acc
package.
"""

from __future__ import annotations

from typing import Any

from .algorithm import ACCReport, ClaimACC
from .rules import ACC_V2_VERSION
from .schemas import (
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
)


def _component(component_type: str, claim_id: str, props: dict[str, Any]) -> dict[str, Any]:
    """Build a single component dict with stable id."""
    return {
        'type': component_type,
        'id': f'{component_type}.{claim_id}',
        'props': props,
    }


def _claim_card_props(claim_id: str, claim_text: str, entry: ClaimACC) -> dict[str, Any]:
    return {
        'claim_id': claim_id,
        'claim_text': claim_text,
        'claim_state': entry.claim_state,
        'support_strength': round(float(entry.support_strength), 6),
        'epistemic_risk': round(float(entry.epistemic_risk), 6),
        'verification_gap': entry.verification_gap,
    }


def _source_collapse_props(entry: ClaimACC) -> dict[str, Any] | None:
    diag = entry.diagnostics or {}
    visible = int(diag.get('visible_source_count', 0) or 0)
    if visible < 2:
        return None
    canonical = int(diag.get('canonical_origin_count', 0) or 0)
    ratio = float(diag.get('source_collapse_ratio', 0.0) or 0.0)
    if ratio >= 0.5:
        warning = (
            'Many citations trace back to fewer canonical origins. '
            'Find an independent primary source.'
        )
    elif ratio >= 0.25:
        warning = 'Some citations share canonical origins. Worth verifying independence.'
    else:
        warning = 'Citations appear to come from independent canonical origins.'
    return {
        'visible_source_count': visible,
        'canonical_origin_count': canonical,
        'source_collapse_ratio': round(ratio, 6),
        'warning': warning,
    }


def _trait_radar_props(entry: ClaimACC, weights: dict[str, float]) -> dict[str, Any]:
    return {
        'traits': {k: round(float(v), 6) for k, v in entry.traits.items()},
        'weights': {k: round(float(v), 6) for k, v in weights.items()},
    }


def _rule_checklist_props(entry: ClaimACC) -> dict[str, Any]:
    return {
        'rules': [
            {
                'id': rule['id'],
                'passed': bool(rule['passed']),
                'value': round(float(rule['value']), 6),
                'threshold': round(float(rule['threshold']), 6),
                'reason': rule['reason'],
            }
            for rule in entry.rules
        ],
    }


def _penalty_list_props(entry: ClaimACC) -> dict[str, Any] | None:
    if not entry.penalties:
        return None
    return {
        'penalties': [
            {
                'id': pen['id'],
                'severity': round(float(pen['severity']), 6),
                'weight': round(float(pen['weight']), 6),
                'impact': round(float(pen['impact']), 6),
                'reason': pen['reason'],
            }
            for pen in entry.penalties
        ],
        'penalty_total': round(float(entry.penalty_total), 6),
    }


def _contradiction_panel_props(entry: ClaimACC) -> dict[str, Any] | None:
    diag = entry.diagnostics or {}
    contradictions = int(diag.get('contradiction_count', 0) or 0)
    if contradictions <= 0:
        return None
    return {'contradiction_count': contradictions}


def _next_checks_props(entry: ClaimACC) -> dict[str, Any]:
    return {
        'actions': [
            {
                'id': action['id'],
                'priority': action['priority'],
                'reason': action['reason'],
            }
            for action in entry.actions
        ],
    }


def _calibration_badge_props(entry: ClaimACC, threshold: float) -> dict[str, Any]:
    return {
        'source': 'deterministic',
        'score': round(float(entry.acc_score), 6),
        'threshold': round(float(threshold), 6),
        'version': entry.version,
    }


def _model_explanation_props(value: Any) -> dict[str, Any] | None:
    if isinstance(value, str):
        summary = value.strip()
        citations: list[str] = []
    elif isinstance(value, dict):
        summary = str(value.get('summary', '')).strip()
        raw_citations = value.get('citations', [])
        citations = []
        if isinstance(raw_citations, list):
            citations = [str(c).strip() for c in raw_citations if str(c).strip()]
    else:
        return None

    if not summary:
        return None

    props: dict[str, Any] = {'summary': summary}
    if citations:
        props['citations'] = citations
    return props


def build_evidence_scene(
    report: ACCReport,
    *,
    claim_texts: dict[str, str] | None = None,
    model_explanations: dict[str, Any] | None = None,
    summary: str | None = None,
    calibration_source: str | None = None,
) -> dict[str, Any]:
    """Build an EvidenceCockpit A2UI scene from an ACCReport.

    Args:
        report: ACCReport produced by compute_acc.
        claim_texts: Optional override mapping {claim_id: text}. When absent
            the scene uses an empty string for claim_text; the browser
            extension's claim graph builder fills this in before rendering.
        model_explanations: Optional mapping {claim_id: summary or payload}.
            When provided, ModelExplanationPanel components are emitted and
            CalibrationBadge.source defaults to ``model-adjusted``.
        summary: Optional scene-level one-paragraph summary.
        calibration_source: Explicit CalibrationBadge source. Defaults to
            ``model-adjusted`` when explanations are present; otherwise
            ``deterministic``.

    Returns:
        A JSON-serializable dict matching the EvidenceCockpit schema.
        The scene always contains a ClaimCard, TraitRadar, RuleChecklist,
        NextChecks, and CalibrationBadge per scored claim. Conditional
        components (SourceCollapsePanel, ContradictionPanel, PenaltyList)
        appear only when their underlying signal is non-trivial.
    """
    claim_texts = claim_texts or {}
    clean_model_explanations = {
        claim_id: props
        for claim_id, value in (model_explanations or {}).items()
        if (props := _model_explanation_props(value)) is not None
    }
    source = calibration_source or (
        'model-adjusted' if clean_model_explanations else 'deterministic'
    )
    if source not in CALIBRATION_SOURCES:
        raise ValueError(f'invalid calibration_source: {source}')
    components: list[dict[str, Any]] = []

    for claim_id, entry in report.scores.items():
        text = claim_texts.get(claim_id, '')

        components.append(_component(
            COMPONENT_CLAIM_CARD,
            claim_id,
            _claim_card_props(claim_id, text, entry),
        ))

        collapse_props = _source_collapse_props(entry)
        if collapse_props is not None:
            components.append(_component(
                COMPONENT_SOURCE_COLLAPSE_PANEL,
                claim_id,
                collapse_props,
            ))

        components.append(_component(
            COMPONENT_TRAIT_RADAR,
            claim_id,
            _trait_radar_props(entry, report.weights),
        ))

        components.append(_component(
            COMPONENT_RULE_CHECKLIST,
            claim_id,
            _rule_checklist_props(entry),
        ))

        penalty_props = _penalty_list_props(entry)
        if penalty_props is not None:
            components.append(_component(
                COMPONENT_PENALTY_LIST,
                claim_id,
                penalty_props,
            ))

        contradiction_props = _contradiction_panel_props(entry)
        if contradiction_props is not None:
            components.append(_component(
                COMPONENT_CONTRADICTION_PANEL,
                claim_id,
                contradiction_props,
            ))

        components.append(_component(
            COMPONENT_NEXT_CHECKS,
            claim_id,
            _next_checks_props(entry),
        ))

        explanation_props = clean_model_explanations.get(claim_id)
        if explanation_props is not None:
            components.append(_component(
                COMPONENT_MODEL_EXPLANATION_PANEL,
                claim_id,
                explanation_props,
            ))

        components.append(_component(
            COMPONENT_CALIBRATION_BADGE,
            claim_id,
            {
                **_calibration_badge_props(entry, report.threshold),
                'source': source,
            },
        ))

    return {
        'scene': SCENE_NAME,
        'version': SCENE_VERSION,
        'acc_version': ACC_V2_VERSION,
        'claim_count': len(report.scores),
        'threshold': float(report.threshold),
        'components': components,
        'summary': (summary or '').strip(),
    }


def build_model_adjusted_evidence_scene(
    report: ACCReport,
    *,
    claim_texts: dict[str, str] | None = None,
    model_explanations: dict[str, Any],
    summary: str | None = None,
) -> dict[str, Any]:
    """Build a validator-safe model-adjusted scene.

    The model may supply explanatory text only. ACC scores, thresholds,
    rules, penalties, and actions still come from the deterministic report.
    """
    return build_evidence_scene(
        report,
        claim_texts=claim_texts,
        model_explanations=model_explanations,
        summary=summary,
        calibration_source='model-adjusted',
    )


def validate_evidence_scene(scene: Any) -> list[str]:
    """Return a list of human-readable validation errors.

    An empty list means the scene matches the EvidenceCockpit schema.
    Used by the browser extension to reject malformed Gemma output and
    by the test suite to catch drops in the deterministic builder.
    """
    errors: list[str] = []

    if not isinstance(scene, dict):
        return ['scene is not a JSON object']

    for field in SCENE_REQUIRED_FIELDS:
        if field not in scene:
            errors.append(f'scene missing required field: {field}')

    if scene.get('scene') != SCENE_NAME:
        errors.append(f'scene name must be "{SCENE_NAME}"')

    components = scene.get('components')
    if not isinstance(components, list):
        errors.append('components must be a list')
        return errors

    claim_card_seen: set[str] = set()
    components_by_claim: dict[str, set[str]] = {}
    calibration_source_by_claim: dict[str, str] = {}
    model_explanation_claims: set[str] = set()

    for index, component in enumerate(components):
        if not isinstance(component, dict):
            errors.append(f'component[{index}] is not a JSON object')
            continue
        ctype = component.get('type')
        cid = component.get('id')
        props = component.get('props')
        if not isinstance(ctype, str):
            errors.append(f'component[{index}] missing type')
            continue
        if not isinstance(cid, str):
            errors.append(f'component[{index}] missing id')
        if not isinstance(props, dict):
            errors.append(f'component[{index}] ({ctype}) missing props')
            continue

        required = REQUIRED_PROPS_BY_COMPONENT.get(ctype)
        if required is None:
            errors.append(f'component[{index}] unknown type "{ctype}"')
            continue

        for prop_name in required:
            if prop_name not in props:
                errors.append(f'component[{index}] ({ctype}) missing prop: {prop_name}')

        if ctype == COMPONENT_CALIBRATION_BADGE:
            source = props.get('source')
            if source not in CALIBRATION_SOURCES:
                errors.append(
                    f'component[{index}] CalibrationBadge has invalid source "{source}"'
                )
            if isinstance(cid, str) and '.' in cid and isinstance(source, str):
                calibration_source_by_claim[cid.split('.', 1)[1]] = source

        if ctype == COMPONENT_CLAIM_CARD:
            claim_id = props.get('claim_id')
            if isinstance(claim_id, str):
                claim_card_seen.add(claim_id)
        else:
            # Component id format is "<type>.<claim_id>"; recover claim id.
            if isinstance(cid, str) and '.' in cid:
                claim_id = cid.split('.', 1)[1]
                bucket = components_by_claim.setdefault(claim_id, set())
                bucket.add(ctype)
                if ctype == COMPONENT_MODEL_EXPLANATION_PANEL:
                    model_explanation_claims.add(claim_id)

    claim_count = scene.get('claim_count')
    if isinstance(claim_count, int) and claim_count != len(claim_card_seen):
        errors.append(
            f'claim_count {claim_count} does not match number of ClaimCards {len(claim_card_seen)}'
        )

    for claim_id in claim_card_seen:
        present = components_by_claim.get(claim_id, set())
        for component_type in ALWAYS_PRESENT_COMPONENTS:
            if component_type == COMPONENT_CLAIM_CARD:
                continue
            if component_type not in present:
                errors.append(
                    f'claim "{claim_id}" missing required component: {component_type}'
                )
        if (
            claim_id in model_explanation_claims
            and calibration_source_by_claim.get(claim_id) != 'model-adjusted'
        ):
            errors.append(
                f'claim "{claim_id}" has ModelExplanationPanel but CalibrationBadge source is not model-adjusted'
            )

    return errors
