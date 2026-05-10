from __future__ import annotations

"""Per-claim diagnostic counters and classifiers built on top of the trait
layer. Diagnostics are deterministic, do not normalize like traits, and are
used by the algorithm layer to populate ACCReport claim_state, verification_gap,
support_strength, and epistemic_risk fields, plus by the A2UI scene builder
to populate SourceCollapsePanel, NextChecks, and CalibrationBadge components.
"""

from typing import Any

import networkx as nx

from .traits import (
    _CONTRADICT_EDGE_TYPES,
    _SUPPORT_EDGE_TYPES,
    _VERIFIED_STATUSES,
    _edge_type,
    _support_predecessors,
    support_neighbors,
)

CLAIM_STATES = (
    'well_supported',
    'source_collapsed',
    'contradicted',
    'rootless',
    'under_evidenced',
    'vague',
    'suspect',
    'unresolved',
)


def support_branch_count(graph: nx.DiGraph, claim) -> int:
    """Number of immediate supporting predecessors of the claim."""
    return len(_support_predecessors(graph, claim))


def visible_source_count(graph: nx.DiGraph, claim) -> int:
    """Distinct source_id values across the immediate support neighborhood.

    Falls back to counting neighbor node ids when a neighbor has no
    declared source_ids. This matches what a user inspecting the rendered
    cockpit would see as "the number of citations on the page".
    """
    visible: set[str] = set()
    for node in support_neighbors(graph, claim):
        data = graph.nodes[node]
        sids = [str(s) for s in (data.get('source_ids') or [])]
        if sids:
            visible.update(sids)
        else:
            visible.add(str(node))
    return len(visible)


def canonical_origin_count(graph: nx.DiGraph, claim) -> int:
    """Distinct canonical origins behind the visible sources.

    Prefers explicit `canonical_origin` node attribute. Falls back to the
    first declared source_id per neighbor, then to the node id. Mirrors
    the citation_chain_collapse trait so collapse detection is consistent
    between trait and diagnostic.
    """
    canonical: set[str] = set()
    for node in support_neighbors(graph, claim):
        data = graph.nodes[node]
        origin = data.get('canonical_origin')
        if origin:
            canonical.add(str(origin))
            continue
        sids = [str(s) for s in (data.get('source_ids') or [])]
        if sids:
            canonical.add(sids[0])
            continue
        canonical.add(str(node))
    return len(canonical)


def source_collapse_ratio(graph: nx.DiGraph, claim) -> float:
    """1 - canonical_origin_count / visible_source_count.

    Returns 0.0 when fewer than two visible sources exist (no laundry signal
    is meaningful below two citations). Returns up to 1.0 - (1 / N) when N
    visible sources collapse onto one canonical origin.
    """
    visible = visible_source_count(graph, claim)
    if visible < 2:
        return 0.0
    canonical = canonical_origin_count(graph, claim)
    canonical = max(1, canonical)
    ratio = 1.0 - (canonical / float(visible))
    return max(0.0, min(1.0, ratio))


def verified_root_count(graph: nx.DiGraph, claim, *, max_hops: int = 4) -> int:
    """Distinct verified-status nodes reachable through support paths.

    Walks the support DAG up to max_hops. Each verified ancestor is counted
    once even if it sits at the end of multiple paths.
    """
    visited = {claim}
    frontier: list[tuple] = [(claim, 0)]
    verified: set = set()
    while frontier:
        nxt: list[tuple] = []
        for node, distance in frontier:
            if distance >= max_hops:
                continue
            for parent in _support_predecessors(graph, node):
                if parent in visited:
                    continue
                visited.add(parent)
                status = str(graph.nodes[parent].get('epistemic_status', '')).strip().lower()
                if status in _VERIFIED_STATUSES:
                    verified.add(parent)
                else:
                    nxt.append((parent, distance + 1))
        frontier = nxt
    return len(verified)


def contradiction_count(graph: nx.DiGraph, claim) -> int:
    """Number of contradicts edges into or out of the claim."""
    count = 0
    for parent in graph.predecessors(claim):
        if _edge_type(graph, parent, claim) in _CONTRADICT_EDGE_TYPES:
            count += 1
    for child in graph.successors(claim):
        if _edge_type(graph, claim, child) in _CONTRADICT_EDGE_TYPES:
            count += 1
    return count


def source_independence_confidence(
    graph: nx.DiGraph,
    claim,
) -> float:
    """Confidence in the source_independence trait value, in [0, 1].

    Encodes how much the trait value can be trusted given branch count.
    Zero branches => 0.0 (no signal). One branch => 0.35 (weak). Two or
    more branches => `1 - exp(-branches / 3)` saturating toward 1.0.
    """
    import math

    branches = support_branch_count(graph, claim)
    if branches <= 0:
        return 0.0
    if branches == 1:
        return 0.35
    return max(0.0, min(1.0, 1.0 - math.exp(-float(branches) / 3.0)))


