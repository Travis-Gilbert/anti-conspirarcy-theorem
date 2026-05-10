"""Tests for diagnostics module: counters, verification_gap, classify_claim_state."""

from __future__ import annotations

import networkx as nx

from theseus_acc import compute_acc
from theseus_acc.diagnostics import (
    canonical_origin_count,
    classify_claim_state,
    collect,
    contradiction_count,
    source_collapse_ratio,
    support_branch_count,
    verification_gap,
    verified_root_count,
    visible_source_count,
)


def _make_node(graph, node_id, **attrs):
    defaults = {
        'epistemic_status': 'asserted',
        'source_ids': [],
        'timestamp': '2026-01-01T00:00:00+00:00',
        'text': '',
    }
    defaults.update(attrs)
    graph.add_node(node_id, **defaults)


def test_support_branch_count_zero():
    g = nx.DiGraph()
    _make_node(g, 'c')
    assert support_branch_count(g, 'c') == 0


def test_visible_source_count_dedupes_across_neighbors():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['shared', 'a'])
    _make_node(g, 's2', source_ids=['shared', 'b'])
    g.add_edge('s1', 'c', edge_type='supports')
    g.add_edge('s2', 'c', edge_type='supports')
    assert visible_source_count(g, 'c') == 3  # shared, a, b


def test_canonical_origin_count_uses_explicit_attribute():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['s1'], canonical_origin='wire')
    _make_node(g, 's2', source_ids=['s2'], canonical_origin='wire')
    _make_node(g, 's3', source_ids=['s3'], canonical_origin='primary')
    for s in ('s1', 's2', 's3'):
        g.add_edge(s, 'c', edge_type='supports')
    assert canonical_origin_count(g, 'c') == 2


def test_source_collapse_ratio_zero_below_two_visible_sources():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['only'])
    g.add_edge('s1', 'c', edge_type='supports')
    assert source_collapse_ratio(g, 'c') == 0.0


def test_source_collapse_ratio_high_when_many_visible_one_origin():
    g = nx.DiGraph()
    _make_node(g, 'c')
    for slug in ['a', 'b', 'c', 'd']:
        _make_node(g, f's_{slug}', source_ids=[slug], canonical_origin='wire')
        g.add_edge(f's_{slug}', 'c', edge_type='supports')
    ratio = source_collapse_ratio(g, 'c')
    assert ratio >= 0.7


def test_verified_root_count_walks_through_unverified_intermediaries():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 'mid', source_ids=['mid'])
    _make_node(g, 'root', epistemic_status='verified', source_ids=['root'])
    g.add_edge('mid', 'c', edge_type='supports')
    g.add_edge('root', 'mid', edge_type='supports')
    assert verified_root_count(g, 'c') == 1


def test_contradiction_count_counts_in_and_out():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 'a')
    _make_node(g, 'b')
    g.add_edge('a', 'c', edge_type='contradicts')
    g.add_edge('c', 'b', edge_type='contradicts')
    assert contradiction_count(g, 'c') == 2


def test_verification_gap_prioritizes_source_collapse():
    g = nx.DiGraph()
    _make_node(g, 'c')
    for slug in ['a', 'b', 'c', 'd']:
        _make_node(g, f's_{slug}', source_ids=[slug], canonical_origin='wire')
        g.add_edge(f's_{slug}', 'c', edge_type='supports')
    diag = collect(g, 'c')
    gap = verification_gap(traits={}, rules=[], penalties=[], diagnostics=diag)
    assert 'canonical' in gap.lower() or 'origin' in gap.lower()


def test_verification_gap_returns_no_supporting_evidence_when_empty():
    g = nx.DiGraph()
    _make_node(g, 'c')
    diag = collect(g, 'c')
    gap = verification_gap(traits={}, rules=[], penalties=[], diagnostics=diag)
    assert 'supporting evidence' in gap.lower()


def test_classify_claim_state_well_supported():
    state = classify_claim_state(
        acc_score=0.85,
        threshold=0.55,
        traits={'support_ratio': 1.0, 'evidence_volume': 0.7, 'claim_specificity': 0.6},
        rules=[],
        penalties=[],
        diagnostics={
            'visible_source_count': 3,
            'source_collapse_ratio': 0.0,
            'verified_root_count': 2,
            'support_branch_count': 3,
            'contradiction_count': 0,
        },
    )
    assert state == 'well_supported'


