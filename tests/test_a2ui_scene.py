"""Tests for the deterministic A2UI EvidenceCockpit scene builder."""

from __future__ import annotations

import json

import networkx as nx
import pytest

from theseus_acc import (
    build_evidence_scene,
    build_model_adjusted_evidence_scene,
    compute_acc,
    validate_evidence_scene,
)
from theseus_acc.schemas import (
    ALWAYS_PRESENT_COMPONENTS,
    COMPONENT_CALIBRATION_BADGE,
    COMPONENT_CLAIM_CARD,
    COMPONENT_CONTRADICTION_PANEL,
    COMPONENT_MODEL_EXPLANATION_PANEL,
    COMPONENT_PENALTY_LIST,
    COMPONENT_SOURCE_COLLAPSE_PANEL,
    SCENE_NAME,
    SCENE_VERSION,
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


def _well_supported_graph():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='On Jan 14 2026 NASA reported a 12 percent rise.')
    for sid in ['nasa', 'noaa', 'esa']:
        _make_node(g, sid, epistemic_status='verified', source_ids=[sid], canonical_origin=sid)
        g.add_edge(sid, 'claim_1', edge_type='supports')
    return g


def _source_collapse_graph():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='Anonymous report claims hidden activity.')
    for slug in ['outlet_a', 'outlet_b', 'outlet_c', 'outlet_d', 'outlet_e']:
        _make_node(
            g,
            slug,
            source_ids=[slug],
            canonical_origin='wire_service',
        )
        g.add_edge(slug, 'claim_1', edge_type='supports')
    return g


def _contradicted_graph():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='Specific claim about an event in March 2026.')
    _make_node(g, 'support_a', source_ids=['a'], canonical_origin='a', epistemic_status='verified')
    _make_node(g, 'contra_b', source_ids=['b'], canonical_origin='b')
    _make_node(g, 'contra_c', source_ids=['c'], canonical_origin='c')
    g.add_edge('support_a', 'claim_1', edge_type='supports')
    g.add_edge('contra_b', 'claim_1', edge_type='contradicts')
    g.add_edge('contra_c', 'claim_1', edge_type='contradicts')
    return g


# ----- envelope -------------------------------------------------------------

def test_scene_is_json_serializable():
    g = _well_supported_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report, claim_texts={'claim_1': g.nodes['claim_1']['text']})
    # Round trip through json without raising.
    json.dumps(scene)


def test_scene_has_required_envelope_fields():
    g = _well_supported_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    assert scene['scene'] == SCENE_NAME
    assert scene['version'] == SCENE_VERSION
    assert scene['claim_count'] == 1
    assert isinstance(scene['components'], list)
    assert scene['summary'] == ''


def test_scene_passes_validator_when_built_from_real_report():
    g = _well_supported_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    errors = validate_evidence_scene(scene)
    assert errors == []


def test_model_adjusted_scene_emits_explanation_panel_and_badge_source():
    g = _well_supported_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_model_adjusted_evidence_scene(
        report,
        claim_texts={'claim_1': g.nodes['claim_1']['text']},
        model_explanations={
            'claim_1': {
                'summary': 'The model highlights three independent source branches.',
                'citations': ['claim_1', '  '],
            },
        },
        summary='The claim is strongly supported after model-side explanation.',
    )

    panel = next(
        (c for c in scene['components'] if c['type'] == COMPONENT_MODEL_EXPLANATION_PANEL),
        None,
    )
    badge = next(
        (c for c in scene['components'] if c['type'] == COMPONENT_CALIBRATION_BADGE),
        None,
    )

    assert panel is not None
    assert panel['props']['summary'].startswith('The model highlights')
    assert panel['props']['citations'] == ['claim_1']
    assert badge is not None
    assert badge['props']['source'] == 'model-adjusted'
    assert scene['summary'].startswith('The claim is strongly supported')
    assert validate_evidence_scene(scene) == []


def test_scene_includes_required_components_per_claim():
    g = _well_supported_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    types_by_claim: dict[str, set[str]] = {}
    for component in scene['components']:
        if component['type'] == COMPONENT_CLAIM_CARD:
            cid = component['props']['claim_id']
            types_by_claim.setdefault(cid, set())
            continue
        # Recover claim id from id "<Type>.<claim_id>".
        cid = component['id'].split('.', 1)[1]
        types_by_claim.setdefault(cid, set()).add(component['type'])

    for cid, present in types_by_claim.items():
        for required in ALWAYS_PRESENT_COMPONENTS:
            if required == COMPONENT_CLAIM_CARD:
                continue
            assert required in present, f'claim {cid} missing {required}'


# ----- conditional components ----------------------------------------------

def test_source_collapse_panel_appears_when_collapse_is_high():
    g = _source_collapse_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    panel = next(
        (c for c in scene['components'] if c['type'] == COMPONENT_SOURCE_COLLAPSE_PANEL),
        None,
    )
    assert panel is not None
    assert panel['props']['visible_source_count'] == 5
    assert panel['props']['canonical_origin_count'] == 1
    assert panel['props']['source_collapse_ratio'] >= 0.7
    assert 'canonical' in panel['props']['warning'].lower() or 'origin' in panel['props']['warning'].lower()


