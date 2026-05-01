from __future__ import annotations

import networkx as nx


def spatial_independence(graph: nx.DiGraph, claim) -> float:
    """Spatial extension: higher score when support does not collapse to one place."""
    places: list[str] = []

    for parent in graph.predecessors(claim):
        data = graph.get_edge_data(parent, claim) or {}
        edge_type = str(data.get('edge_type', '')).strip().lower()
        if edge_type not in {'supports', 'entailment', 'causal'}:
            continue
        code = str(graph.nodes[parent].get('place_code', '') or '').strip().upper()
        if code:
            places.append(code)

    if not places:
        return 0.5

    counts: dict[str, int] = {}
    for code in places:
        counts[code] = counts.get(code, 0) + 1

    max_share = max(counts.values()) / float(max(1, len(places)))
    return max(0.0, min(1.0, 1.0 - max_share))
