from __future__ import annotations

from theseus_acc.benchmarks.synthetic import run_full_benchmark


def test_synthetic_benchmark_outputs_metrics():
    report = run_full_benchmark(seeds_per_family=2)
    for family in ('clean', 'suspect', 'mixed', 'adversarial'):
        assert family in report
        metrics = report[family]
        for key in ('precision', 'recall', 'f1', 'roc_auc'):
            assert key in metrics
            assert 0.0 <= float(metrics[key]) <= 1.0
