from __future__ import annotations

import datetime as dt
import math
import re
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

# Inflammatory tokens used by rhetorical_pressure. Higher count means MORE
# pressure, which lowers the trait value (so trait is in [0, 1] where 1 is calm).
_RHETORICAL_PRESSURE_TOKENS = {
    'shocking', 'shock', 'shocked',
    'urgent', 'urgently', 'breaking',
    'never', 'always', 'nobody', 'everybody', 'everyone', 'no one',
    'cover-up', 'coverup', 'they', 'them',
    'truth', 'lies', 'lie', 'lying', 'fake', 'hoax', 'hidden',
    'must', 'cannot', 'won\'t', 'wont', 'refuse', 'refused',
    'destroy', 'destroyed', 'evil', 'enemy', 'agenda',
    'wake', 'sheep', 'sheeple',
    'silenced', 'censored', 'banned', 'suppressed',
    'definitely', 'absolutely', 'undeniable', 'undeniably',
    'crisis', 'catastrophe', 'disaster',
}

# Source quality lookup by `source_type` node attribute. Falls back to
# the node's own `source_quality_score` attribute or 0.5 default.
_SOURCE_TYPE_QUALITY = {
    'primary_document': 1.0,
    'primary': 1.0,
    'dataset': 0.9,
    'expert_quote': 0.7,
    'expert': 0.7,
    'peer_reviewed': 0.95,
    'paper': 0.85,
    'news_report': 0.6,
    'news': 0.6,
    'article': 0.55,
    'blog': 0.4,
    'anecdote': 0.3,
    'forum': 0.25,
    'social_post': 0.2,
    'social': 0.2,
    'no_evidence': 0.0,
    'unknown': 0.5,
}

