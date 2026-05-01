from __future__ import annotations

import argparse
import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import networkx as nx

from theseus_acc.algorithm import compute_acc

try:
    from pyclugen import clugen  # type: ignore

    _PYCLUGEN_AVAILABLE = True
except Exception:  # pragma: no cover
    clugen = None  # type: ignore[assignment]
    _PYCLUGEN_AVAILABLE = False


@dataclass
class FamilySample:
    graph: nx.DiGraph
    ground_truth_flags_per_cluster: dict[str, int]


def _rand_source_ids(rng: random.Random, independent: bool) -> list[str]:
    if independent:
        n = rng.randint(1, 3)
        return [f'src_{rng.randint(1, 999)}' for _ in range(n)]
    dominant = f'src_{rng.randint(1, 10)}'
    return [dominant]


def _build_cluster_graph(
    rng: random.Random,
    *,
    cluster_sizes: list[int],
    suspect_clusters: set[int],
    adversarial: bool = False,
) -> FamilySample:
    g = nx.DiGraph()
    cluster_nodes: dict[int, list[str]] = {}

    for cidx, size in enumerate(cluster_sizes):
        nodes: list[str] = []
        for i in range(size):
            node = f'c{cidx}_n{i}'
            is_suspect = cidx in suspect_clusters
            ts_jitter = rng.randint(0, 2 if is_suspect else 60)
            timestamp = f'2026-01-{1 + ts_jitter:02d}T00:00:00+00:00'
            status = 'asserted' if is_suspect else 'verified'
            if adversarial and is_suspect and i % 4 == 0:
                status = 'verified'
            text = (
                'broad ungrounded claim with limited predicate detail'
                if is_suspect else
                f'specific evidence-backed claim {cidx}-{i} with mechanism details'
            )
            g.add_node(
                node,
                cluster=f'cluster_{cidx}',
                epistemic_status=status,
                source_ids=_rand_source_ids(rng, independent=not is_suspect),
                timestamp=timestamp,
                text=text,
                place_code='US-NY' if is_suspect else ('US-CA' if i % 2 else 'US-MA'),
            )
            nodes.append(node)
        cluster_nodes[cidx] = nodes

    for cidx, nodes in cluster_nodes.items():
        is_suspect = cidx in suspect_clusters
        # Build support trees.
        for node in nodes:
            others = [n for n in nodes if n != node]
            if not others:
                continue
            support_degree = 1 if is_suspect else rng.randint(2, 4)
            for parent in rng.sample(others, k=min(support_degree, len(others))):
                g.add_edge(parent, node, edge_type='supports')

        # Contradiction rate differs by family.
        contradiction_prob = 0.01 if is_suspect else 0.18
        if adversarial and is_suspect:
            contradiction_prob = 0.08
        for left in nodes:
            for right in nodes:
                if left == right:
                    continue
                if rng.random() < contradiction_prob:
                    g.add_edge(left, right, edge_type='contradicts')

    # Cross-cluster noise edges.
    all_nodes = [n for nodes in cluster_nodes.values() for n in nodes]
    for _ in range(max(1, len(all_nodes) // 8)):
        a = rng.choice(all_nodes)
        b = rng.choice(all_nodes)
        if a == b:
            continue
        if g.nodes[a]['cluster'] == g.nodes[b]['cluster']:
            continue
        g.add_edge(a, b, edge_type='supports' if rng.random() < 0.3 else 'contradicts')

    truth = {f'cluster_{i}': 1 if i in suspect_clusters else 0 for i in range(len(cluster_sizes))}
    return FamilySample(graph=g, ground_truth_flags_per_cluster=truth)


def generate_clean_graph(seed: int) -> FamilySample:
    rng = random.Random(seed)
    return _build_cluster_graph(rng, cluster_sizes=[16, 18, 20], suspect_clusters=set())


def generate_suspect_graph(seed: int) -> FamilySample:
    rng = random.Random(seed)
    return _build_cluster_graph(rng, cluster_sizes=[18, 18, 18], suspect_clusters={0, 1, 2})


def generate_mixed_graph(seed: int) -> FamilySample:
    rng = random.Random(seed)
    return _build_cluster_graph(rng, cluster_sizes=[14, 14, 14, 14], suspect_clusters={1, 3})


def generate_adversarial_graph(seed: int) -> FamilySample:
    rng = random.Random(seed)
    return _build_cluster_graph(
        rng,
        cluster_sizes=[16, 16, 16, 16],
        suspect_clusters={0, 2},
        adversarial=True,
    )


def _roc_auc(y_true: list[int], y_score: list[float]) -> float:
    positives = [(s, y) for s, y in zip(y_score, y_true) if y == 1]
    negatives = [(s, y) for s, y in zip(y_score, y_true) if y == 0]
    if not positives or not negatives:
        return 0.5
    wins = 0.0
    ties = 0.0
    for p, _ in positives:
        for n, _ in negatives:
            if p > n:
                wins += 1.0
            elif math.isclose(p, n):
                ties += 1.0
    denom = len(positives) * len(negatives)
    return (wins + 0.5 * ties) / max(1, denom)


def _prf(y_true: list[int], y_pred: list[int]) -> tuple[float, float, float]:
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)

    precision = tp / max(1, tp + fp)
    recall = tp / max(1, tp + fn)
    if precision + recall == 0:
        return precision, recall, 0.0
    f1 = 2 * precision * recall / (precision + recall)
    return precision, recall, f1


def evaluate_family(
    generator,
    *,
    seeds: Iterable[int],
    threshold: float = 0.55,
) -> dict:
    y_true: list[int] = []
    y_pred: list[int] = []
    y_score: list[float] = []

    for seed in seeds:
        sample = generator(int(seed))
        graph = sample.graph

        clusters = sorted({str(graph.nodes[n].get('cluster')) for n in graph.nodes})
        for cluster in clusters:
            claim_nodes = {n for n in graph.nodes if str(graph.nodes[n].get('cluster')) == cluster}
            report = compute_acc(graph, claim_nodes, include_spatial=True, threshold=threshold)
            cluster_score = float(report.cluster_summary.get('mean_acc', 0.0))
            predicted = 1 if cluster_score < threshold else 0
            truth = int(sample.ground_truth_flags_per_cluster.get(cluster, 0))

            y_true.append(truth)
            y_pred.append(predicted)
            # Higher score means more likely suspect for ROC alignment.
            y_score.append(1.0 - cluster_score)

    precision, recall, f1 = _prf(y_true, y_pred)
    auc = _roc_auc(y_true, y_score)
    return {
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'roc_auc': auc,
        'samples': len(y_true),
    }


def run_full_benchmark(*, seeds_per_family: int = 100, threshold: float = 0.55) -> dict:
    seeds = list(range(seeds_per_family))
    families = {
        'clean': generate_clean_graph,
        'suspect': generate_suspect_graph,
        'mixed': generate_mixed_graph,
        'adversarial': generate_adversarial_graph,
    }

    results = {
        name: evaluate_family(generator, seeds=seeds, threshold=threshold)
        for name, generator in families.items()
    }
    results['_meta'] = {
        'seeds_per_family': seeds_per_family,
        'threshold': threshold,
        'pyclugen_available': _PYCLUGEN_AVAILABLE,
    }
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description='Run synthetic ACC benchmark suite.')
    parser.add_argument('--full', action='store_true', help='Run full 100-seed benchmark.')
    parser.add_argument('--seeds', type=int, default=12, help='Seeds per family for quick run.')
    parser.add_argument('--threshold', type=float, default=0.55)
    parser.add_argument('--out', type=str, default='')
    args = parser.parse_args()

    seeds = 100 if args.full else max(1, int(args.seeds))
    report = run_full_benchmark(seeds_per_family=seeds, threshold=float(args.threshold))

    payload = json.dumps(report, indent=2)
    if args.out:
        out_path = Path(args.out).expanduser()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
