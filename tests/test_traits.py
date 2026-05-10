"""Tests for trait-level fixes and new first-class traits."""

from __future__ import annotations

import networkx as nx
import pytest

from theseus_acc import (
    citation_chain_collapse,
    contradiction_load,
    falsifiability,
    rhetorical_pressure,
    root_depth,
    source_independence,
    source_quality,
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


# ----- root_depth ------------------------------------------------------------

def test_root_depth_zero_when_no_verified_root_exists():
    g = nx.DiGraph()
    _make_node(g, 'claim', text='C')
    _make_node(g, 'src', source_ids=['s1'])
    g.add_edge('src', 'claim', edge_type='supports')

    assert root_depth(g, 'claim') == 0.0


def test_root_depth_zero_when_claim_has_no_supports():
    g = nx.DiGraph()
    _make_node(g, 'lonely', text='no supports here')
    assert root_depth(g, 'lonely') == 0.0


def test_root_depth_closer_root_scores_strictly_higher_than_distant_root():
    near = nx.DiGraph()
    _make_node(near, 'claim')
    _make_node(near, 'root', epistemic_status='verified', source_ids=['root'])
    near.add_edge('root', 'claim', edge_type='supports')
    near_score = root_depth(near, 'claim')

    far = nx.DiGraph()
    _make_node(far, 'claim')
    for hop in range(4):
        _make_node(far, f'h{hop}', source_ids=[f'h{hop}'])
    _make_node(far, 'root', epistemic_status='verified', source_ids=['root'])
    far.add_edge('h0', 'claim', edge_type='supports')
    far.add_edge('h1', 'h0', edge_type='supports')
    far.add_edge('h2', 'h1', edge_type='supports')
    far.add_edge('h3', 'h2', edge_type='supports')
    far.add_edge('root', 'h3', edge_type='supports')
    far_score = root_depth(far, 'claim', max_hops=5)

    assert near_score > far_score
    assert near_score > 0.0
    assert far_score > 0.0


def test_root_depth_multiple_independent_verified_roots_score_higher_than_one():
    one_root = nx.DiGraph()
    _make_node(one_root, 'claim')
    _make_node(one_root, 'r1', epistemic_status='verified', source_ids=['s1'])
    one_root.add_edge('r1', 'claim', edge_type='supports')

    three_roots = nx.DiGraph()
    _make_node(three_roots, 'claim')
    for idx, sid in enumerate(['a', 'b', 'c'], start=1):
        _make_node(three_roots, f'r{idx}', epistemic_status='verified', source_ids=[sid])
        three_roots.add_edge(f'r{idx}', 'claim', edge_type='supports')

    assert root_depth(three_roots, 'claim') > root_depth(one_root, 'claim')


def test_root_depth_handles_cycle_without_crash():
    g = nx.DiGraph()
    _make_node(g, 'claim')
    _make_node(g, 'a', source_ids=['a'])
    _make_node(g, 'b', source_ids=['b'])
    _make_node(g, 'root', epistemic_status='verified', source_ids=['root'])
    # Cycle a -> b -> a, plus a -> claim, root -> b.
    g.add_edge('a', 'claim', edge_type='supports')
    g.add_edge('b', 'a', edge_type='supports')
    g.add_edge('a', 'b', edge_type='supports')
    g.add_edge('root', 'b', edge_type='supports')

    score = root_depth(g, 'claim', max_hops=4)
    assert 0.0 <= score <= 1.0


# ----- source_independence --------------------------------------------------

def test_source_independence_zero_for_zero_branches():
    g = nx.DiGraph()
    _make_node(g, 'claim')
    assert source_independence(g, 'claim') == 0.0


def test_source_independence_partial_for_one_branch():
    g = nx.DiGraph()
    _make_node(g, 'claim')
    _make_node(g, 'src', source_ids=['only'])
    g.add_edge('src', 'claim', edge_type='supports')
    # 0.35 stub for single-branch claims; not 1.0.
    assert source_independence(g, 'claim') == pytest.approx(0.35, abs=1e-6)


def test_source_independence_high_for_distinct_branches():
    g = nx.DiGraph()
    _make_node(g, 'claim')
    for sid in ['a', 'b', 'c']:
        _make_node(g, f'src_{sid}', source_ids=[sid])
        g.add_edge(f'src_{sid}', 'claim', edge_type='supports')
    # Three branches with no shared source_ids => max overlap is 0 => trait = 1.0.
    assert source_independence(g, 'claim') == pytest.approx(1.0, abs=1e-6)


def test_source_independence_drops_when_branches_share_sources():
    g = nx.DiGraph()
    _make_node(g, 'claim')
    for slug in ['a', 'b']:
        _make_node(g, f'src_{slug}', source_ids=['shared', slug])
        g.add_edge(f'src_{slug}', 'claim', edge_type='supports')
    # Overlap is 1 / 3 = 0.333; trait = 1 - 0.333 = 0.667.
    assert source_independence(g, 'claim') == pytest.approx(2.0 / 3.0, abs=1e-6)


# ----- falsifiability -------------------------------------------------------

def test_falsifiability_zero_for_empty_text():
    g = nx.DiGraph()
    _make_node(g, 'c', text='')
    assert falsifiability(g, 'c') == 0.0


def test_falsifiability_high_for_specific_anchors():
    g = nx.DiGraph()
    _make_node(
        g,
        'c',
        text='On January 14, 2026, NASA observed a 12.5 percent rise in arctic methane near Svalbard.',
    )
    score = falsifiability(g, 'c')
    assert score > 0.6


def test_falsifiability_low_for_vague_text():
    g = nx.DiGraph()
    _make_node(g, 'c', text='they hid it')
    assert falsifiability(g, 'c') < 0.3


# ----- rhetorical_pressure --------------------------------------------------

def test_rhetorical_pressure_high_for_neutral_claim():
    g = nx.DiGraph()
    _make_node(g, 'c', text='Two laboratories independently reported the result.')
    assert rhetorical_pressure(g, 'c') > 0.85


def test_rhetorical_pressure_drops_for_inflammatory_claim():
    g = nx.DiGraph()
    _make_node(
        g,
        'c',
        text='SHOCKING coverup! They lied! Wake up sheeple, the truth is hidden!',
    )
    assert rhetorical_pressure(g, 'c') < 0.5


# ----- source_quality -------------------------------------------------------

def test_source_quality_default_for_no_neighbors():
    g = nx.DiGraph()
    _make_node(g, 'c')
    assert source_quality(g, 'c') == 0.5


def test_source_quality_uses_explicit_score_when_present():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['s1'], source_quality_score=0.9)
    g.add_edge('s1', 'c', edge_type='supports')
    assert source_quality(g, 'c') == pytest.approx(0.9, abs=1e-6)