def collect(
    graph: nx.DiGraph,
    claim,
    *,
    max_hops: int = 4,
) -> dict[str, Any]:
    """Single call that returns every diagnostic in one dictionary."""
    return {
        'support_branch_count': support_branch_count(graph, claim),
        'visible_source_count': visible_source_count(graph, claim),
        'canonical_origin_count': canonical_origin_count(graph, claim),
        'source_collapse_ratio': source_collapse_ratio(graph, claim),
        'verified_root_count': verified_root_count(graph, claim, max_hops=max_hops),
        'contradiction_count': contradiction_count(graph, claim),
        'source_independence_confidence': source_independence_confidence(graph, claim),
    }


def verification_gap(
    traits: dict[str, float],
    rules: list[dict[str, Any]],
    penalties: list[dict[str, Any]],
    diagnostics: dict[str, Any],
) -> str:
    """Plain-English string naming the most important missing check.

    Priority order (returns the first matching guidance):
      1. Source-collapse signal active.
      2. No verified root reachable.
      3. No supporting evidence linked at all.
      4. Contradiction pressure outweighs support.
      5. Direct support volume is too low.
      6. Claim text is too vague to adjudicate.
      7. Evidence collapses into a narrow time window.
      8. Empty string when no specific gap dominates.
    """
    visible = int(diagnostics.get('visible_source_count', 0) or 0)
    collapse = float(diagnostics.get('source_collapse_ratio', 0.0) or 0.0)
    verified_roots = int(diagnostics.get('verified_root_count', 0) or 0)
    branches = int(diagnostics.get('support_branch_count', 0) or 0)
    contradictions = int(diagnostics.get('contradiction_count', 0) or 0)

    support_ratio = float(traits.get('support_ratio', 0.0))
    evidence_volume = float(traits.get('evidence_volume', 0.0))
    specificity = float(traits.get('claim_specificity', 0.0))
    temporal = float(traits.get('temporal_spread', 0.0))

    if visible >= 3 and collapse >= 0.5:
        return (
            'Multiple citations trace back to fewer canonical origins. '
            'Find an independent primary source.'
        )
    if branches == 0:
        return 'No supporting evidence has been linked yet.'
    if verified_roots == 0:
        return 'Needs a verified or reviewed primary root.'
    if contradictions > 0 and support_ratio < 0.5:
        return 'Contradiction pressure outweighs support. Adjudicate before promoting.'
    if evidence_volume < 0.30:
        return 'Direct support volume is too low. Gather more evidence.'
    if specificity < 0.25:
        return 'Claim is too vague to adjudicate cleanly. Sharpen with concrete anchors.'
    if temporal < 0.15 and evidence_volume >= 0.50:
        return 'Evidence collapses into a narrow time window. Broaden temporal sampling.'
    return ''


def classify_claim_state(
    acc_score: float,
    threshold: float,
    traits: dict[str, float],
    rules: list[dict[str, Any]],
    penalties: list[dict[str, Any]],
    diagnostics: dict[str, Any],
) -> str:
    """Bucketed classification of the claim's evidence state.

    Mutually exclusive labels in priority order:
      well_supported   acc above threshold + multiple visible sources
                       + at least one verified root + zero contradictions
      source_collapsed visible >= 3 and collapse_ratio >= 0.5
      contradicted     contradiction_count > 0 and support_ratio < 0.5
      under_evidenced  evidence_volume < 0.30 or zero support branches
      rootless         supports exist but no verified root reachable
      vague            claim_specificity < 0.25
      suspect          acc_score < threshold and no specific bucket above
      unresolved       default fallback when none of the above apply
    """
    visible = int(diagnostics.get('visible_source_count', 0) or 0)
    collapse = float(diagnostics.get('source_collapse_ratio', 0.0) or 0.0)
    verified_roots = int(diagnostics.get('verified_root_count', 0) or 0)
    branches = int(diagnostics.get('support_branch_count', 0) or 0)
    contradictions = int(diagnostics.get('contradiction_count', 0) or 0)

    support_ratio = float(traits.get('support_ratio', 0.0))
    evidence_volume = float(traits.get('evidence_volume', 0.0))
    specificity = float(traits.get('claim_specificity', 0.0))

    if (
        acc_score >= max(0.65, threshold)
        and visible >= 2
        and verified_roots >= 1
        and contradictions == 0
    ):
        return 'well_supported'
    if visible >= 3 and collapse >= 0.5:
        return 'source_collapsed'
    if contradictions > 0 and support_ratio < 0.5:
        return 'contradicted'
    if evidence_volume < 0.30 or branches == 0:
        return 'under_evidenced'
    if branches > 0 and verified_roots == 0:
        return 'rootless'
    if specificity < 0.25:
        return 'vague'
    if acc_score < threshold:
        return 'suspect'
    return 'unresolved'