def test_source_collapse_panel_absent_for_single_source():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='Only one source here')
    _make_node(g, 's1', source_ids=['s1'])
    g.add_edge('s1', 'claim_1', edge_type='supports')
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    assert all(c['type'] != COMPONENT_SOURCE_COLLAPSE_PANEL for c in scene['components'])


def test_contradiction_panel_appears_only_when_contradictions_exist():
    g = _contradicted_graph()
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)
    panel = next(
        (c for c in scene['components'] if c['type'] == COMPONENT_CONTRADICTION_PANEL),
        None,
    )
    assert panel is not None
    assert panel['props']['contradiction_count'] == 2

    well_g = _well_supported_graph()
    well_report = compute_acc(well_g, {'claim_1'})
    well_scene = build_evidence_scene(well_report)
    assert all(c['type'] != COMPONENT_CONTRADICTION_PANEL for c in well_scene['components'])


def test_penalty_list_absent_when_no_penalties_fire():
    g = _well_supported_graph()
    # Add specificity by extending claim text to clear vague_claim penalty,
    # add a second timestamp window across roots to clear temporal_collapse.
    g.nodes['claim_1']['text'] = (
        'On January 14 2026, NASA Earth Sciences observed a 12.5 percent rise '
        'in arctic methane near Svalbard while NOAA confirmed a similar trend.'
    )
    for idx, sid in enumerate(['nasa', 'noaa', 'esa']):
        g.nodes[sid]['timestamp'] = f'2026-0{idx + 1}-15T00:00:00+00:00'
    report = compute_acc(g, {'claim_1'})
    scene = build_evidence_scene(report)

    entry = report.scores['claim_1']
    if not entry.penalties:
        assert all(c['type'] != COMPONENT_PENALTY_LIST for c in scene['components'])
    else:
        # If any penalty fired, the list should still appear.
        panel = next(
            (c for c in scene['components'] if c['type'] == COMPONENT_PENALTY_LIST),
            None,
        )
        assert panel is not None


# ----- validator catches drops ----------------------------------------------

def test_validator_reports_missing_envelope_field():
    scene = {'scene': SCENE_NAME, 'version': SCENE_VERSION, 'claim_count': 1}
    # Missing components list entirely.
    errors = validate_evidence_scene(scene)
    assert any('components' in e for e in errors)


def test_validator_reports_unknown_component_type():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    scene['components'].append({'type': 'NotAComponent', 'id': 'NotAComponent.x', 'props': {}})
    errors = validate_evidence_scene(scene)
    assert any('unknown type' in e for e in errors)


def test_validator_reports_missing_required_prop():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    # Drop a required prop from the first ClaimCard component.
    for component in scene['components']:
        if component['type'] == COMPONENT_CLAIM_CARD:
            component['props'].pop('verification_gap', None)
            break
    errors = validate_evidence_scene(scene)
    assert any('verification_gap' in e for e in errors)


def test_validator_rejects_invalid_calibration_source():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    for component in scene['components']:
        if component['type'] == COMPONENT_CALIBRATION_BADGE:
            component['props']['source'] = 'made-up-source'
            break
    errors = validate_evidence_scene(scene)
    assert any('CalibrationBadge' in e and 'invalid source' in e for e in errors)


def test_validator_rejects_model_explanation_with_deterministic_badge():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    scene['components'].insert(
        -1,
        {
            'type': COMPONENT_MODEL_EXPLANATION_PANEL,
            'id': 'ModelExplanationPanel.claim_1',
            'props': {'summary': 'Model-generated explanation should change calibration source.'},
        },
    )

    errors = validate_evidence_scene(scene)
    assert any(
        'ModelExplanationPanel' in e and 'model-adjusted' in e
        for e in errors
    )


def test_validator_reports_claim_count_mismatch():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    scene['claim_count'] = 99
    errors = validate_evidence_scene(scene)
    assert any('claim_count' in e for e in errors)


def test_validator_reports_missing_required_component_for_claim():
    g = _well_supported_graph()
    scene = build_evidence_scene(compute_acc(g, {'claim_1'}))
    # Drop NextChecks; it's in ALWAYS_PRESENT_COMPONENTS.
    scene['components'] = [c for c in scene['components'] if c['type'] != 'NextChecks']
    errors = validate_evidence_scene(scene)
    assert any('NextChecks' in e for e in errors)


# ----- multi-claim scenes ---------------------------------------------------

def test_multi_claim_scene_has_per_claim_component_set():
    g = nx.DiGraph()
    _make_node(g, 'claim_1', text='First specific claim with anchors 2026 NASA')
    _make_node(g, 'claim_2', text='Second specific claim with anchors 2026 NOAA')
    _make_node(g, 'src1', epistemic_status='verified', source_ids=['s1'])
    _make_node(g, 'src2', epistemic_status='verified', source_ids=['s2'])
    g.add_edge('src1', 'claim_1', edge_type='supports')
    g.add_edge('src2', 'claim_2', edge_type='supports')

    report = compute_acc(g, {'claim_1', 'claim_2'})
    scene = build_evidence_scene(report)
    assert scene['claim_count'] == 2
    errors = validate_evidence_scene(scene)
    assert errors == []
