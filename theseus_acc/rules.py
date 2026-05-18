from __future__ import annotations

import math
from typing import Any

import networkx as nx

from .traits import support_neighbors, support_source_count

ACC_V2_VERSION = '2.1.0'
PENALTY_CAP = 0.45

RULE_THRESHOLDS = {
    'requires_independent_sources': 2.0,
    'requires_evidence_volume': 0.30,
    'requires_rooted_support': 0.25,
    'requires_temporal_spread': 0.15,
    'requires_support_over_contradiction': 0.50,
    'requires_specific_claim': 0.25,
}

PENALTY_WEIGHTS = {
    'single_source_collapse': 0.20,
    'thin_evidence': 0.18,
    'rootless_claim': 0.16,
    'contradiction_pressure': 0.14,
    'temporal_collapse': 0.10,
    'vague_claim': 0.08,
}

ACTION_BY_PENALTY = {
    'single_source_collapse': ('request_independent_source', 'Add an independent source branch before promotion.'),
    'thin_evidence': ('gather_more_evidence', 'Collect more direct support for this claim.'),
    'rootless_claim': ('seek_primary_root', 'Trace support back to a reviewed or primary root.'),
    'contradiction_pressure': ('resolve_contradiction', 'Adjudicate contradiction before trusting the claim.'),
    'temporal_collapse': ('broaden_temporal_sampling', 'Check evidence across a wider time window.'),
    'vague_claim': ('sharpen_claim', 'Rewrite the claim with concrete anchors.'),
}


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def geometric_core(
    traits: dict[str, float],
    weights: dict[str, float],
    *,
    epsilon: float = 1e-3,
) -> float:
    total = sum(float(weight) for weight in weights.values() if weight > 0)
    if total <= 0:
        return 0.0

    log_sum = 0.0
    for trait, weight in weights.items():
        if weight <= 0:
            continue
        value = max(epsilon, clamp01(float(traits.get(trait, 0.0))))
        log_sum += (float(weight) / total) * math.log(value)
    return clamp01(math.exp(log_sum))


def evaluate_rules(
    graph: nx.DiGraph,
    claim,
    traits: dict[str, float],
) -> list[dict[str, Any]]:
    source_count = float(support_source_count(graph, claim))
    support_count = float(len(support_neighbors(graph, claim)))
    temporal_value = traits.get('temporal_spread')
    temporal_known = temporal_value is not None
    evidence = float(traits.get('evidence_volume', 0.0))

    return [
        {
            'id': 'requires_independent_sources',
            'passed': source_count >= RULE_THRESHOLDS['requires_independent_sources'],
            'value': source_count,
            'threshold': RULE_THRESHOLDS['requires_independent_sources'],
            'reason': 'Claim has at least two distinct supporting source ids.',
        },
        {
            'id': 'requires_evidence_volume',
            'passed': evidence >= RULE_THRESHOLDS['requires_evidence_volume'],
            'value': evidence,
            'threshold': RULE_THRESHOLDS['requires_evidence_volume'],
            'reason': 'Claim has enough direct support volume to evaluate.',
        },
        {
            'id': 'requires_rooted_support',
            'passed': float(traits.get('root_depth', 0.0)) >= RULE_THRESHOLDS['requires_rooted_support'],
            'value': float(traits.get('root_depth', 0.0)),
            'threshold': RULE_THRESHOLDS['requires_rooted_support'],
            'reason': 'Support reaches a verified or reviewed root.',
        },
        {
            'id': 'requires_temporal_spread',
            'passed': (
                not temporal_known
                or evidence < 0.50
                or float(temporal_value) >= RULE_THRESHOLDS['requires_temporal_spread']
            ),
            'value': float(temporal_value or 0.0),
            'threshold': RULE_THRESHOLDS['requires_temporal_spread'],
            'reason': 'Evidence does not collapse into a single time window.',
        },
        {
            'id': 'requires_support_over_contradiction',
            'passed': float(traits.get('support_ratio', 0.0)) >= RULE_THRESHOLDS['requires_support_over_contradiction'],
            'value': float(traits.get('support_ratio', 0.0)),
            'threshold': RULE_THRESHOLDS['requires_support_over_contradiction'],
            'reason': 'Support is at least balanced against contradictions.',
        },
        {
            'id': 'requires_specific_claim',
            'passed': float(traits.get('claim_specificity', 0.0)) >= RULE_THRESHOLDS['requires_specific_claim'],
            'value': float(traits.get('claim_specificity', 0.0)),
            'threshold': RULE_THRESHOLDS['requires_specific_claim'],
            'reason': 'Claim text has enough concrete anchors to test.',
        },
        {
            'id': 'has_direct_support',
            'passed': support_count > 0,
            'value': support_count,
            'threshold': 1.0,
            'reason': 'Claim has direct supporting edges.',
        },
    ]


