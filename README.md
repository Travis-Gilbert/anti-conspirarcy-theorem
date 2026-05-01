# Anti-Conspiracy Theorem

This repository packages the Anti-Conspiracy Constraint (ACC) as a standalone theorem implementation and a deployable browser extension.

ACC is a structural integrity score for claim graphs. It does not decide truth by vibes or by popularity. It asks whether a claim is rooted, independently supported, specific, temporally spread, and free of collapsed citation loops.

## What is included

- `theseus_acc/`: Python reference implementation for NetworkX graphs.
- `tests/`: Python regression tests and synthetic benchmark checks.
- `browser-extension/`: Manifest V3 Chrome extension that can analyze the active page, render claim markers, and optionally consult the ACC federation catalog.
- `.github/workflows/browser-extension.yml`: release artifact workflow for downloadable extension ZIPs.

## What it computes

For each claim node, ACC combines five normalized traits:

- `root_depth` (weight `0.25`)
- `source_independence` (weight `0.25`)
- `support_ratio` (weight `0.15`)
- `claim_specificity` (weight `0.15`)
- `temporal_spread` (weight `0.20`)

Claims with `ACC < threshold` (default `0.55`) are flagged as `suspect`.

## Install

```bash
python -m pip install -e ".[dev]"
```

## NPX Installer

The npm package exposes a small CLI for extension install artifacts:

```bash
npx act-theorem install --out ./anti-conspirarcy-theorem-extension
```

Then open `chrome://extensions`, enable Developer mode, click **Load unpacked**, and choose `./anti-conspirarcy-theorem-extension`.

To create a downloadable ZIP instead:

```bash
npx act-theorem package --out ./anti-conspirarcy-theorem-extension.zip
```

The package also exposes longer binary aliases when installed locally or globally:

```bash
npm install -g act-theorem
anti-conspiracy-theorem extension instructions
```

`npx install act` is not a viable npm command for this package: `npx` treats `install` as the package name in that phrase, and the unscoped `act` package name is already taken on npm. `npx act-theorem install` is the shortest clean public command available without a scoped package.

## Quick usage

```python
import networkx as nx
from theseus_acc import compute_acc

g = nx.DiGraph()
g.add_node("claim_1", epistemic_status="verified", source_ids=["src_a"], timestamp="2026-01-01T00:00:00+00:00", text="Specific claim text", cluster="c1")
g.add_node("claim_2", epistemic_status="asserted", source_ids=["src_b"], timestamp="2026-01-10T00:00:00+00:00", text="Another claim", cluster="c1")
g.add_edge("claim_1", "claim_2", edge_type="supports")

report = compute_acc(g, {"claim_1", "claim_2"}, include_spatial=False)
print(report.to_dict())
```

## Synthetic benchmarks

```bash
python -m theseus_acc.benchmarks.synthetic --full
```

This prints precision/recall/F1/ROC-AUC for four families: clean, suspect, mixed, adversarial.

## Real-graph benchmark protocol

```bash
python -m theseus_acc.benchmarks.real --snapshot path/to/anonymized_snapshot.json
```

Snapshot format expects aggregate-safe graph metadata plus feedback actions, not raw user text.

## Visualization

```python
from theseus_acc.viz import plot_family_metrics

plot_family_metrics(results, "docs/paper-figures/synthetic-metrics.png")
```

## Citation

Use this package alongside the companion paper draft from the original Theseus research tree.

## Browser Extension

```bash
cd browser-extension
npm ci
npm run package
```

The packaged extension ZIP is written to `browser-extension/release/anti-conspirarcy-theorem-extension.zip`.

For local development, open `chrome://extensions`, enable Developer mode, and load this folder:

```text
browser-extension/
```

The extension build is deterministic by default. It uses the ACC JavaScript scoring path and can run without a model download. The WebLLM/Gemma path remains optional until a public model artifact URL is configured.

## Publishing

When ready to publish the `npx` package:

```bash
npm login
npm pack --dry-run
npm publish --access public
```

After publishing, people can use the `npx act-theorem ...` commands without cloning the repo.

## License

MIT (see `LICENSE`).
