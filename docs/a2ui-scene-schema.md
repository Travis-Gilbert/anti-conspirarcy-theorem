# EvidenceCockpit A2UI Scene Schema

The deterministic builder `theseus_acc.a2ui.build_evidence_scene` and the
strict validator `theseus_acc.a2ui.validate_evidence_scene` work against
the shape documented here. The browser extension's A2UI catalog renders
against the same shape; the schema validator in
`browser-extension/src/model/schemaValidator.js` mirrors these names
when rejecting Gemma output that drops props or alters ACC scores.

The scene is JSON-serializable. Component ids follow the format
`<Type>.<claim_id>` so callers can recover claim ownership without
walking props.

## Envelope

```json
{
  "scene": "EvidenceCockpit",
  "version": "0.1.0",
  "acc_version": "2.0.0",
  "claim_count": 1,
  "threshold": 0.55,
  "summary": "",
  "components": []
}
```

Required fields: `scene`, `version`, `claim_count`, `components`. The
`summary` field is empty in deterministic output; the Gemma scene
generator (PR4) populates it as a one-paragraph explanation.

## Components

Every claim produces, at minimum, a `ClaimCard`, `TraitRadar`,
`RuleChecklist`, `NextChecks`, and `CalibrationBadge`.
`SourceCollapsePanel`, `PenaltyList`, and `ContradictionPanel` are
conditional and only appear when their underlying signal is non-trivial.

### ClaimCard

```json
{
  "type": "ClaimCard",
  "id": "ClaimCard.claim_123",
  "props": {
    "claim_id": "claim_123",
    "claim_text": "On Jan 14 2026, NASA reported a 12 percent rise.",
    "claim_state": "well_supported",
    "support_strength": 0.74,
    "epistemic_risk": 0.18,
    "verification_gap": ""
  }
}
```

`claim_state` is one of: `well_supported`, `source_collapsed`,
`contradicted`, `under_evidenced`, `rootless`, `vague`, `suspect`,
`unresolved`. `support_strength` is the pre-penalty composite of the
linear and geometric scores. `epistemic_risk` is a weighted blend of
penalty total, source-collapse ratio, contradiction count, missing
verified roots, and thin evidence volume.

### SourceCollapsePanel

```json
{
  "type": "SourceCollapsePanel",
  "id": "SourceCollapsePanel.claim_123",
  "props": {
    "visible_source_count": 8,
    "canonical_origin_count": 1,
    "source_collapse_ratio": 0.875,
    "warning": "Many citations trace back to fewer canonical origins. Find an independent primary source."
  }
}
```

Conditional. Only emitted when `visible_source_count >= 2`. The
`warning` text shifts based on the collapse ratio: high (>= 0.5),
medium (>= 0.25), or low.

### TraitRadar

```json
{
  "type": "TraitRadar",
  "id": "TraitRadar.claim_123",
  "props": {
    "traits": {
      "root_depth": 0.71,
      "source_independence": 1.00,
      "support_ratio": 1.00,
      "claim_specificity": 0.62,
      "temporal_spread": 0.84,
      "evidence_volume": 0.78,
      "falsifiability": 0.81,
      "rhetorical_pressure": 0.96,
      "source_quality": 0.85,
      "contradiction_load": 1.00,
      "citation_chain_collapse": 1.00
    },
    "weights": {
      "root_depth": 0.140,
      "source_independence": 0.140,
      "support_ratio": 0.105,
      "claim_specificity": 0.084,
      "temporal_spread": 0.126,
      "evidence_volume": 0.105,
      "falsifiability": 0.060,
      "rhetorical_pressure": 0.060,
      "source_quality": 0.060,
      "contradiction_load": 0.060,
      "citation_chain_collapse": 0.060
    }
  }
}
```

All eleven first-class traits and their default weights. Renderers can
display this as a radar plot or weighted bar chart.

### RuleChecklist

```json
{
  "type": "RuleChecklist",
  "id": "RuleChecklist.claim_123",
  "props": {
    "rules": [
      {
        "id": "requires_independent_sources",
        "passed": true,
        "value": 3.0,
        "threshold": 2.0,
        "reason": "Claim has at least two distinct supporting source ids."
      }
    ]
  }
}
```

Renderers show pass / fail per rule with the underlying value and
threshold so a reader can see the margin.

### PenaltyList

Conditional. Only emitted when at least one penalty fired.

```json
{
  "type": "PenaltyList",
  "id": "PenaltyList.claim_123",
  "props": {
    "penalty_total": 0.45,
    "penalties": [
      {
        "id": "single_source_collapse",
        "severity": 0.83,
        "weight": 0.20,
        "impact": 0.166,
        "reason": "Supporting evidence collapses into fewer than two distinct sources."
      }
    ]
  }
}
```

### ContradictionPanel

Conditional. Only emitted when `contradiction_count > 0`.

```json
{
  "type": "ContradictionPanel",
  "id": "ContradictionPanel.claim_123",
  "props": {
    "contradiction_count": 2
  }
}
```

### NextChecks

```json
{
  "type": "NextChecks",
  "id": "NextChecks.claim_123",
  "props": {
    "actions": [
      {
        "id": "request_independent_source",
        "priority": "high",
        "reason": "Add an independent source branch before promotion."
      }
    ]
  }
}
```

`priority` is `high` or `medium`. The deterministic builder ranks by
penalty impact and includes `defer_promotion` as a high-priority action
when the score falls below threshold.

### CalibrationBadge

```json
{
  "type": "CalibrationBadge",
  "id": "CalibrationBadge.claim_123",
  "props": {
    "source": "deterministic",
    "score": 0.46,
    "threshold": 0.55,
    "version": "2.0.0"
  }
}
```

`source` is `deterministic` for output produced by
`build_evidence_scene` and `model-adjusted` when the Gemma scene
generator has rewritten any explanation cell. The validator rejects
any other value. `score` is the raw ACC value; the badge renderer
shows it next to the threshold so the reader sees the margin.

### ModelExplanationPanel

Not emitted by the deterministic builder. Reserved for the Gemma scene
generator (PR4). When Gemma populates this component, it must include a
`summary` prop (one paragraph of plain English) and may include
`citations` (a list of claim ids referenced in the summary). The
validator rejects model output that uses ModelExplanationPanel without
a `summary`.

## Validation rules

The validator returns a list of human-readable errors. An empty list
means the scene is valid. Errors include:

- Missing envelope field (`scene`, `version`, `claim_count`, `components`).
- Wrong `scene` name.
- Component with unknown type.
- Component missing required prop.
- `CalibrationBadge` with invalid `source` value.
- `claim_count` mismatched with the number of `ClaimCard` components.
- Claim missing one of the always-present components.

The validator is the security boundary against model-output injection.
Tests in `tests/test_a2ui_scene.py` enumerate every rejection condition.

## Reading order

The deterministic builder emits components in this order per claim:

1. ClaimCard
2. SourceCollapsePanel (conditional)
3. TraitRadar
4. RuleChecklist
5. PenaltyList (conditional)
6. ContradictionPanel (conditional)
7. NextChecks
8. CalibrationBadge

Renderers may rearrange. The scene contract is that every ClaimCard
appears before any other component for that claim and that
CalibrationBadge appears last (so a reader who scrolls to the bottom
sees the calibration source first).
