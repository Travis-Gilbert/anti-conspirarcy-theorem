from __future__ import annotations

import datetime as dt
import math
from collections import Counter
from typing import Iterable

import networkx as nx

_SUPPORT_EDGE_TYPES = {'supports', 'entailment', 'causal'}
_CONTRADICT_EDGE_TYPES = {'contradicts'}
_VERIFIED_STATUSES = {'verified', 'corroborated', 'reviewed', 'promoted'}
_STOPWORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is',
    'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'were', 'with',
}


def _edge_type(graph: nx.Graph, u, v) -> str:
    data = graph.get_edge_data(u, v) or {}
    return str(data.get('edge_type', '')).strip().lower()


def _support_predecessors(graph: nx.DiGraph, node) -> list:
    preds = []
    for parent in graph.predecessors(node):
        if _edge_type(graph, parent, node) in _SUPPORT_EDGE_TYPES:
            preds.append(parent)
    return preds


def _support_successors(graph: nx.DiGraph, node) -> list:
    out = []
    for child in graph.successors(node):
        if _edge_type(graph, node, child) in _SUPPORT_EDGE_TYPES:
            out.append(child)
    return out


def _parse_timestamp(value) -> dt.datetime | None:
    if value is None:
        return None
    if isinstance(value, dt.datetime):
        return value
    text = str(value).strip()
    if not text:
        return None
    try:
        # Accept trailing Z as UTC.
        text = text.replace('Z', '+00:00')
        return dt.datetime.fromisoformat(text)
    except ValueError:
        return None


def _all_support_paths_to_verified(
    graph: nx.DiGraph,
    claim,
    max_hops: int,
    max_paths: int = 512,
) -> list[list]:
    paths: list[list] = []
    stack: list[tuple] = [(claim, [claim])]

    while stack and len(paths) < max_paths:
        node, path = stack.pop()
        if len(path) - 1 >= max_hops:
            continue
        for parent in _support_predecessors(graph, node):
            if parent in path:
                continue
            next_path = path + [parent]
            status = str(graph.nodes[parent].get('epistemic_status', '')).strip().lower()
            if status in _VERIFIED_STATUSES:
                paths.append(next_path)
            stack.append((parent, next_path))

    return paths


def root_depth(
    graph: nx.DiGraph,
    claim,
    *,
    max_hops: int = 4,
) -> float:
    """Fraction of supporting paths that reach verified roots within N hops."""
    paths = _all_support_paths_to_verified(graph, claim, max_hops=max_hops)
    if not paths:
        return 0.0

    qualifying = 0
    for path in paths:
        # path format: claim -> ... -> verified_source
        hop_count = max(0, len(path) - 1)
        if hop_count <= max_hops:
            qualifying += 1
    return float(qualifying) / float(max(len(paths), 1))


def source_independence(graph: nx.DiGraph, claim) -> float:
    """1 - max pairwise overlap(source_trees) for support branches."""
    branch_sources: list[set[str]] = []

    for parent in _support_predecessors(graph, claim):
        source_ids = set()
        frontier = [parent]
        seen = set()
        depth = 0
        while frontier and depth < 4:
            nxt = []
            for node in frontier:
                if node in seen:
                    continue
                seen.add(node)
                source_ids.update(str(s) for s in (graph.nodes[node].get('source_ids') or []))
                nxt.extend(_support_predecessors(graph, node))
            frontier = nxt
            depth += 1
        if source_ids:
            branch_sources.append(source_ids)

    if len(branch_sources) < 2:
        return 1.0

    max_overlap = 0.0
    for i in range(len(branch_sources)):
        for j in range(i + 1, len(branch_sources)):
            a = branch_sources[i]
            b = branch_sources[j]
            denom = max(1, len(a | b))
            overlap = len(a & b) / float(denom)
            max_overlap = max(max_overlap, overlap)
    return max(0.0, min(1.0, 1.0 - max_overlap))


def support_ratio(graph: nx.DiGraph, claim, *, epsilon: float = 1e-6) -> float:
    support_n = 0
    contradict_n = 0

    for parent in graph.predecessors(claim):
        et = _edge_type(graph, parent, claim)
        if et in _SUPPORT_EDGE_TYPES:
            support_n += 1
        elif et in _CONTRADICT_EDGE_TYPES:
            contradict_n += 1

    for child in graph.successors(claim):
        et = _edge_type(graph, claim, child)
        if et in _SUPPORT_EDGE_TYPES:
            support_n += 1
        elif et in _CONTRADICT_EDGE_TYPES:
            contradict_n += 1

    denom = float(support_n + contradict_n) + float(epsilon)
    return max(0.0, min(1.0, float(support_n) / denom))


def _tokenize(text: str) -> list[str]:
    cleaned = []
    for raw in str(text or '').lower().split():
        token = ''.join(ch for ch in raw if ch.isalnum())
        if token and token not in _STOPWORDS:
            cleaned.append(token)
    return cleaned


def _idf(tokens: Iterable[str], corpus_tokens: list[list[str]]) -> float:
    docs = max(1, len(corpus_tokens))
    score = 0.0
    for token in tokens:
        contains = sum(1 for row in corpus_tokens if token in row)
        score += math.log((1.0 + docs) / (1.0 + contains)) + 1.0
    return score


def claim_specificity(
    graph: nx.DiGraph,
    claim,
    *,
    reference_corpus: list[str] | None = None,
) -> float:
    """Heuristic specificity from length + predicate specificity (TF-IDF proxy)."""
    text = str(graph.nodes[claim].get('text', '') or '')
    tokens = _tokenize(text)
    if not tokens:
        return 0.0

    length_score = min(1.0, len(tokens) / 24.0)

    if reference_corpus:
        corpus_tokens = [_tokenize(doc) for doc in reference_corpus]
    else:
        corpus_tokens = [_tokenize(str(graph.nodes[n].get('text', '') or '')) for n in graph.nodes]
        corpus_tokens = [row for row in corpus_tokens if row]

    tf = Counter(tokens)
    tfidf = sum(float(count) * _idf([tok], corpus_tokens) for tok, count in tf.items())
    normalized_tfidf = min(1.0, tfidf / (8.0 * max(1.0, len(tokens))))

    return max(0.0, min(1.0, 0.5 * length_score + 0.5 * normalized_tfidf))


def temporal_spread(
    graph: nx.DiGraph,
    claim,
    *,
    tau: float = 30.0,
) -> float:
    """1 - exp(-variance / tau) over timestamps around the claim."""
    stamps: list[dt.datetime] = []
    for node in [claim, *_support_predecessors(graph, claim), *_support_successors(graph, claim)]:
        parsed = _parse_timestamp(graph.nodes[node].get('timestamp'))
        if parsed is not None:
            stamps.append(parsed)

    if len(stamps) < 2:
        return 0.0

    epoch_days = [s.timestamp() / 86400.0 for s in stamps]
    mean = sum(epoch_days) / len(epoch_days)
    variance = sum((x - mean) ** 2 for x in epoch_days) / max(1, len(epoch_days) - 1)
    return max(0.0, min(1.0, 1.0 - math.exp(-variance / max(tau, 1e-6))))
