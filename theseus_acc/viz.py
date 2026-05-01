from __future__ import annotations

from pathlib import Path


def plot_family_metrics(results: dict, out_path: str | Path) -> str:
    import matplotlib.pyplot as plt

    families = [k for k in results.keys() if not k.startswith('_')]
    metrics = ['precision', 'recall', 'f1', 'roc_auc']

    fig, axes = plt.subplots(2, 2, figsize=(10, 7), constrained_layout=True)
    axes = axes.flatten()

    for idx, metric in enumerate(metrics):
        values = [float(results[f].get(metric, 0.0)) for f in families]
        axes[idx].bar(families, values)
        axes[idx].set_ylim(0, 1)
        axes[idx].set_title(metric)
        axes[idx].tick_params(axis='x', rotation=20)

    out = Path(out_path).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=180)
    plt.close(fig)
    return str(out)
