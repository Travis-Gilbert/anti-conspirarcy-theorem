from __future__ import annotations

from theseus_acc.outcomes import (
    ACCDecisionEvent,
    ACCOutcomeEvent,
    pair_decisions_with_outcomes,
    propose_threshold_update,
    threshold_metrics,
)


def _decision(idx: int, score: float) -> ACCDecisionEvent:
    return ACCDecisionEvent(claim_id=f'c{idx:02d}', acc_score=score)


def _outcome(idx: int, outcome: str) -> ACCOutcomeEvent:
    return ACCOutcomeEvent(claim_id=f'c{idx:02d}', outcome=outcome)


def test_pairs_decisions_to_latest_labeled_outcomes_only():
    decisions = [_decision(1, 0.2), _decision(2, 0.8), _decision(3, 0.4)]
    outcomes = [
        _outcome(1, 'needs_review'),
        _outcome(1, 'invalidated'),
        _outcome(2, 'validated'),
    ]

    pairs = pair_decisions_with_outcomes(decisions, outcomes)

    assert [pair['claim_id'] for pair in pairs] == ['c01', 'c02']
    assert pairs[0]['should_be_suspect'] is True
    assert pairs[1]['should_be_suspect'] is False


def test_threshold_metrics_reports_balanced_accuracy():
    decisions = [_decision(1, 0.2), _decision(2, 0.8)]
    outcomes = [_outcome(1, 'invalidated'), _outcome(2, 'validated')]
    pairs = pair_decisions_with_outcomes(decisions, outcomes)

    metrics = threshold_metrics(pairs, 0.55)

    assert metrics['true_positive'] == 1
    assert metrics['true_negative'] == 1
    assert metrics['balanced_accuracy'] == 1.0


def test_threshold_proposal_requires_enough_labeled_events():
    decisions = [_decision(1, 0.2), _decision(2, 0.8)]
    outcomes = [_outcome(1, 'invalidated'), _outcome(2, 'validated')]

    proposal = propose_threshold_update(decisions, outcomes, min_labeled=3)

    assert proposal is None


def test_threshold_proposal_is_shadow_only_and_reviewable():
    decisions = []
    outcomes = []
    for idx in range(10):
        decisions.append(_decision(idx, 0.62 + idx * 0.01))
        outcomes.append(_outcome(idx, 'invalidated'))
    for idx in range(10, 20):
        decisions.append(_decision(idx, 0.20 + (idx - 10) * 0.01))
        outcomes.append(_outcome(idx, 'validated'))

    proposal = propose_threshold_update(
        decisions,
        outcomes,
        current_threshold=0.55,
        candidate_thresholds=[0.3, 0.55, 0.75],
        min_labeled=20,
        min_improvement=0.01,
    )

    assert proposal is not None
    assert proposal.kind == 'threshold_update'
    assert proposal.status == 'proposed'
    assert proposal.current_threshold == 0.55
    assert proposal.proposed_threshold == 0.75
    assert proposal.evidence['current']['balanced_accuracy'] < proposal.evidence['proposed']['balanced_accuracy']
    assert not hasattr(proposal, 'weights')
