from __future__ import annotations

import networkx as nx

from theseus_acc import compute_acc


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

    assert payload['cluster_summary']['num_claims'] == graph.number_of_nodes()
    assert 0.0 <= payload['cluster_summary']['mean_acc'] <= 1.0


def test_compute_acc_empty_claim_set_is_stable():
    g = nx.DiGraph()
    report = compute_acc(g, set())
    payload = report.to_dict()
    assert payload['cluster_summary']['num_claims'] == 0
    assert payload['cluster_summary']['suspect_count'] == 0
