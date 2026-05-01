from __future__ import annotations

r"""
\nACC definition (single-source-of-truth for code + paper):

Let c be a claim node and define normalized traits in [0,1]:
  R(c) = root_depth(c)
  I(c) = source_independence(c)
  S(c) = support_ratio(c)
  C(c) = claim_specificity(c)
  T(c) = temporal_spread(c)

Combined score:
\[
  ACC(c) = w_R R(c) + w_I I(c) + w_S S(c) + w_C C(c) + w_T T(c)
\]
with default weights
\[
  (w_R, w_I, w_S, w_C, w_T) = (0.25, 0.25, 0.15, 0.15, 0.20)
\]
and \(\sum_i w_i = 1\).

Threshold rule:
\[
  suspect(c) = \mathbb{1}[ACC(c) < \theta]
\]
with default \(\theta = 0.55\).

Algorithm 1 pseudocode is derived from ACC_ALGORITHM_LATEX below.
"""

from dataclasses import dataclass, field
from typing import Any

import networkx as nx

from .spatial import spatial_independence
from .traits import (
    claim_specificity,
    root_depth,
    source_independence,
    support_ratio,
    temporal_spread,
)

ACC_ALGORITHM_LATEX = r"""
\begin{algorithm}[H]
\caption{Compute ACC for a claim set}
\KwIn{Graph $G=(V,E)$, claim nodes $C \subseteq V$, weights $w$, threshold $\theta$}
\KwOut{Per-claim ACC scores and suspect flags}
\ForEach{$c \in C$}{
  $R \leftarrow \text{root\_depth}(G,c)$
  $I \leftarrow \text{source\_independence}(G,c)$
  $S \leftarrow \text{support\_ratio}(G,c)$
  $Q \leftarrow \text{claim\_specificity}(G,c)$
  $T \leftarrow \text{temporal\_spread}(G,c)$
  $acc(c) \leftarrow w_R R + w_I I + w_S S + w_Q Q + w_T T$
  $flag(c) \leftarrow [acc(c) < \theta]$
}
\Return{\{acc(c), flag(c)\}_{c \in C}}
\end{algorithm}
"""


@dataclass
class ClaimACC:
    claim_id: str
    acc_score: float
    suspect: bool
    traits: dict[str, float] = field(default_factory=dict)


@dataclass
class ACCReport:
    scores: dict[str, ClaimACC]
    threshold: float
    weights: dict[str, float]
    cluster_summary: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            'scores': {
                claim_id: {
                    'acc_score': round(entry.acc_score, 6),
                    'suspect': bool(entry.suspect),
                    'traits': {k: round(v, 6) for k, v in entry.traits.items()},
                }
                for claim_id, entry in self.scores.items()
            },
            'threshold': float(self.threshold),
            'weights': dict(self.weights),
            'cluster_summary': dict(self.cluster_summary),
        }


DEFAULT_WEIGHTS = {
    'root_depth': 0.25,
    'source_independence': 0.25,
    'support_ratio': 0.15,
    'claim_specificity': 0.15,
    'temporal_spread': 0.20,
}


def _normalize_weights(weights: dict[str, float] | None) -> dict[str, float]:
    merged = dict(DEFAULT_WEIGHTS)
    if weights:
        for key, value in weights.items():
            if key in merged:
                merged[key] = max(0.0, float(value))
    total = sum(merged.values())
    if total <= 0:
        return dict(DEFAULT_WEIGHTS)
    return {k: v / total for k, v in merged.items()}


def compute_acc(
    graph: nx.Graph,
    claim_nodes: set,
    **options,
) -> ACCReport:
    """Compute Anti-Conspiracy Constraint score over a graph.

    Args:
        graph: NetworkX graph with node attrs {epistemic_status, source_ids, timestamp, text}
              and edge attr {edge_type}.
        claim_nodes: set of node ids that should be scored.
        include_spatial: optional bool; when True adds spatial independence extension.
        threshold: suspect cutoff (default 0.55).
        weights: optional overrides for the five base traits.
        root_max_hops: max hops for root depth trait (default 4).
        temporal_tau: timescale for temporal spread trait (default 30.0).
        reference_corpus: optional list[str] for specificity trait calibration.

    Returns:
        ACCReport with per-claim scores and aggregate summary.
    """
    if graph is None:
        raise ValueError('graph is required')

    if isinstance(graph, nx.DiGraph):
        work_graph = graph
    else:
        # Preserve edge direction where available; fallback to an arbitrary orientation.
        work_graph = nx.DiGraph()
        work_graph.add_nodes_from(graph.nodes(data=True))
        work_graph.add_edges_from(graph.edges(data=True))

    include_spatial = bool(options.get('include_spatial', False))
    threshold = float(options.get('threshold', 0.55))
    root_max_hops = int(options.get('root_max_hops', 4))
    temporal_tau = float(options.get('temporal_tau', 30.0))
    reference_corpus = options.get('reference_corpus')

    weights = _normalize_weights(options.get('weights'))

    scores: dict[str, ClaimACC] = {}
    for node in sorted(claim_nodes, key=lambda item: str(item)):
        if node not in work_graph:
            continue

        traits = {
            'root_depth': root_depth(work_graph, node, max_hops=root_max_hops),
            'source_independence': source_independence(work_graph, node),
            'support_ratio': support_ratio(work_graph, node),
            'claim_specificity': claim_specificity(
                work_graph,
                node,
                reference_corpus=reference_corpus,
            ),
            'temporal_spread': temporal_spread(work_graph, node, tau=temporal_tau),
        }

        if include_spatial:
            spatial = spatial_independence(work_graph, node)
            traits['spatial_independence'] = spatial
            # Keep base formula stable; blend spatial signal into source independence.
            traits['source_independence'] = max(
                0.0,
                min(1.0, (traits['source_independence'] + spatial) / 2.0),
            )

        acc = 0.0
        for trait, weight in weights.items():
            acc += float(weight) * float(traits.get(trait, 0.0))
        acc = max(0.0, min(1.0, acc))

        claim_id = str(node)
        scores[claim_id] = ClaimACC(
            claim_id=claim_id,
            acc_score=acc,
            suspect=acc < threshold,
            traits=traits,
        )

    values = [entry.acc_score for entry in scores.values()]
    suspect_count = sum(1 for entry in scores.values() if entry.suspect)

    summary = {
        'num_claims': len(scores),
        'mean_acc': sum(values) / len(values) if values else 0.0,
        'median_acc': sorted(values)[len(values) // 2] if values else 0.0,
        'suspect_count': suspect_count,
        'suspect_rate': suspect_count / max(1, len(scores)),
    }

    return ACCReport(
        scores=scores,
        threshold=threshold,
        weights=weights,
        cluster_summary=summary,
    )


def algorithm_latex() -> str:
    """Return Algorithm 1 LaTeX block used by the paper repository."""
    return ACC_ALGORITHM_LATEX