def test_classify_claim_state_source_collapsed():
    state = classify_claim_state(
        acc_score=0.40,
        threshold=0.55,
        traits={'support_ratio': 0.8, 'evidence_volume': 0.5, 'claim_specificity': 0.5},
        rules=[],
        penalties=[],
        diagnostics={
            'visible_source_count': 6,
            'source_collapse_ratio': 0.83,
            'verified_root_count': 1,
            'support_branch_count': 6,
            'contradiction_count': 0,
        },
    )
    assert state == 'source_collapsed'


def test_classify_claim_state_under_evidenced_when_no_branches():
    state = classify_claim_state(
        acc_score=0.20,
        threshold=0.55,
        traits={'support_ratio': 0.0, 'evidence_volume': 0.0, 'claim_specificity': 0.5},
        rules=[],
        penalties=[],
        diagnostics={
            'visible_source_count': 0,
            'source_collapse_ratio': 0.0,
            'verified_root_count': 0,
            'support_branch_count': 0,
            'contradiction_count': 0,
        },
    )
    assert state == 'under_evidenced'


def test_classify_claim_state_contradicted():
    state = classify_claim_state(
        acc_score=0.40,
        threshold=0.55,
        traits={'support_ratio': 0.30, 'evidence_volume': 0.6, 'claim_specificity': 0.5},
        rules=[],
        penalties=[],
        diagnostics={
            'visible_source_count': 4,
            'source_collapse_ratio': 0.0,
            'verified_root_count': 1,
            'support_branch_count': 4,
            'contradiction_count': 2,
        },
    )
    assert state == 'contradicted'


def test_classify_claim_state_rootless():
    state = classify_claim_state(
        acc_score=0.45,
        threshold=0.55,
        traits={'support_ratio': 0.7, 'evidence_volume': 0.4, 'claim_specificity': 0.5},
        rules=[],
        penalties=[],
        diagnostics={
            'visible_source_count': 2,
            'source_collapse_ratio': 0.0,
            'verified_root_count': 0,
            'support_branch_count': 2,
            'contradiction_count': 0,
        },
    )
    assert state == 'rootless'


def test_acc_report_exposes_diagnostics_and_state_fields():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='On Jan 14 2026, NASA reported a 12 percent rise.')
    _make_node(g, 'r1', epistemic_status='verified', source_ids=['nasa'], timestamp='2026-01-15T00:00:00+00:00')
    _make_node(g, 'r2', epistemic_status='verified', source_ids=['noaa'], timestamp='2026-01-16T00:00:00+00:00')
    g.add_edge('r1', 'claim_1', edge_type='supports')
    g.add_edge('r2', 'claim_1', edge_type='supports')

    payload = compute_acc(g, {'claim_1'}).to_dict()
    score = payload['scores']['claim_1']

    assert 'support_strength' in score
    assert 'epistemic_risk' in score
    assert 'claim_state' in score
    assert 'verification_gap' in score
    assert 'diagnostics' in score
    assert score['claim_state'] in {
        'well_supported',
        'source_collapsed',
        'contradicted',
        'rootless',
        'under_evidenced',
        'vague',
        'suspect',
        'unresolved',
    }
    assert 0.0 <= score['support_strength'] <= 1.0
    assert 0.0 <= score['epistemic_risk'] <= 1.0
    assert score['diagnostics']['support_branch_count'] == 2
    assert score['diagnostics']['verified_root_count'] == 2


def test_acc_report_preserves_existing_keys():
    """v2.1 must not break consumers that read only the legacy keys."""
    g = nx.DiGraph()
    _make_node(g, 'c', text='specific claim')
    _make_node(g, 's', source_ids=['s'])
    g.add_edge('s', 'c', edge_type='supports')

    score = compute_acc(g, {'c'}).to_dict()['scores']['c']

    expected_legacy_keys = {
        'acc_score',
        'suspect',
        'traits',
        'linear_score',
        'geometric_core',
        'penalty_total',
        'rules',
        'penalties',
        'actions',
        'version',
    }
    assert expected_legacy_keys <= set(score.keys())
    # New trait names are first-class members of the traits map.
    expected_new_traits = {
        'falsifiability',
        'rhetorical_pressure',
        'source_quality',
        'contradiction_load',
        'citation_chain_collapse',
    }
    assert expected_new_traits <= set(score['traits'].keys())
