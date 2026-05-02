from __future__ import annotations

import networkx as nx

from theseus_acc import ACC_V2_VERSION, compute_acc


def test_compute_acc_on_karate_graph_runs():
    base = nx.karate_club_graph()
    graph = nx.DiGraph()

    for node in base.nodes:
        graph.add_node(
            str(node),
            epistemic_status='verified' if node % 3 == 0 else 'asserted',
            source_ids=[f'src_{node % 5}'],
            timestamp=f'2026-01-{(node % 28) + 1:02d}T00:00:00+00:00',
            text=f'Claim node {node} with contextual detail.',
            cluster='karate',
            place_code='US-MA' if node % 2 == 0 else 'US-CA',
        )

    for u, v in base.edges:
        graph.add_edge(str(u), str(v), edge_type='supports')
        graph.add_edge(str(v), str(u), edge_type='supports')

    report = compute_acc(graph, set(graph.nodes), include_spatial=True)
    payload = report.to_dict()

    first_score = next(iter(payload['scores'].values()))
    assert first_score['version'] == ACC_V2_VERSION
    assert 'evidence_volume' in first_score['traits']
    assert 'geometric_core' in first_score
    assert 'penalties' in first_score
    assert 'rules' in first_score
    assert 'actions' in first_score
    assert payload['cluster_summary']['num_claims'] == graph.number_of_nodes()
    assert 0.0 <= payload['cluster_summary']['mean_acc'] <= 1.0


def test_compute_acc_empty_claim_set_is_stable():
    g = nx.DiGraph()
    report = compute_acc(g, set())
    payload = report.to_dict()
    assert payload['cluster_summary']['num_claims'] == 0
    assert payload['cluster_summary']['suspect_count'] == 0


def test_acc_v2_penalizes_thin_single_source_evidence():
    graph = nx.DiGraph()
    graph.add_node(
        'source_1',
        epistemic_status='asserted',
        source_ids=['same-source'],
        timestamp='2026-01-01T00:00:00+00:00',
        text='A single weak support node.',
    )
    graph.add_node(
        'claim_1',
        epistemic_status='asserted',
        source_ids=['same-source'],
        timestamp='2026-01-01T00:00:00+00:00',
        text='They hid it.',
    )
    graph.add_edge('source_1', 'claim_1', edge_type='supports')

    payload = compute_acc(graph, {'claim_1'}).to_dict()
    score = payload['scores']['claim_1']

    assert score['suspect'] is True
    assert score['traits']['evidence_volume'] > 0
    assert score['penalty_total'] > 0
    penalty_ids = {penalty['id'] for penalty in score['penalties']}
    assert 'single_source_collapse' in penalty_ids
    assert 'rootless_claim' in penalty_ids
    action_ids = {action['id'] for action in score['actions']}
    assert 'request_independent_source' in action_ids
    assert 'defer_promotion' in action_ids


def test_acc_v2_rewards_independent_rooted_evidence():
    graph = nx.DiGraph()
    for idx, source_id in enumerate(['src_a', 'src_b', 'src_c'], start=1):
        graph.add_node(
            f'root_{idx}',
            epistemic_status='verified',
            source_ids=[source_id],
            timestamp=f'2026-01-{idx:02d}T00:00:00+00:00',
            text=f'Verified primary evidence {idx}.',
        )
    graph.add_node(
        'claim_1',
        epistemic_status='asserted',
        source_ids=[],
        timestamp='2026-01-20T00:00:00+00:00',
        text='On January 20 2026, agency sample A measured a 14 percent increase in verified channel output.',
    )
    for idx in range(1, 4):
        graph.add_edge(f'root_{idx}', 'claim_1', edge_type='supports')

    payload = compute_acc(graph, {'claim_1'}).to_dict()
    score = payload['scores']['claim_1']

    assert score['suspect'] is False
    assert score['traits']['evidence_volume'] >= 0.5
    assert score['geometric_core'] > 0
    assert all(rule['passed'] for rule in score['rules'])
    assert score['actions'] == []