# Falsifiability anchor regexes: numbers, dates, proper-noun spans.
_NUMBER_PATTERN = re.compile(r'\b\d+(?:[.,]\d+)?(?:%|\s*(?:percent|million|billion|thousand))?\b', re.IGNORECASE)
_DATE_PATTERN = re.compile(
    r'\b(?:'
    r'\d{4}-\d{2}-\d{2}'
    r'|\d{1,2}/\d{1,2}/\d{2,4}'
    r'|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}'
    r'|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4}'
    r')\b'
)
_PROPER_NOUN_PATTERN = re.compile(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b')


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


def support_neighbors(graph: nx.DiGraph, claim) -> list:
    """Immediate support neighborhood around a claim, deduplicated in graph order."""
    seen = set()
    neighbors = []
    for node in [*_support_predecessors(graph, claim), *_support_successors(graph, claim)]:
        if node in seen:
            continue
        seen.add(node)
        neighbors.append(node)
    return neighbors


def support_source_count(graph: nx.DiGraph, claim) -> int:
    source_ids = set()
    for node in support_neighbors(graph, claim):
        source_ids.update(str(s) for s in (graph.nodes[node].get('source_ids') or []))
    return len(source_ids)


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
    """All support paths from claim back to a verified root within max_hops.

    Each returned path is ordered claim -> ... -> verified_root and contains
    no cycles (the in-path-membership check prevents revisits, so cyclic
    supports are bounded).
    """
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


def _shortest_verified_distance(
    graph: nx.DiGraph,
    claim,
    *,
    max_hops: int,
) -> int | None:
    """Shortest distance (in support hops) from claim to any verified root.

    Returns None if no verified root is reachable within max_hops.
    """
    if claim not in graph:
        return None

    visited = {claim}
    frontier: list[tuple] = [(claim, 0)]
    while frontier:
        nxt: list[tuple] = []
        for node, distance in frontier:
            if distance >= max_hops:
                continue
            for parent in _support_predecessors(graph, node):
                if parent in visited:
                    continue
                visited.add(parent)
                status = str(graph.nodes[parent].get('epistemic_status', '')).strip().lower()
                if status in _VERIFIED_STATUSES:
                    return distance + 1
                nxt.append((parent, distance + 1))
        frontier = nxt
    return None


def root_depth(
    graph: nx.DiGraph,
    claim,
    *,
    max_hops: int = 4,
    tau: float = 2.0,
) -> float:
    """Distance-sensitive rooted-support score in [0, 1].

    Combines three signals:
      R_distance = exp(-shortest_verified_distance / tau): closer verified
                   roots score higher.
      R_coverage = verified_branches / total_support_branches: more branches
                   that reach verified roots score higher.
      R_diversity = distinct_verified_roots / total_support_branches (capped at 1):
                    multiple distinct verified roots score higher than the
                    same root reached repeatedly.

    Returns 0.0 when no verified root is reachable, 1.0 only when every
    branch reaches a distinct verified root one hop away.
    """
    branches = _support_predecessors(graph, claim)
    branch_count = len(branches)
    if branch_count == 0:
        return 0.0

    shortest = _shortest_verified_distance(graph, claim, max_hops=max_hops)
    if shortest is None:
        return 0.0

    distance_score = math.exp(-float(shortest) / max(tau, 1e-6))

    verified_branches = 0
    verified_roots: set = set()
    for parent in branches:
        # Walk this branch up to max_hops looking for any verified ancestor.
        sub_visited = {claim, parent}
        frontier_sub: list = [(parent, 1)]
        found_root = None
        status = str(graph.nodes[parent].get('epistemic_status', '')).strip().lower()
        if status in _VERIFIED_STATUSES:
            found_root = parent
        while frontier_sub and found_root is None:
            nxt_sub: list = []
            for node, distance in frontier_sub:
                if distance >= max_hops:
                    continue
                for ancestor in _support_predecessors(graph, node):
                    if ancestor in sub_visited:
                        continue
                    sub_visited.add(ancestor)
                    a_status = str(graph.nodes[ancestor].get('epistemic_status', '')).strip().lower()
                    if a_status in _VERIFIED_STATUSES:
                        found_root = ancestor
                        break
                    nxt_sub.append((ancestor, distance + 1))
                if found_root is not None:
                    break
            frontier_sub = nxt_sub
        if found_root is not None:
            verified_branches += 1
            verified_roots.add(found_root)

    coverage_score = verified_branches / float(max(branch_count, 1))
    # Diversity grows monotonically with the absolute count of distinct
    # verified roots; saturates so a fourth root adds less than the second.
    diversity_score = 1.0 - math.exp(-float(len(verified_roots)) / 2.0)

    score = 0.5 * distance_score + 0.3 * coverage_score + 0.2 * diversity_score
    return max(0.0, min(1.0, float(score)))


def source_independence(graph: nx.DiGraph, claim) -> float:
    """Independence in [0, 1] over support branches.

    Returns:
      0.00 when the claim has no support branches.
      0.35 when exactly one support branch exists (cannot be independent
           from itself; ranks above zero because the claim is at least
           supported, but well below the genuine multi-branch independence
           ceiling).
      1 - max_pairwise_origin_overlap for two or more branches, where
           overlap is computed across all source_ids reachable up to depth 4
           through the support DAG.

    Pairs with diagnostics.support_branch_count and the
    source_independence_confidence diagnostic for caller-side disambiguation.
    """
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

    if len(branch_sources) == 0:
        return 0.0
    if len(branch_sources) == 1:
        return 0.35

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


def evidence_volume(
    graph: nx.DiGraph,
    claim,
    *,
    scale: float = 6.0,
) -> float:
    """Saturating support volume from direct supports, distinct sources, and roots."""
    support_nodes = support_neighbors(graph, claim)
    if not support_nodes:
        return 0.0

    source_ids = set()
    verified_supports = 0
    textful_supports = 0
    for node in support_nodes:
        data = graph.nodes[node]
        source_ids.update(str(s) for s in (data.get('source_ids') or []))
        status = str(data.get('epistemic_status', '')).strip().lower()
        if status in _VERIFIED_STATUSES:
            verified_supports += 1
        if str(data.get('text', '') or '').strip():
            textful_supports += 1

    evidence_units = (
        len(support_nodes)
        + min(len(source_ids), len(support_nodes))
        + verified_supports
        + 0.25 * textful_supports
    )
    return max(0.0, min(1.0, 1.0 - math.exp(-evidence_units / max(scale, 1e-6))))


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


def _anchor_count(text: str) -> int:
    """Count falsifiable anchors in a claim: numbers, dates, proper-noun spans."""
    if not text:
        return 0
    count = 0
    count += len(_NUMBER_PATTERN.findall(text))
    count += len(_DATE_PATTERN.findall(text))
    # Proper nouns: count distinct multi-token spans more strongly than single tokens
    spans = _PROPER_NOUN_PATTERN.findall(text)
    count += sum(1 + (1 if ' ' in span else 0) for span in spans)
    return count


def falsifiability(graph: nx.DiGraph, claim) -> float:
    """Saturating count of concrete anchors (numbers, dates, proper-noun spans).

    Returns 0.0 for vague claims with no concrete anchors and approaches 1.0
    as anchor density grows. The trait answers "could a reader, in principle,
    look up data that would confirm or refute this claim". It does not
    measure whether the claim is true.
    """
    text = str(graph.nodes[claim].get('text', '') or '')
    if not text.strip():
        return 0.0
    anchors = _anchor_count(text)
    return max(0.0, min(1.0, 1.0 - math.exp(-anchors / 3.0)))


def rhetorical_pressure(graph: nx.DiGraph, claim) -> float:
    """Inverse rhetorical pressure in [0, 1] (higher = calmer claim text).

    Counts inflammatory tokens (urgency, identity threat, certainty inflation,
    all-caps shouting) and the ratio of all-caps tokens. Returns 1.0 for
    neutral text and approaches 0.0 as pressure rises.
    """
    text = str(graph.nodes[claim].get('text', '') or '')
    if not text.strip():
        return 1.0

    raw_tokens = re.findall(r"[A-Za-z']+", text)
    if not raw_tokens:
        return 1.0

    lowered = [tok.lower() for tok in raw_tokens]
    inflammatory = sum(1 for tok in lowered if tok in _RHETORICAL_PRESSURE_TOKENS)

    # ALL CAPS count: tokens of length >= 3 that are entirely uppercase.
    caps_tokens = sum(1 for tok in raw_tokens if len(tok) >= 3 and tok.isupper())

    # Exclamation marks are a small extra pressure signal.
    exclaim = text.count('!')

    # Combine into a pressure score; saturates with token count.
    total = max(1, len(raw_tokens))
    pressure = (inflammatory * 1.5 + caps_tokens * 1.5 + exclaim * 0.5) / total
    pressure = min(1.0, pressure * 4.0)  # amplify so a couple of tokens visibly drop the trait
    return max(0.0, min(1.0, 1.0 - pressure))


def source_quality(graph: nx.DiGraph, claim) -> float:
    """Average source-quality across support neighbors in [0, 1].

    Each support neighbor contributes:
      1. The node-level `source_quality_score` attribute if present.
      2. Else the lookup of `source_type` against _SOURCE_TYPE_QUALITY.
      3. Else 0.5 as a neutral default.

    Returns 0.5 (no information) when the claim has no support neighbors.
    """
    neighbors = support_neighbors(graph, claim)
    if not neighbors:
        return 0.5

    scores: list[float] = []
    for node in neighbors:
        data = graph.nodes[node]
        explicit = data.get('source_quality_score')
        if explicit is not None:
            try:
                scores.append(max(0.0, min(1.0, float(explicit))))
                continue
            except (TypeError, ValueError):
                pass
        source_type = str(data.get('source_type', '') or '').strip().lower()
        if source_type in _SOURCE_TYPE_QUALITY:
            scores.append(_SOURCE_TYPE_QUALITY[source_type])
            continue
        scores.append(0.5)

    if not scores:
        return 0.5
    return max(0.0, min(1.0, sum(scores) / len(scores)))


def contradiction_load(graph: nx.DiGraph, claim) -> float:
    """Inverse contradiction load in [0, 1] (higher = fewer contradictions).

    Counts contradicts edges into and out of the claim, then returns
    exp(-count / 1.5). Zero contradictions => 1.0. One contradiction
    => ~0.51. Three or more drop sharply toward 0.
    """
    contradictions = 0
    for parent in graph.predecessors(claim):
        if _edge_type(graph, parent, claim) in _CONTRADICT_EDGE_TYPES:
            contradictions += 1
    for child in graph.successors(claim):
        if _edge_type(graph, claim, child) in _CONTRADICT_EDGE_TYPES:
            contradictions += 1
    if contradictions <= 0:
        return 1.0
    return max(0.0, min(1.0, math.exp(-float(contradictions) / 1.5)))


def citation_chain_collapse(graph: nx.DiGraph, claim) -> float:
    """1 - source_collapse_ratio across support neighbors in [0, 1].

    High value (close to 1.0) means citations come from many distinct
    canonical origins. Low value (close to 0.0) means many visible sources
    collapse to few canonical origins (a citation laundry signal).

    A `canonical_origin` node attribute is preferred when present. Falls
    back to `source_ids[0]` per node, then to the node id itself.
    """
    neighbors = support_neighbors(graph, claim)
    if not neighbors:
        return 1.0  # nothing to collapse; cannot be a laundry signal

    visible: set[str] = set()
    canonical: set[str] = set()
    for node in neighbors:
        data = graph.nodes[node]
        # Visible: every source_id and the neighbor's own node id.
        sids = [str(s) for s in (data.get('source_ids') or [])]
        if sids:
            visible.update(sids)
        else:
            visible.add(str(node))
        # Canonical: explicit attribute, else first source_id, else node id.
        origin = data.get('canonical_origin')
        if origin:
            canonical.add(str(origin))
        elif sids:
            canonical.add(sids[0])
        else:
            canonical.add(str(node))

    if not visible:
        return 1.0
    collapse_ratio = max(0.0, 1.0 - (len(canonical) / float(len(visible))))
    return max(0.0, min(1.0, 1.0 - collapse_ratio))
