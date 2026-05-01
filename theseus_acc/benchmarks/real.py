from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
from typing import Any

import networkx as nx

from theseus_acc.algorithm import compute_acc


def _parse_time(value: str | None) -> dt.datetime | None:
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        return None


def load_snapshot(path: str | Path) -> dict[str, Any]:
    payload = json.loads(Path(path).expanduser().read_text())
    if not isinstance(payload, dict):
        raise ValueError('snapshot must be a JSON object')
    return payload


def build_graph(snapshot: dict[str, Any]) -> nx.DiGraph:
    graph = nx.DiGraph()
    for node in snapshot.get('nodes', []):
        node_id = node.get('id')
        if node_id is None:
            continue
        graph.add_node(
            str(node_id),
            epistemic_status=node.get('epistemic_status', 'asserted'),
            source_ids=node.get('source_ids', []),
            timestamp=node.get('timestamp'),
            text=node.get('text', ''),
            place_code=node.get('place_code'),
            cluster=node.get('cluster', 'cluster_0'),
        )

    for edge in snapshot.get('edges', []):
        src = edge.get('source')
        dst = edge.get('target')
        if src is None or dst is None:
            continue
        if str(src) not in graph.nodes or str(dst) not in graph.nodes:
            continue
        graph.add_edge(str(src), str(dst), edge_type=edge.get('edge_type', 'supports'))

    return graph


def _cluster_scores(graph: nx.DiGraph, threshold: float) -> dict[str, float]:
    scores: dict[str, float] = {}
    clusters = sorted({str(graph.nodes[n].get('cluster', 'cluster_0')) for n in graph.nodes})
    for cluster in clusters:
        claim_nodes = {n for n in graph.nodes if str(graph.nodes[n].get('cluster', 'cluster_0')) == cluster}
        report = compute_acc(graph, claim_nodes, include_spatial=True, threshold=threshold)
        scores[cluster] = float(report.cluster_summary.get('mean_acc', 0.0))
    return scores


def run_real_benchmark(
    snapshot_path: str | Path,
    *,
    threshold: float = 0.55,
    horizon_days: int = 30,
) -> dict[str, Any]:
    snapshot = load_snapshot(snapshot_path)
    graph = build_graph(snapshot)
    feedback_rows = snapshot.get('feedback', [])

    cluster_scores = _cluster_scores(graph, threshold=threshold)

    by_claim: dict[str, list[dict[str, Any]]] = {}
    for row in feedback_rows:
        claim_id = str(row.get('claim_id')) if row.get('claim_id') is not None else None
        if not claim_id:
            continue
        by_claim.setdefault(claim_id, []).append(row)

    now = dt.datetime.now(dt.timezone.utc)
    flagged_claims = 0
    agreed = 0
    disagreed = 0
    unknown = 0

    for node in graph.nodes:
        cluster = str(graph.nodes[node].get('cluster', 'cluster_0'))
        score = float(cluster_scores.get(cluster, 0.0))
        flagged = score < threshold
        if not flagged:
            continue

        flagged_claims += 1
        rows = by_claim.get(str(node), [])
        if not rows:
            unknown += 1
            continue

        cutoff = now - dt.timedelta(days=horizon_days)
        recent = [
            row for row in rows
            if (_parse_time(row.get('timestamp')) or now) >= cutoff
        ]
        if not recent:
            unknown += 1
            continue

        labels = {str(r.get('action', '')).strip().lower() for r in recent}
        if labels & {'retired', 'contradicted'}:
            agreed += 1
        elif 'strengthened' in labels:
            disagreed += 1
        else:
            unknown += 1

    total_claims = max(1, graph.number_of_nodes())
    return {
        'claims_total': graph.number_of_nodes(),
        'flagged_claims': flagged_claims,
        'flag_rate': flagged_claims / total_claims,
        'user_agreement_rate': agreed / max(1, flagged_claims),
        'user_disagreement_rate': disagreed / max(1, flagged_claims),
        'unknown_outcome_rate': unknown / max(1, flagged_claims),
        'threshold': threshold,
        'horizon_days': horizon_days,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description='Run ACC benchmark on a real anonymized snapshot.')
    parser.add_argument('--snapshot', required=True, help='Path to snapshot JSON file.')
    parser.add_argument('--threshold', type=float, default=0.55)
    parser.add_argument('--horizon-days', type=int, default=30)
    parser.add_argument('--out', type=str, default='')
    args = parser.parse_args()

    report = run_real_benchmark(
        args.snapshot,
        threshold=float(args.threshold),
        horizon_days=int(args.horizon_days),
    )
    payload = json.dumps(report, indent=2)
    if args.out:
        out_path = Path(args.out).expanduser()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