def _severity_below(value: float, threshold: float) -> float:
    if threshold <= 0 or value >= threshold:
        return 0.0
    return clamp01((threshold - value) / threshold)


def evaluate_penalties(
    rules: list[dict[str, Any]],
    traits: dict[str, float],
) -> list[dict[str, Any]]:
    by_rule = {rule['id']: rule for rule in rules}
    candidates = [
        (
            'single_source_collapse',
            _severity_below(
                float(by_rule['requires_independent_sources']['value']),
                RULE_THRESHOLDS['requires_independent_sources'],
            ),
            'Supporting evidence collapses into fewer than two distinct sources.',
        ),
        (
            'thin_evidence',
            _severity_below(float(traits.get('evidence_volume', 0.0)), RULE_THRESHOLDS['requires_evidence_volume']),
            'Direct support volume is too low for confident scoring.',
        ),
        (
            'rootless_claim',
            _severity_below(float(traits.get('root_depth', 0.0)), RULE_THRESHOLDS['requires_rooted_support']),
            'Support does not reach a verified or reviewed root.',
        ),
        (
            'contradiction_pressure',
            _severity_below(float(traits.get('support_ratio', 0.0)), RULE_THRESHOLDS['requires_support_over_contradiction']),
            'Contradiction pressure is too high relative to support.',
        ),
        (
            'temporal_collapse',
            0.0
            if by_rule['requires_temporal_spread']['passed']
            else _severity_below(float(traits.get('temporal_spread', 0.0)), RULE_THRESHOLDS['requires_temporal_spread']),
            'Evidence is concentrated in a narrow time window.',
        ),
        (
            'vague_claim',
            _severity_below(float(traits.get('claim_specificity', 0.0)), RULE_THRESHOLDS['requires_specific_claim']),
            'Claim is too vague to adjudicate cleanly.',
        ),
    ]

    penalties = []
    for penalty_id, severity, reason in candidates:
        if severity <= 0:
            continue
        weight = PENALTY_WEIGHTS[penalty_id]
        penalties.append(
            {
                'id': penalty_id,
                'severity': clamp01(severity),
                'weight': weight,
                'impact': clamp01(severity * weight),
                'reason': reason,
            }
        )
    return penalties


def recommend_actions(
    penalties: list[dict[str, Any]],
    *,
    score: float,
    threshold: float,
) -> list[dict[str, Any]]:
    actions = []
    seen = set()
    for penalty in sorted(penalties, key=lambda item: (-float(item['impact']), item['id'])):
        action_id, reason = ACTION_BY_PENALTY[penalty['id']]
        if action_id in seen:
            continue
        seen.add(action_id)
        priority = 'high' if float(penalty['impact']) >= 0.12 else 'medium'
        actions.append({'id': action_id, 'priority': priority, 'reason': reason})

    if score < threshold and 'defer_promotion' not in seen:
        actions.append(
            {
                'id': 'defer_promotion',
                'priority': 'high',
                'reason': 'Do not promote this claim until failed ACC checks are resolved.',
            }
        )
    return actions


def evaluate_v2(
    graph: nx.DiGraph,
    claim,
    traits: dict[str, float],
    weights: dict[str, float],
    *,
    threshold: float,
) -> dict[str, Any]:
    linear_score = clamp01(sum(float(weights[k]) * float(traits.get(k, 0.0)) for k in weights))
    core = geometric_core(traits, weights)
    rules = evaluate_rules(graph, claim, traits)
    penalties = evaluate_penalties(rules, traits)
    penalty_total = min(PENALTY_CAP, sum(float(penalty['impact']) for penalty in penalties))
    score = clamp01((0.65 * linear_score) + (0.35 * core) - penalty_total)
    actions = recommend_actions(penalties, score=score, threshold=threshold)

    return {
        'version': ACC_V2_VERSION,
        'linear_score': linear_score,
        'geometric_core': core,
        'penalty_total': penalty_total,
        'rules': rules,
        'penalties': penalties,
        'actions': actions,
        'acc_score': score,
    }