def test_source_quality_uses_source_type_lookup():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 'p', source_type='primary_document')
    _make_node(g, 'b', source_type='blog')
    g.add_edge('p', 'c', edge_type='supports')
    g.add_edge('b', 'c', edge_type='supports')
    score = source_quality(g, 'c')
    assert score == pytest.approx((1.0 + 0.4) / 2.0, abs=1e-6)


# ----- contradiction_load ---------------------------------------------------

def test_contradiction_load_one_means_no_contradictions():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['s1'])
    g.add_edge('s1', 'c', edge_type='supports')
    assert contradiction_load(g, 'c') == 1.0


def test_contradiction_load_drops_with_contradictions():
    g = nx.DiGraph()
    _make_node(g, 'c')
    _make_node(g, 's1', source_ids=['s1'])
    _make_node(g, 'd1', source_ids=['d1'])
    _make_node(g, 'd2', source_ids=['d2'])
    g.add_edge('s1', 'c', edge_type='supports')
    g.add_edge('d1', 'c', edge_type='contradicts')
    g.add_edge('d2', 'c', edge_type='contradicts')
    score = contradiction_load(g, 'c')
    assert 0.0 < score < 0.6


# ----- citation_chain_collapse ----------------------------------------------

def test_citation_chain_collapse_high_when_origins_diverse():
    g = nx.DiGraph()
    _make_node(g, 'c')
    for slug in ['a', 'b', 'c']:
        _make_node(g, f's_{slug}', source_ids=[slug], canonical_origin=slug)
        g.add_edge(f's_{slug}', 'c', edge_type='supports')
    assert citation_chain_collapse(g, 'c') == pytest.approx(1.0, abs=1e-6)


def test_citation_chain_collapse_low_when_many_visible_one_origin():
    g = nx.DiGraph()
    _make_node(g, 'c')
    for slug in ['a', 'b', 'c', 'd', 'e']:
        _make_node(g, f's_{slug}', source_ids=[slug], canonical_origin='wire')
        g.add_edge(f's_{slug}', 'c', edge_type='supports')
    score = citation_chain_collapse(g, 'c')
    assert 0.0 <= score <= 0.25
