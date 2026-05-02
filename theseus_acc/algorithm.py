from __future__ import annotations

r"""
\nACC definition (single-source-of-truth for code + paper):

Let c be a claim node and define normalized traits in [0,1]:
  R(c) = root_depth(c)
  I(c) = source_independence(c)
  S(c) = support_ratio(c)
  C(c) = claim_specificity(c)
  T(c) = temporal_spread(c)
  E(c) = evidence_volume(c)

ACC v2 combines a linear score with a geometric core, then subtracts
deterministic penalties from failed symbolic rules:
\[
  L(c) = \sum_i w_i x_i,\quad
  G(c) = \prod_i \max(x_i, \epsilon)^{w_i},\quad
  ACC(c) = 0.65 L(c) + 0.35 G(c) - P(c)
\]
with default weights
\[
  (w_R, w_I, w_S, w_C, w_T, w_E) = (0.20, 0.20, 0.15, 0.12, 0.18, 0.15)
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
from .rules import ACC_V2_VERSION, evaluate_v2
from .traits import (
    claim_specificity,
    evidence_volume,
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
  $E \leftarrow \text{evidence\_volume}(G,c)$
  $L \leftarrow w_R R + w_I I + w_S S + w_Q Q + w_T T + w_E E$
  $K \leftarrow \prod_i \max(x_i,\epsilon)^{w_i}$
  $(rules, penalties, actions) \leftarrow \text{symbolic\_checks}(G,c,x)$
  $acc(c) \leftarrow 0.65L + 0.35K - \sum penalties$
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
    linear_score: float = 0.0
    geometric_core: float = 0.0
    penalty_total: float = 0.0
    rules: list[dict[str, Any]] = field(default_factory=list)
    penalties: list[dict[str, Any]] = field(default_factory=list)
    actions: list[dict[str, Any]] = field(default_factory=list)
    version: str = ACC_V2_VERSION


@dataclass
class ACCReport:
    scores: dict[str, ClaimACC]
    threshold: float
    weights: dict[str, float]
    cluster_summary: dict[str, Any]
    version: str = ACC_V2_VERSION

    def to_dict(self) -> dict[str, Any]:
        return {
            'scores': {
                claim_id: {
                    'acc_score': round(entry.acc_score, 6),
                    'suspect': bool(entry.suspect),
                    'traits': {k: round(v, 6) for k, v in entry.traits.items()},
                    'linear_score': round(entry.linear_score, 6),
                    'geometric_core': round(entry.geometric_core, 6),
                    'penalty_total': round(entry.penalty_total, 6),
                    'rules': _round_payload(entry.rules),
                    'penalties': _round_payload(entry.penalties),
                    'actions': _round_payload(entry.actions),
                    'version': entry.version,
                }
                for claim_id, entry in self.scores.items()
            },
            'version': self.version,
            'threshold': float(self.threshold),
            'weights': dict(self.weights),
            'cluster_summary': dict(self.cluster_summary),
        }


DEFAULT_WEIGHTS = {
    'root_depth': 0.20,
    'source_independence': 0.20,
    'support_ratio': 0.15,
    'claim_specificity': 0.12,
    'temporal_spread': 0.18,
    'evidence_volume': 0.15,
}


def _round_payload(value: Any) -> Any:
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, list):
        return [_round_payload(item) for item in value]
    if isinstance(value, dict):
        return {key: _round_payload(item) for key, item in value.items()}
    return value


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
        weights: optional overrides for the six base traits.
        root_max_hops: max hops for root depth trait (default 4).
        temporal_tau: timescale for temporal spread trait (default 30.0).
        evidence_volume_scale: support-volume saturation scale (default 6.0).
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
    evidence_volume_scale = float(options.get('evidence_volume_scale', 6.0))
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
            'evidence_volume': evidence_volume(
                work_graph,
                node,
                scale=evidence_volume_scale,
            ),
        }

        if include_spatial:
            spatial = spatial_independence(work_graph, node)
            traits['spatial_independence'] = spatial
            # Keep base formula stable; blend spatial signal into source independence.
            traits['source_independence'] = max(
                0.0,
                min(1.0, (traits['source_independence'] + spatial) / 2.0),
            )

        evaluation = evaluate_v2(
            work_graph,
            node,
            traits,
            weights,
            threshold=threshold,
        )
        acc = evaluation['acc_score']

        claim_id = str(node)
        scores[claim_id] = ClaimACC(
            claim_id=claim_id,
            acc_score=acc,
            suspect=acc < threshold,
            traits=traits,
            linear_score=evaluation['linear_score'],
            geometric_core=evaluation['geometric_core'],
            penalty_total=evaluation['penalty_total'],
            rules=evaluation['rules'],
            penalties=evaluation['penalties'],
            actions=evaluation['actions'],
            version=evaluation['version'],
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
        version=ACC_V2_VERSION,
    )


def algorithm_latex() -> str:
    """Return Algorithm 1 LaTeX block used by the paper repository."""
    return ACC_ALGORITHM_LATEX
