from __future__ import annotations

"""Shadow outcome ledger and calibration proposals for ACC.

This module is intentionally conservative: outcome feedback can propose a
threshold update for review, but it never mutates weights, changes a live
threshold, or promotes a proposal automatically.
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from hashlib import sha256
from typing import Any, Iterable, Literal

from .rules import ACC_V2_VERSION

OutcomeLabel = Literal['validated', 'invalidated', 'needs_review']
ProposalStatus = Literal['proposed', 'accepted', 'rejected', 'rolled_back']


@dataclass(frozen=True)
class ACCDecisionEvent:
    """A deterministic ACC decision recorded before any outcome is known."""

    claim_id: str
    acc_score: float
    threshold: float = 0.55
    claim_state: str = 'unresolved'
    version: str = ACC_V2_VERSION
    traits: dict[str, float] = field(default_factory=dict)
    diagnostics: dict[str, Any] = field(default_factory=dict)
    recorded_at: str = field(default_factory=lambda: _utc_now())

    @property
    def suspect(self) -> bool:
        return float(self.acc_score) < float(self.threshold)


@dataclass(frozen=True)
class ACCOutcomeEvent:
    """Human or benchmark outcome label for a prior ACC decision."""

    claim_id: str
    outcome: OutcomeLabel
    evidence_refs: tuple[str, ...] = ()
    reviewer: str = ''
    notes: str = ''
    recorded_at: str = field(default_factory=lambda: _utc_now())

    @property
    def should_be_suspect(self) -> bool | None:
        if self.outcome == 'invalidated':
            return True
        if self.outcome == 'validated':
            return False
        return None


@dataclass(frozen=True)
class ACCUpdateProposal:
    """Reviewable calibration proposal generated from labeled outcomes."""

    proposal_id: str
    kind: str
    from_version: str
    status: ProposalStatus
    current_threshold: float
    proposed_threshold: float
    current_balanced_accuracy: float
    proposed_balanced_accuracy: float
    labeled_count: int
    reason: str
    evidence: dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: _utc_now())


@dataclass(frozen=True)
class ACCVersion:
    """Explicit version record for a reviewed ACC threshold/weight set."""

    version: str
    threshold: float
    weights: dict[str, float]
    status: ProposalStatus
    source_proposal_id: str = ''
    created_at: str = field(default_factory=lambda: _utc_now())


def pair_decisions_with_outcomes(
    decisions: Iterable[ACCDecisionEvent],
    outcomes: Iterable[ACCOutcomeEvent],
) -> list[dict[str, Any]]:
    """Join decisions to labels, using the latest label per claim id."""

    by_claim: dict[str, ACCOutcomeEvent] = {}
    for outcome in outcomes:
        by_claim[outcome.claim_id] = outcome

    pairs: list[dict[str, Any]] = []
    for decision in decisions:
        outcome = by_claim.get(decision.claim_id)
        if outcome is None or outcome.should_be_suspect is None:
            continue
        pairs.append(
            {
                'claim_id': decision.claim_id,
                'acc_score': float(decision.acc_score),
                'recorded_suspect': decision.suspect,
                'should_be_suspect': bool(outcome.should_be_suspect),
                'decision': decision,
                'outcome': outcome,
            }
        )
    return pairs


def threshold_metrics(
    paired_events: Iterable[dict[str, Any]],
    threshold: float,
) -> dict[str, Any]:
    """Evaluate a threshold against labeled decision/outcome pairs."""

    tp = fp = tn = fn = 0
    for pair in paired_events:
        predicted = float(pair['acc_score']) < float(threshold)
        actual = bool(pair['should_be_suspect'])
        if predicted and actual:
            tp += 1
        elif predicted and not actual:
            fp += 1
        elif not predicted and actual:
            fn += 1
        else:
            tn += 1

    positive_total = tp + fn
    negative_total = tn + fp
    true_positive_rate = tp / positive_total if positive_total else 0.0
    true_negative_rate = tn / negative_total if negative_total else 0.0
    balanced_accuracy = (
        (true_positive_rate + true_negative_rate) / 2.0
        if positive_total and negative_total
        else 0.0
    )

    return {
        'threshold': round(float(threshold), 6),
        'labeled_count': tp + fp + tn + fn,
        'true_positive': tp,
        'false_positive': fp,
        'true_negative': tn,
        'false_negative': fn,
        'balanced_accuracy': round(balanced_accuracy, 6),
    }


def propose_threshold_update(
    decisions: Iterable[ACCDecisionEvent],
    outcomes: Iterable[ACCOutcomeEvent],
    *,
    current_threshold: float = 0.55,
    candidate_thresholds: Iterable[float] | None = None,
    min_labeled: int = 20,
    min_improvement: float = 0.02,
    from_version: str = ACC_V2_VERSION,
) -> ACCUpdateProposal | None:
    """Return a reviewable threshold proposal when evidence clears gates."""

    pairs = pair_decisions_with_outcomes(decisions, outcomes)
    if len(pairs) < min_labeled:
        return None

    candidates = list(candidate_thresholds or _default_thresholds())
    if current_threshold not in candidates:
        candidates.append(float(current_threshold))
    candidates = sorted({round(float(item), 6) for item in candidates})

    current = threshold_metrics(pairs, current_threshold)
    scored = [threshold_metrics(pairs, item) for item in candidates]
    best = max(scored, key=lambda item: (item['balanced_accuracy'], -abs(item['threshold'] - current_threshold)))

    improvement = float(best['balanced_accuracy']) - float(current['balanced_accuracy'])
    if improvement < min_improvement or best['threshold'] == round(float(current_threshold), 6):
        return None

    proposal_id = _proposal_id(from_version, current_threshold, best['threshold'], pairs)
    return ACCUpdateProposal(
        proposal_id=proposal_id,
        kind='threshold_update',
        from_version=from_version,
        status='proposed',
        current_threshold=round(float(current_threshold), 6),
        proposed_threshold=best['threshold'],
        current_balanced_accuracy=current['balanced_accuracy'],
        proposed_balanced_accuracy=best['balanced_accuracy'],
        labeled_count=len(pairs),
        reason=(
            'Outcome replay found a threshold with higher balanced accuracy. '
            'Proposal requires human review before promotion.'
        ),
        evidence={
            'current': current,
            'proposed': best,
            'candidate_thresholds': candidates,
        },
    )


def _default_thresholds() -> list[float]:
    return [round(0.35 + idx * 0.025, 6) for idx in range(17)]


def _proposal_id(
    version: str,
    current_threshold: float,
    proposed_threshold: float,
    pairs: list[dict[str, Any]],
) -> str:
    payload = '|'.join(
        [
            version,
            f'{current_threshold:.6f}',
            f'{proposed_threshold:.6f}',
            *[
                f"{pair['claim_id']}:{pair['acc_score']:.6f}:{int(pair['should_be_suspect'])}"
                for pair in sorted(pairs, key=lambda item: item['claim_id'])
            ],
        ]
    )
    return 'acc-proposal-' + sha256(payload.encode('utf-8')).hexdigest()[:12]


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
