export const FIXTURES = [
  {
    "content_confidence": 0.95,
    "content_type": "factual",
    "description": "Factual article with strong sourcing and low rhetoric flags.",
    "expected_score_result": {
      "overall_score": 0.853531,
      "verdict": "trustworthy",
      "linear_score": 0.862047,
      "geometric_core": 0.837717,
      "penalty_total": 0,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.666667,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.730854,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": 0.499795,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [],
      "actions": [],
      "support_strength": 0.853531,
      "epistemic_risk": 0.040372,
      "claim_state": "well_supported",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 6,
        "visible_source_count": 6,
        "canonical_origin_count": 6,
        "source_collapse_ratio": 0,
        "verified_root_count": 2,
        "contradiction_count": 0,
        "source_independence_confidence": 0.864665
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 1,
        "root_depth": 1,
        "source_independence": 0.666667,
        "evidence_volume": 0.730854,
        "external_support_ratio": 1,
        "temporal_spread": 0.499795,
        "consensus_alignment": 1,
        "source_tier": 1,
        "rhetorical_red_flags": 1,
        "citation_chain_closure": 1,
        "claim_falsifiability": 1,
        "support_ratio": 1,
        "falsifiability": 1,
        "rhetorical_pressure": 1,
        "source_quality": 1,
        "contradiction_load": 1,
        "citation_chain_collapse": 1
      },
      "claims": [
        {
          "id": "c0",
          "text": "Independent labs replicated the result in 2024.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.869202,
          "verdict": "trustworthy",
          "linear_score": 0.874585,
          "geometric_core": 0.859206,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.762479,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.59959,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.762479,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.869202,
          "epistemic_risk": 0.035628,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 6,
            "visible_source_count": 6,
            "canonical_origin_count": 6,
            "source_collapse_ratio": 0,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.864665
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 1,
            "source_independence": 0.666667,
            "evidence_volume": 0.762479,
            "external_support_ratio": 0.762479,
            "temporal_spread": 0.59959,
            "consensus_alignment": 1,
            "source_tier": 1,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 1,
            "claim_falsifiability": 1,
            "support_ratio": 0.762479,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 1,
            "contradiction_load": 1,
            "citation_chain_collapse": 1
          },
          "rationale": "Trustworthy signal: strong contradiction_load, citation_chain_collapse. Minor weakness: temporal_spread, source_independence.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.869202.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 190.43,55.11 194.81,76.31 176.92,88.28 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"49.33\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"93.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"137.87\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"182.13\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"226.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"270.67\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"49.33\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"93.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"137.87\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"182.13\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"226.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"270.67\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.869202</text>\n</svg>"
        },
        {
          "id": "c1",
          "text": "The report cites two peer-reviewed studies.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.770108,
          "verdict": "trustworthy",
          "linear_score": 0.783932,
          "geometric_core": 0.744436,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.632121,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.4,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.632121,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.770108,
          "epistemic_risk": 0.138515,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 5,
            "visible_source_count": 5,
            "canonical_origin_count": 3,
            "source_collapse_ratio": 0.333333,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.811124
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 1,
            "source_independence": 0.666667,
            "evidence_volume": 0.632121,
            "external_support_ratio": 0.632121,
            "temporal_spread": 0.4,
            "consensus_alignment": 1,
            "source_tier": 1,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 0.666667,
            "claim_falsifiability": 1,
            "support_ratio": 0.632121,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 1,
            "contradiction_load": 1,
            "citation_chain_collapse": 0.666667
          },
          "rationale": "Trustworthy signal: strong source_quality, contradiction_load. Minor weakness: temporal_spread, support_ratio.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict trustworthy, score 0.770108.</title>\n  <desc>High in rhetorical_red_flags, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 190.43,55.11 188.86,74.38 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 129.57,55.11 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"49.33\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"93.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"137.87\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"182.13\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"226.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"270.67\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"49.33\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"93.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"137.87\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"182.13\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"226.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"270.67\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.770108</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 2,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.95
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.869202.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 190.43,55.11 194.81,76.31 176.92,88.28 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"49.33\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"93.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"137.87\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"182.13\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"226.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"270.67\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"49.33\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"93.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"137.87\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"182.13\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"226.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"270.67\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.869202</text>\n</svg>",
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict trustworthy, score 0.770108.</title>\n  <desc>High in rhetorical_red_flags, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 190.43,55.11 188.86,74.38 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 129.57,55.11 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"49.33\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"93.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"137.87\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"182.13\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"226.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"270.67\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"49.33\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"93.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"137.87\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"182.13\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"226.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"270.67\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.770108</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          3,
          2,
          2
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [
        {
          "domain": "reuters.com",
          "id": "s0",
          "name": "Reuters",
          "tier": "primary"
        },
        {
          "domain": "apnews.com",
          "id": "s1",
          "name": "Associated Press",
          "tier": "primary"
        },
        {
          "domain": "nature.com",
          "id": "s2",
          "name": "Nature",
          "tier": "primary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "direct_primary",
          "cited_source_refs": [
            "s0",
            "s1"
          ],
          "contradicts_consensus": false,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "independent labs",
            "replicated",
            "2024"
          ],
          "text": "Independent labs replicated the result in 2024."
        },
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "direct_primary",
          "cited_source_refs": [
            "s2"
          ],
          "contradicts_consensus": false,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c1",
          "source_tier_refs": [
            "s2"
          ],
          "specificity_anchors": [
            "report",
            "peer-reviewed",
            "studies"
          ],
          "text": "The report cites two peer-reviewed studies."
        }
      ]
    },
    "id": "trustworthy_news_article",
    "tavily_result": {
      "by_claim_id": {
        "c0": [
          {
            "domain": "reuters.com",
            "published_date": "2021-01-15"
          },
          {
            "domain": "apnews.com",
            "published_date": "2024-01-15"
          },
          {
            "domain": "nature.com",
            "published_date": "2022-06-02"
          }
        ],
        "c1": [
          {
            "domain": "bbc.com",
            "published_date": "2020-03-10"
          },
          {
            "domain": "npr.org",
            "published_date": "2023-09-05"
          }
        ]
      }
    }
  },
  {
    "content_confidence": 0.9,
    "content_type": "factual",
    "description": "Factual label but weak citations, heavy rhetoric, and closed chains.",
    "expected_score_result": {
      "overall_score": 0,
      "verdict": "unreliable",
      "linear_score": 0.209995,
      "geometric_core": 0.044308,
      "penalty_total": 0.193334,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.4,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.497168,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": false,
          "value": 0.166666,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": null,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": false,
          "value": 0,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 0.333333,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [
        {
          "id": "rootless_claim",
          "severity": 0.333336,
          "weight": 0.16,
          "impact": 0.053334,
          "reason": "Support does not reach a primary, reviewed, or well-rooted source."
        },
        {
          "id": "contradiction_pressure",
          "severity": 1,
          "weight": 0.14,
          "impact": 0.14,
          "reason": "Contradiction pressure is too high relative to support."
        }
      ],
      "actions": [
        {
          "id": "resolve_contradiction",
          "priority": "high",
          "reason": "Adjudicate contradiction before trusting the claim."
        },
        {
          "id": "seek_primary_root",
          "priority": "medium",
          "reason": "Trace support back to a reviewed or primary root."
        },
        {
          "id": "defer_promotion",
          "priority": "high",
          "reason": "Do not promote this claim until failed ACC checks are resolved."
        }
      ],
      "support_strength": 0.152005,
      "epistemic_risk": 0.754314,
      "claim_state": "source_collapsed",
      "verification_gap": "Multiple citations trace back to fewer canonical origins. Find an independent primary source.",
      "diagnostics": {
        "support_branch_count": 4,
        "visible_source_count": 4,
        "canonical_origin_count": 1,
        "source_collapse_ratio": 1,
        "verified_root_count": 0,
        "contradiction_count": 3,
        "source_independence_confidence": 0.736403
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 0.333333,
        "root_depth": 0.166666,
        "source_independence": 0.4,
        "evidence_volume": 0.497168,
        "external_support_ratio": 0.333333,
        "temporal_spread": null,
        "consensus_alignment": 0,
        "source_tier": 0.1,
        "rhetorical_red_flags": 0,
        "citation_chain_closure": 0,
        "claim_falsifiability": 0.3,
        "support_ratio": 0,
        "falsifiability": 0.3,
        "rhetorical_pressure": 0,
        "source_quality": 0.1,
        "contradiction_load": 0,
        "citation_chain_collapse": 0
      },
      "claims": [
        {
          "id": "c0",
          "text": "A hidden network controls everything.",
          "char_start": 0,
          "char_end": 64,
          "score": 0,
          "verdict": "unreliable",
          "linear_score": 0.122845,
          "geometric_core": 0.008091,
          "penalty_total": 0.3,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.464739,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": false,
              "value": 0,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": null,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": false,
              "value": 0,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [
            {
              "id": "rootless_claim",
              "severity": 1,
              "weight": 0.16,
              "impact": 0.16,
              "reason": "Support does not reach a primary, reviewed, or well-rooted source."
            },
            {
              "id": "contradiction_pressure",
              "severity": 1,
              "weight": 0.14,
              "impact": 0.14,
              "reason": "Contradiction pressure is too high relative to support."
            }
          ],
          "actions": [
            {
              "id": "seek_primary_root",
              "priority": "high",
              "reason": "Trace support back to a reviewed or primary root."
            },
            {
              "id": "resolve_contradiction",
              "priority": "high",
              "reason": "Adjudicate contradiction before trusting the claim."
            },
            {
              "id": "defer_promotion",
              "priority": "high",
              "reason": "Do not promote this claim until failed ACC checks are resolved."
            }
          ],
          "support_strength": 0.082681,
          "epistemic_risk": 0.830289,
          "claim_state": "source_collapsed",
          "verification_gap": "Multiple citations trace back to fewer canonical origins. Find an independent primary source.",
          "diagnostics": {
            "support_branch_count": 4,
            "visible_source_count": 4,
            "canonical_origin_count": 1,
            "source_collapse_ratio": 1,
            "verified_root_count": 0,
            "contradiction_count": 3,
            "source_independence_confidence": 0.736403
          },
          "feature_breakdown": {
            "claim_specificity": 0.333333,
            "root_depth": 0,
            "source_independence": 0.4,
            "evidence_volume": 0.464739,
            "external_support_ratio": 0,
            "temporal_spread": null,
            "consensus_alignment": 0,
            "source_tier": 0.1,
            "rhetorical_red_flags": 0,
            "citation_chain_closure": 0,
            "claim_falsifiability": 0,
            "support_ratio": 0,
            "falsifiability": 0,
            "rhetorical_pressure": 0,
            "source_quality": 0.1,
            "contradiction_load": 0,
            "citation_chain_collapse": 0
          },
          "rationale": "Unreliable signal: weak root_depth, support_ratio; limited support from evidence_volume, temporal_spread.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict unreliable, score 0.000000.</title>\n  <desc>High in source_independence, temporal_spread; low in root_depth, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 160.00,65.00 178.26,59.07 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 160.00,65.00 160.00,65.00\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.000000</text>\n</svg>"
        },
        {
          "id": "c1",
          "text": "Officials refuse to reveal the truth.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.066914,
          "verdict": "unreliable",
          "linear_score": 0.27517,
          "geometric_core": 0.080153,
          "penalty_total": 0.14,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.464739,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": null,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": false,
              "value": 0,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [
            {
              "id": "contradiction_pressure",
              "severity": 1,
              "weight": 0.14,
              "impact": 0.14,
              "reason": "Contradiction pressure is too high relative to support."
            }
          ],
          "actions": [
            {
              "id": "resolve_contradiction",
              "priority": "high",
              "reason": "Adjudicate contradiction before trusting the claim."
            },
            {
              "id": "defer_promotion",
              "priority": "high",
              "reason": "Do not promote this claim until failed ACC checks are resolved."
            }
          ],
          "support_strength": 0.206914,
          "epistemic_risk": 0.565289,
          "claim_state": "source_collapsed",
          "verification_gap": "Multiple citations trace back to fewer canonical origins. Find an independent primary source.",
          "diagnostics": {
            "support_branch_count": 4,
            "visible_source_count": 4,
            "canonical_origin_count": 1,
            "source_collapse_ratio": 0.666667,
            "verified_root_count": 1,
            "contradiction_count": 3,
            "source_independence_confidence": 0.736403
          },
          "feature_breakdown": {
            "claim_specificity": 0.333333,
            "root_depth": 0.333333,
            "source_independence": 0.4,
            "evidence_volume": 0.464739,
            "external_support_ratio": 0,
            "temporal_spread": null,
            "consensus_alignment": 0,
            "source_tier": 0.1,
            "rhetorical_red_flags": 0,
            "citation_chain_closure": 0.333333,
            "claim_falsifiability": 0.6,
            "support_ratio": 0,
            "falsifiability": 0.6,
            "rhetorical_pressure": 0,
            "source_quality": 0.1,
            "contradiction_load": 0,
            "citation_chain_collapse": 0.333333
          },
          "rationale": "Unreliable signal: weak support_ratio, rhetorical_pressure; limited support from temporal_spread, falsifiability.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict unreliable, score 0.066914.</title>\n  <desc>High in temporal_spread, claim_falsifiability; low in external_support_ratio, consensus_alignment.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 169.40,52.06 178.26,59.07 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 144.78,60.06 143.07,41.70\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.066914</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 2,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.9
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict unreliable, score 0.000000.</title>\n  <desc>High in source_independence, temporal_spread; low in root_depth, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 160.00,65.00 178.26,59.07 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 160.00,65.00 160.00,65.00\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.000000</text>\n</svg>",
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict unreliable, score 0.066914.</title>\n  <desc>High in temporal_spread, claim_falsifiability; low in external_support_ratio, consensus_alignment.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 169.40,52.06 178.26,59.07 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 144.78,60.06 143.07,41.70\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.066914</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          1,
          0,
          0
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 2,
          "emotional_appeal_decoupled": 2,
          "false_precision": 1,
          "identity_based_dismissal": 1,
          "suppressed_truth_narrative": 2,
          "urgency_framing": 2
        }
      },
      "cited_sources": [
        {
          "domain": "disinfo-example-001.com",
          "id": "s0",
          "name": "Example Fringe",
          "tier": "self_referential"
        },
        {
          "domain": "disinfo-example-002.com",
          "id": "s1",
          "name": "Example Mirror",
          "tier": "self_referential"
        },
        {
          "domain": "unranked-example-001.org",
          "id": "s2",
          "name": "Unknown Index",
          "tier": "unknown"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 3,
            "total_citation_chains_described": 3
          },
          "citation_kind": "unanchored",
          "cited_source_refs": [
            "s0",
            "s1",
            "s1"
          ],
          "contradicts_consensus": true,
          "engages_consensus": false,
          "falsifiability": "unfalsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "hidden network"
          ],
          "text": "A hidden network controls everything."
        },
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 2,
            "total_citation_chains_described": 3
          },
          "citation_kind": "secondary",
          "cited_source_refs": [
            "s1",
            "s2"
          ],
          "contradicts_consensus": true,
          "engages_consensus": false,
          "falsifiability": "vague",
          "id": "c1",
          "source_tier_refs": [
            "s1",
            "s2"
          ],
          "specificity_anchors": [
            "officials"
          ],
          "text": "Officials refuse to reveal the truth."
        }
      ]
    },
    "id": "unreliable_conspiracy_article",
    "tavily_result": {
      "by_claim_id": {
        "c0": [],
        "c1": []
      }
    }
  },
  {
    "content_confidence": 0.88,
    "content_type": "opinion",
    "description": "Opinion with moderate support and some rhetorical framing.",
    "expected_score_result": {
      "overall_score": 0.550829,
      "verdict": "mixed",
      "linear_score": 0.569041,
      "geometric_core": 0.517008,
      "penalty_total": 0,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.5,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.464739,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 0.333333,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": 0.183692,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 0.666667,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [],
      "actions": [],
      "support_strength": 0.550829,
      "epistemic_risk": 0.238622,
      "claim_state": "unresolved",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 4,
        "visible_source_count": 4,
        "canonical_origin_count": 3,
        "source_collapse_ratio": 0.333333,
        "verified_root_count": 1,
        "contradiction_count": 0,
        "source_independence_confidence": 0.736403
      },
      "content_type": "opinion",
      "weight_profile_used": "opinion",
      "features": {
        "claim_specificity": 0.666667,
        "root_depth": 0.333333,
        "source_independence": 0.5,
        "evidence_volume": 0.464739,
        "external_support_ratio": 1,
        "temporal_spread": 0.183692,
        "consensus_alignment": null,
        "source_tier": 0.85,
        "rhetorical_red_flags": 0.5,
        "citation_chain_closure": 0.666667,
        "claim_falsifiability": 0.6,
        "support_ratio": 1,
        "falsifiability": 0.6,
        "rhetorical_pressure": 0.5,
        "source_quality": 0.85,
        "contradiction_load": 1,
        "citation_chain_collapse": 0.666667
      },
      "claims": [
        {
          "id": "c0",
          "text": "Policy should prioritize long-term adaptation.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.560067,
          "verdict": "mixed",
          "linear_score": 0.579839,
          "geometric_core": 0.523348,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.675348,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.183692,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.675348,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 0.666667,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.560067,
          "epistemic_risk": 0.207031,
          "claim_state": "unresolved",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 5,
            "visible_source_count": 5,
            "canonical_origin_count": 3,
            "source_collapse_ratio": 0.333333,
            "verified_root_count": 1,
            "contradiction_count": 0,
            "source_independence_confidence": 0.811124
          },
          "feature_breakdown": {
            "claim_specificity": 0.666667,
            "root_depth": 0.333333,
            "source_independence": 0.5,
            "evidence_volume": 0.675348,
            "external_support_ratio": 0.675348,
            "temporal_spread": 0.183692,
            "consensus_alignment": null,
            "source_tier": 0.85,
            "rhetorical_red_flags": 0.5,
            "citation_chain_closure": 0.666667,
            "claim_falsifiability": 0.6,
            "support_ratio": 0.675348,
            "falsifiability": 0.6,
            "rhetorical_pressure": 0.5,
            "source_quality": 0.85,
            "contradiction_load": 1,
            "citation_chain_collapse": 0.666667
          },
          "rationale": "Mixed signal: strengths in source_quality, contradiction_load, weaknesses in temporal_spread, root_depth.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.560067.</title>\n  <desc>High in external_support_ratio, source_tier; low in temporal_spread, root_depth.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,33.00 169.40,52.06 182.83,57.58 190.83,75.02 165.18,72.13 160.00,89.00 136.02,98.01 137.17,72.42 129.57,55.11 143.07,41.70\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.560067</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 1,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.88
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.560067.</title>\n  <desc>High in external_support_ratio, source_tier; low in temporal_spread, root_depth.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,33.00 169.40,52.06 182.83,57.58 190.83,75.02 165.18,72.13 160.00,89.00 136.02,98.01 137.17,72.42 129.57,55.11 143.07,41.70\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.560067</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          1,
          1
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 1,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 1
        }
      },
      "cited_sources": [
        {
          "domain": "theatlantic.com",
          "id": "s0",
          "name": "Atlantic",
          "tier": "secondary"
        },
        {
          "domain": "reuters.com",
          "id": "s1",
          "name": "Reuters",
          "tier": "primary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 1,
            "total_citation_chains_described": 2
          },
          "citation_kind": "secondary",
          "cited_source_refs": [
            "s0",
            "s1"
          ],
          "contradicts_consensus": null,
          "engages_consensus": true,
          "falsifiability": "vague",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "policy",
            "adaptation"
          ],
          "text": "Policy should prioritize long-term adaptation."
        }
      ]
    },
    "id": "mixed_opinion_piece",
    "tavily_result": {
      "by_claim_id": {
        "c0": [
          {
            "domain": "theatlantic.com",
            "published_date": "2022-05-01"
          },
          {
            "domain": "reuters.com",
            "published_date": "2024-01-20"
          }
        ]
      }
    }
  },
  {
    "content_confidence": 0.97,
    "content_type": "factual",
    "description": "High-integrity scientific excerpt with primary citations.",
    "expected_score_result": {
      "overall_score": 0.854572,
      "verdict": "trustworthy",
      "linear_score": 0.865971,
      "geometric_core": 0.833402,
      "penalty_total": 0,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.75,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.77687,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": 0.4,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [],
      "actions": [],
      "support_strength": 0.854572,
      "epistemic_risk": 0.03347,
      "claim_state": "well_supported",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 6,
        "visible_source_count": 6,
        "canonical_origin_count": 6,
        "source_collapse_ratio": 0,
        "verified_root_count": 2,
        "contradiction_count": 0,
        "source_independence_confidence": 0.864665
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 1,
        "root_depth": 1,
        "source_independence": 0.75,
        "evidence_volume": 0.77687,
        "external_support_ratio": 1,
        "temporal_spread": 0.4,
        "consensus_alignment": 1,
        "source_tier": 1,
        "rhetorical_red_flags": 1,
        "citation_chain_closure": 1,
        "claim_falsifiability": 1,
        "support_ratio": 1,
        "falsifiability": 1,
        "rhetorical_pressure": 1,
        "source_quality": 1,
        "contradiction_load": 1,
        "citation_chain_collapse": 1
      },
      "claims": [
        {
          "id": "c0",
          "text": "A randomized trial measured outcomes across 12 months.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.816963,
          "verdict": "trustworthy",
          "linear_score": 0.830292,
          "geometric_core": 0.792209,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.713495,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.4,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.713495,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.816963,
          "epistemic_risk": 0.042976,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 6,
            "visible_source_count": 6,
            "canonical_origin_count": 6,
            "source_collapse_ratio": 0,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.864665
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 1,
            "source_independence": 0.75,
            "evidence_volume": 0.713495,
            "external_support_ratio": 0.713495,
            "temporal_spread": 0.4,
            "consensus_alignment": 1,
            "source_tier": 1,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 1,
            "claim_falsifiability": 1,
            "support_ratio": 0.713495,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 1,
            "contradiction_load": 1,
            "citation_chain_collapse": 1
          },
          "rationale": "Trustworthy signal: strong contradiction_load, citation_chain_collapse. Minor weakness: temporal_spread, support_ratio.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.816963.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 194.24,53.88 192.57,75.58 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"40.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"80.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"120.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"200.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"240.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"280.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"40.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"80.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"120.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"200.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"240.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"280.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.816963</text>\n</svg>"
        },
        {
          "id": "c1",
          "text": "The confidence interval excludes zero.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.816963,
          "verdict": "trustworthy",
          "linear_score": 0.830292,
          "geometric_core": 0.792209,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.713495,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.4,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.713495,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.816963,
          "epistemic_risk": 0.042976,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 6,
            "visible_source_count": 6,
            "canonical_origin_count": 6,
            "source_collapse_ratio": 0,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.864665
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 1,
            "source_independence": 0.75,
            "evidence_volume": 0.713495,
            "external_support_ratio": 0.713495,
            "temporal_spread": 0.4,
            "consensus_alignment": 1,
            "source_tier": 1,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 1,
            "claim_falsifiability": 1,
            "support_ratio": 0.713495,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 1,
            "contradiction_load": 1,
            "citation_chain_collapse": 1
          },
          "rationale": "Trustworthy signal: strong contradiction_load, citation_chain_collapse. Minor weakness: temporal_spread, support_ratio.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict trustworthy, score 0.816963.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 194.24,53.88 192.57,75.58 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"40.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"80.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"120.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"200.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"240.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"280.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"40.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"80.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"120.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"200.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"240.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"280.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.816963</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 2,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.97
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.816963.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 194.24,53.88 192.57,75.58 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"40.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"80.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"120.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"200.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"240.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"280.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"40.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"80.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"120.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"200.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"240.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"280.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.816963</text>\n</svg>",
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c1: verdict trustworthy, score 0.816963.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in temporal_spread, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 188.21,26.17 194.24,53.88 192.57,75.58 171.29,80.53 160.00,113.00 131.79,103.83 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"40.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"80.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"120.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"200.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"240.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"280.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"40.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"80.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"120.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"200.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"240.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"280.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.816963</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          4,
          3
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [
        {
          "domain": "nature.com",
          "id": "s0",
          "name": "Nature",
          "tier": "primary"
        },
        {
          "domain": "science.org",
          "id": "s1",
          "name": "Science",
          "tier": "primary"
        },
        {
          "domain": "nejm.org",
          "id": "s2",
          "name": "NEJM",
          "tier": "primary"
        },
        {
          "domain": "jamanetwork.com",
          "id": "s3",
          "name": "JAMA",
          "tier": "primary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "direct_primary",
          "cited_source_refs": [
            "s0",
            "s1"
          ],
          "contradicts_consensus": false,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "randomized",
            "12 months",
            "outcomes"
          ],
          "text": "A randomized trial measured outcomes across 12 months."
        },
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "direct_primary",
          "cited_source_refs": [
            "s2",
            "s3"
          ],
          "contradicts_consensus": false,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c1",
          "source_tier_refs": [
            "s2",
            "s3"
          ],
          "specificity_anchors": [
            "confidence interval",
            "excludes",
            "zero"
          ],
          "text": "The confidence interval excludes zero."
        }
      ]
    },
    "id": "scientific_paper_excerpt",
    "tavily_result": {
      "by_claim_id": {
        "c0": [
          {
            "domain": "nature.com",
            "published_date": "2019-02-01"
          },
          {
            "domain": "science.org",
            "published_date": "2023-07-02"
          }
        ],
        "c1": [
          {
            "domain": "nejm.org",
            "published_date": "2020-01-11"
          },
          {
            "domain": "jamanetwork.com",
            "published_date": "2023-11-19"
          }
        ]
      }
    }
  },
  {
    "content_confidence": 0.93,
    "content_type": "reference",
    "description": "Reference documentation with high falsifiability and low rhetoric.",
    "expected_score_result": {
      "overall_score": 0.488328,
      "verdict": "mixed",
      "linear_score": 0.802599,
      "geometric_core": 0.476111,
      "penalty_total": 0.2,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": false,
          "value": 0,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.430217,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 0.666667,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": null,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [
        {
          "id": "single_source_collapse",
          "severity": 1,
          "weight": 0.2,
          "impact": 0.2,
          "reason": "Supporting evidence collapses into too little source independence."
        }
      ],
      "actions": [
        {
          "id": "request_independent_source",
          "priority": "high",
          "reason": "Add an independent source branch before promotion."
        },
        {
          "id": "defer_promotion",
          "priority": "high",
          "reason": "Do not promote this claim until failed ACC checks are resolved."
        }
      ],
      "support_strength": 0.688328,
      "epistemic_risk": 0.302134,
      "claim_state": "suspect",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 3,
        "visible_source_count": 3,
        "canonical_origin_count": 2,
        "source_collapse_ratio": 0.333333,
        "verified_root_count": 2,
        "contradiction_count": 0,
        "source_independence_confidence": 0.632121
      },
      "content_type": "reference",
      "weight_profile_used": "reference",
      "features": {
        "claim_specificity": 1,
        "root_depth": 0.666667,
        "source_independence": 0,
        "evidence_volume": 0.430217,
        "external_support_ratio": 1,
        "temporal_spread": null,
        "consensus_alignment": null,
        "source_tier": 0.7,
        "rhetorical_red_flags": 1,
        "citation_chain_closure": 0.666667,
        "claim_falsifiability": 1,
        "support_ratio": 1,
        "falsifiability": 1,
        "rhetorical_pressure": 1,
        "source_quality": 0.7,
        "contradiction_load": 1,
        "citation_chain_collapse": 0.666667
      },
      "claims": [
        {
          "id": "c0",
          "text": "Set timeout_ms to 5000 for a 5-second deadline.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.810979,
          "verdict": "trustworthy",
          "linear_score": 0.832127,
          "geometric_core": 0.799912,
          "penalty_total": 0.009873,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.464739,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 0.666667,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": null,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": false,
              "value": 0.464739,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [
            {
              "id": "contradiction_pressure",
              "severity": 0.070522,
              "weight": 0.14,
              "impact": 0.009873,
              "reason": "Contradiction pressure is too high relative to support."
            }
          ],
          "actions": [
            {
              "id": "resolve_contradiction",
              "priority": "medium",
              "reason": "Adjudicate contradiction before trusting the claim."
            }
          ],
          "support_strength": 0.820852,
          "epistemic_risk": 0.170204,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 4,
            "visible_source_count": 4,
            "canonical_origin_count": 3,
            "source_collapse_ratio": 0.333333,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.736403
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 0.666667,
            "source_independence": 0,
            "evidence_volume": 0.464739,
            "external_support_ratio": 0.464739,
            "temporal_spread": null,
            "consensus_alignment": null,
            "source_tier": 0.7,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 0.666667,
            "claim_falsifiability": 1,
            "support_ratio": 0.464739,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 0.7,
            "contradiction_load": 1,
            "citation_chain_collapse": 0.666667
          },
          "rationale": "Trustworthy signal: strong rhetorical_pressure, contradiction_load. Minor weakness: source_independence, support_ratio.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.810979.</title>\n  <desc>High in rhetorical_red_flags, claim_falsifiability; low in source_independence, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 178.81,39.11 160.00,65.00 181.22,71.89 174.11,84.42 160.00,89.00 140.25,92.18 114.35,79.83 129.57,55.11 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"148.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"148.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.810979</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 0,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.93
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict trustworthy, score 0.810979.</title>\n  <desc>High in rhetorical_red_flags, claim_falsifiability; low in source_independence, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 178.81,39.11 160.00,65.00 181.22,71.89 174.11,84.42 160.00,89.00 140.25,92.18 114.35,79.83 129.57,55.11 131.79,26.17\" stroke=\"#4A8A96\" fill=\"#4A8A96\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"148.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.00\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"148.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.00\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#4A8A96\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.810979</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          2,
          2
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [
        {
          "domain": "docs.python.org",
          "id": "s0",
          "name": "Python Docs",
          "tier": "secondary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "indirect_primary",
          "cited_source_refs": [
            "s0"
          ],
          "contradicts_consensus": null,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0"
          ],
          "specificity_anchors": [
            "timeout_ms",
            "5000",
            "deadline"
          ],
          "text": "Set timeout_ms to 5000 for a 5-second deadline."
        }
      ]
    },
    "id": "technical_documentation",
    "tavily_result": null
  },
  {
    "content_confidence": 0.95,
    "content_type": "fiction",
    "description": "Fiction fragment should bypass feature scoring.",
    "expected_score_result": {
      "overall_score": null,
      "verdict": "fiction",
      "content_type": "fiction",
      "weight_profile_used": null,
      "features": null,
      "claims": [],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 0,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.95
      }
    },
    "expected_svg": [],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [],
      "claims": []
    },
    "id": "short_story_fragment",
    "tavily_result": null
  },
  {
    "content_confidence": 0.84,
    "content_type": "factual",
    "description": "No Tavily results available to force temporal redistribution.",
    "expected_score_result": {
      "overall_score": 0.715625,
      "verdict": "trustworthy",
      "linear_score": 0.735775,
      "geometric_core": 0.678205,
      "penalty_total": 0,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.5,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.527633,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 0.333333,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": null,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 1,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [],
      "actions": [],
      "support_strength": 0.715625,
      "epistemic_risk": 0.145855,
      "claim_state": "well_supported",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 4,
        "visible_source_count": 4,
        "canonical_origin_count": 4,
        "source_collapse_ratio": 0,
        "verified_root_count": 1,
        "contradiction_count": 0,
        "source_independence_confidence": 0.736403
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 1,
        "root_depth": 0.333333,
        "source_independence": 0.5,
        "evidence_volume": 0.527633,
        "external_support_ratio": 1,
        "temporal_spread": null,
        "consensus_alignment": null,
        "source_tier": 0.7,
        "rhetorical_red_flags": 1,
        "citation_chain_closure": 1,
        "claim_falsifiability": 1,
        "support_ratio": 1,
        "falsifiability": 1,
        "rhetorical_pressure": 1,
        "source_quality": 0.7,
        "contradiction_load": 1,
        "citation_chain_collapse": 1
      },
      "claims": [
        {
          "id": "c0",
          "text": "The dataset includes 120 verified entries.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.686344,
          "verdict": "mixed",
          "linear_score": 0.704935,
          "geometric_core": 0.651818,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.583138,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": null,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.583138,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 1,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.686344,
          "epistemic_risk": 0.137529,
          "claim_state": "well_supported",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 5,
            "visible_source_count": 5,
            "canonical_origin_count": 5,
            "source_collapse_ratio": 0,
            "verified_root_count": 1,
            "contradiction_count": 0,
            "source_independence_confidence": 0.811124
          },
          "feature_breakdown": {
            "claim_specificity": 1,
            "root_depth": 0.333333,
            "source_independence": 0.5,
            "evidence_volume": 0.583138,
            "external_support_ratio": 0.583138,
            "temporal_spread": null,
            "consensus_alignment": null,
            "source_tier": 0.7,
            "rhetorical_red_flags": 1,
            "citation_chain_closure": 1,
            "claim_falsifiability": 1,
            "support_ratio": 0.583138,
            "falsifiability": 1,
            "rhetorical_pressure": 1,
            "source_quality": 0.7,
            "contradiction_load": 1,
            "citation_chain_collapse": 1
          },
          "rationale": "Mixed signal: strengths in contradiction_load, citation_chain_collapse, weaknesses in root_depth, source_independence.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.686344.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in root_depth, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 169.40,52.06 182.83,57.58 186.62,73.65 174.11,84.42 160.00,89.00 140.25,92.18 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.686344</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 0,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.84
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.686344.</title>\n  <desc>High in citation_chain_closure, claim_falsifiability; low in root_depth, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,17.00 169.40,52.06 182.83,57.58 186.62,73.65 174.11,84.42 160.00,89.00 140.25,92.18 114.35,79.83 114.35,50.17 131.79,26.17\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"87.00\" x2=\"162.00\" y2=\"91.00\" />\n  <line class=\"null-mark\" x1=\"158.00\" y1=\"91.00\" x2=\"162.00\" y2=\"87.00\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.686344</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          2,
          1
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [
        {
          "domain": "wikipedia.org",
          "id": "s0",
          "name": "Wikipedia",
          "tier": "secondary"
        },
        {
          "domain": "britannica.com",
          "id": "s1",
          "name": "Britannica",
          "tier": "secondary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 0,
            "total_citation_chains_described": 1
          },
          "citation_kind": "secondary",
          "cited_source_refs": [
            "s0",
            "s1"
          ],
          "contradicts_consensus": null,
          "engages_consensus": true,
          "falsifiability": "falsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "dataset",
            "120",
            "verified"
          ],
          "text": "The dataset includes 120 verified entries."
        }
      ]
    },
    "id": "null_temporal_spread",
    "tavily_result": null
  },
  {
    "content_confidence": 0.86,
    "content_type": "factual",
    "description": "Near trustworthy boundary to test threshold behavior.",
    "expected_score_result": {
      "overall_score": 0.635563,
      "verdict": "mixed",
      "linear_score": 0.650311,
      "geometric_core": 0.608175,
      "penalty_total": 0,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": true,
          "value": 0.5,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.527633,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": true,
          "value": 0.666667,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": 0.266484,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": true,
          "value": 1,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 0.666667,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [],
      "actions": [],
      "support_strength": 0.635563,
      "epistemic_risk": 0.154188,
      "claim_state": "unresolved",
      "verification_gap": "",
      "diagnostics": {
        "support_branch_count": 4,
        "visible_source_count": 4,
        "canonical_origin_count": 3,
        "source_collapse_ratio": 0.333333,
        "verified_root_count": 2,
        "contradiction_count": 0,
        "source_independence_confidence": 0.736403
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 0.666667,
        "root_depth": 0.666667,
        "source_independence": 0.5,
        "evidence_volume": 0.527633,
        "external_support_ratio": 1,
        "temporal_spread": 0.266484,
        "consensus_alignment": 1,
        "source_tier": 0.85,
        "rhetorical_red_flags": 0.833333,
        "citation_chain_closure": 0.666667,
        "claim_falsifiability": 0.6,
        "support_ratio": 1,
        "falsifiability": 0.6,
        "rhetorical_pressure": 0.833333,
        "source_quality": 0.85,
        "contradiction_load": 1,
        "citation_chain_collapse": 0.666667
      },
      "claims": [
        {
          "id": "c0",
          "text": "A municipal report estimates a 14% change.",
          "char_start": 0,
          "char_end": 64,
          "score": 0.626849,
          "verdict": "mixed",
          "linear_score": 0.639666,
          "geometric_core": 0.603045,
          "penalty_total": 0,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.675348,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": true,
              "value": 0.666667,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": 0.266484,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": true,
              "value": 0.675348,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 0.666667,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [],
          "actions": [],
          "support_strength": 0.626849,
          "epistemic_risk": 0.132031,
          "claim_state": "unresolved",
          "verification_gap": "",
          "diagnostics": {
            "support_branch_count": 5,
            "visible_source_count": 5,
            "canonical_origin_count": 3,
            "source_collapse_ratio": 0.333333,
            "verified_root_count": 2,
            "contradiction_count": 0,
            "source_independence_confidence": 0.811124
          },
          "feature_breakdown": {
            "claim_specificity": 0.666667,
            "root_depth": 0.666667,
            "source_independence": 0.5,
            "evidence_volume": 0.675348,
            "external_support_ratio": 0.675348,
            "temporal_spread": 0.266484,
            "consensus_alignment": 1,
            "source_tier": 0.85,
            "rhetorical_red_flags": 0.833333,
            "citation_chain_closure": 0.666667,
            "claim_falsifiability": 0.6,
            "support_ratio": 0.675348,
            "falsifiability": 0.6,
            "rhetorical_pressure": 0.833333,
            "source_quality": 0.85,
            "contradiction_load": 1,
            "citation_chain_collapse": 0.666667
          },
          "rationale": "Mixed signal: strengths in source_quality, contradiction_load, weaknesses in temporal_spread, source_independence.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.626849.</title>\n  <desc>High in source_tier, consensus_alignment; low in temporal_spread, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,33.00 178.81,39.11 182.83,57.58 190.83,75.02 167.52,75.35 160.00,113.00 136.02,98.01 121.96,77.36 129.57,55.11 143.07,41.70\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.626849</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 1,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.86
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict mixed, score 0.626849.</title>\n  <desc>High in source_tier, consensus_alignment; low in temporal_spread, source_independence.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,33.00 178.81,39.11 182.83,57.58 190.83,75.02 167.52,75.35 160.00,113.00 136.02,98.01 121.96,77.36 129.57,55.11 143.07,41.70\" stroke=\"#C49A4A\" fill=\"#C49A4A\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"96.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"121.60\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"147.20\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"172.80\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"198.40\" y2=\"156.00\" stroke=\"#4A8A96\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"224.00\" y2=\"150.00\" stroke=\"#4A8A96\" />\n  <circle class=\"source-node\" cx=\"96.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"121.60\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"147.20\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"172.80\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"198.40\" cy=\"156.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"0.70\" />\n  <circle class=\"source-node\" cx=\"224.00\" cy=\"150.00\" r=\"4.00\" fill=\"#4A8A96\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C49A4A\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.626849</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          2,
          1
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 1,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [
        {
          "domain": "bbc.com",
          "id": "s0",
          "name": "BBC",
          "tier": "primary"
        },
        {
          "domain": "theatlantic.com",
          "id": "s1",
          "name": "Atlantic",
          "tier": "secondary"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 1,
            "total_citation_chains_described": 2
          },
          "citation_kind": "indirect_primary",
          "cited_source_refs": [
            "s0",
            "s1"
          ],
          "contradicts_consensus": false,
          "engages_consensus": true,
          "falsifiability": "vague",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "municipal report",
            "14%"
          ],
          "text": "A municipal report estimates a 14% change."
        }
      ]
    },
    "id": "boundary_below_0_70",
    "tavily_result": {
      "by_claim_id": {
        "c0": [
          {
            "domain": "bbc.com",
            "published_date": "2022-01-01"
          },
          {
            "domain": "reuters.com",
            "published_date": "2024-01-01"
          }
        ]
      }
    }
  },
  {
    "content_confidence": 0.89,
    "content_type": "factual",
    "description": "Near mixed boundary to test low-score threshold behavior.",
    "expected_score_result": {
      "overall_score": 0,
      "verdict": "unreliable",
      "linear_score": 0.139566,
      "geometric_core": 0.012464,
      "penalty_total": 0.309524,
      "rules": [
        {
          "id": "requires_independent_sources",
          "passed": false,
          "value": 0.333333,
          "threshold": 0.35,
          "reason": "Claim has independent source support."
        },
        {
          "id": "requires_evidence_volume",
          "passed": true,
          "value": 0.393469,
          "threshold": 0.3,
          "reason": "Claim has enough direct support volume to evaluate."
        },
        {
          "id": "requires_rooted_support",
          "passed": false,
          "value": 0,
          "threshold": 0.25,
          "reason": "Support reaches a primary, reviewed, or well-rooted source."
        },
        {
          "id": "requires_temporal_spread",
          "passed": true,
          "value": null,
          "threshold": 0.15,
          "reason": "Evidence does not collapse into a single time window."
        },
        {
          "id": "requires_support_over_contradiction",
          "passed": false,
          "value": 0,
          "threshold": 0.5,
          "reason": "Support is at least balanced against contradiction pressure."
        },
        {
          "id": "requires_specific_claim",
          "passed": true,
          "value": 0.333333,
          "threshold": 0.25,
          "reason": "Claim text has enough concrete anchors to test."
        }
      ],
      "penalties": [
        {
          "id": "single_source_collapse",
          "severity": 0.04762,
          "weight": 0.2,
          "impact": 0.009524,
          "reason": "Supporting evidence collapses into too little source independence."
        },
        {
          "id": "rootless_claim",
          "severity": 1,
          "weight": 0.16,
          "impact": 0.16,
          "reason": "Support does not reach a primary, reviewed, or well-rooted source."
        },
        {
          "id": "contradiction_pressure",
          "severity": 1,
          "weight": 0.14,
          "impact": 0.14,
          "reason": "Contradiction pressure is too high relative to support."
        }
      ],
      "actions": [
        {
          "id": "seek_primary_root",
          "priority": "high",
          "reason": "Trace support back to a reviewed or primary root."
        },
        {
          "id": "resolve_contradiction",
          "priority": "high",
          "reason": "Adjudicate contradiction before trusting the claim."
        },
        {
          "id": "request_independent_source",
          "priority": "medium",
          "reason": "Add an independent source branch before promotion."
        },
        {
          "id": "defer_promotion",
          "priority": "high",
          "reason": "Do not promote this claim until failed ACC checks are resolved."
        }
      ],
      "support_strength": 0.09508,
      "epistemic_risk": 0.847329,
      "claim_state": "source_collapsed",
      "verification_gap": "Multiple citations trace back to fewer canonical origins. Find an independent primary source.",
      "diagnostics": {
        "support_branch_count": 3,
        "visible_source_count": 3,
        "canonical_origin_count": 1,
        "source_collapse_ratio": 1,
        "verified_root_count": 0,
        "contradiction_count": 3,
        "source_independence_confidence": 0.632121
      },
      "content_type": "factual",
      "weight_profile_used": "factual",
      "features": {
        "claim_specificity": 0.333333,
        "root_depth": 0,
        "source_independence": 0.333333,
        "evidence_volume": 0.393469,
        "external_support_ratio": 0.5,
        "temporal_spread": null,
        "consensus_alignment": 0,
        "source_tier": 0.1,
        "rhetorical_red_flags": 0,
        "citation_chain_closure": 0,
        "claim_falsifiability": 0,
        "support_ratio": 0,
        "falsifiability": 0,
        "rhetorical_pressure": 0,
        "source_quality": 0.1,
        "contradiction_load": 0,
        "citation_chain_collapse": 0
      },
      "claims": [
        {
          "id": "c0",
          "text": "Unnamed insiders claim secret evidence exists.",
          "char_start": 0,
          "char_end": 64,
          "score": 0,
          "verdict": "unreliable",
          "linear_score": 0.122845,
          "geometric_core": 0.008091,
          "penalty_total": 0.3,
          "rules": [
            {
              "id": "requires_independent_sources",
              "passed": true,
              "value": null,
              "threshold": 0.35,
              "reason": "Claim has independent source support."
            },
            {
              "id": "requires_evidence_volume",
              "passed": true,
              "value": 0.464739,
              "threshold": 0.3,
              "reason": "Claim has enough direct support volume to evaluate."
            },
            {
              "id": "requires_rooted_support",
              "passed": false,
              "value": 0,
              "threshold": 0.25,
              "reason": "Support reaches a primary, reviewed, or well-rooted source."
            },
            {
              "id": "requires_temporal_spread",
              "passed": true,
              "value": null,
              "threshold": 0.15,
              "reason": "Evidence does not collapse into a single time window."
            },
            {
              "id": "requires_support_over_contradiction",
              "passed": false,
              "value": 0,
              "threshold": 0.5,
              "reason": "Support is at least balanced against contradiction pressure."
            },
            {
              "id": "requires_specific_claim",
              "passed": true,
              "value": 0.333333,
              "threshold": 0.25,
              "reason": "Claim text has enough concrete anchors to test."
            }
          ],
          "penalties": [
            {
              "id": "rootless_claim",
              "severity": 1,
              "weight": 0.16,
              "impact": 0.16,
              "reason": "Support does not reach a primary, reviewed, or well-rooted source."
            },
            {
              "id": "contradiction_pressure",
              "severity": 1,
              "weight": 0.14,
              "impact": 0.14,
              "reason": "Contradiction pressure is too high relative to support."
            }
          ],
          "actions": [
            {
              "id": "seek_primary_root",
              "priority": "high",
              "reason": "Trace support back to a reviewed or primary root."
            },
            {
              "id": "resolve_contradiction",
              "priority": "high",
              "reason": "Adjudicate contradiction before trusting the claim."
            },
            {
              "id": "defer_promotion",
              "priority": "high",
              "reason": "Do not promote this claim until failed ACC checks are resolved."
            }
          ],
          "support_strength": 0.082681,
          "epistemic_risk": 0.830289,
          "claim_state": "source_collapsed",
          "verification_gap": "Multiple citations trace back to fewer canonical origins. Find an independent primary source.",
          "diagnostics": {
            "support_branch_count": 4,
            "visible_source_count": 4,
            "canonical_origin_count": 1,
            "source_collapse_ratio": 1,
            "verified_root_count": 0,
            "contradiction_count": 3,
            "source_independence_confidence": 0.736403
          },
          "feature_breakdown": {
            "claim_specificity": 0.333333,
            "root_depth": 0,
            "source_independence": 0.333333,
            "evidence_volume": 0.464739,
            "external_support_ratio": 0,
            "temporal_spread": null,
            "consensus_alignment": 0,
            "source_tier": 0.1,
            "rhetorical_red_flags": 0,
            "citation_chain_closure": 0,
            "claim_falsifiability": 0,
            "support_ratio": 0,
            "falsifiability": 0,
            "rhetorical_pressure": 0,
            "source_quality": 0.1,
            "contradiction_load": 0,
            "citation_chain_collapse": 0
          },
          "rationale": "Unreliable signal: weak root_depth, support_ratio; limited support from evidence_volume, temporal_spread.",
          "mini_graph_svg": "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict unreliable, score 0.000000.</title>\n  <desc>High in source_independence, temporal_spread; low in root_depth, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 160.00,65.00 175.22,60.06 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 160.00,65.00 160.00,65.00\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.000000</text>\n</svg>"
        }
      ],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 1,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.89
      }
    },
    "expected_svg": [
      "<svg viewBox=\"0 0 320 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <title>Mini-graph for claim c0: verdict unreliable, score 0.000000.</title>\n  <desc>High in source_independence, temporal_spread; low in root_depth, external_support_ratio.</desc>\n  <rect class=\"bg\" x=\"0\" y=\"0\" width=\"320\" height=\"240\" />\n  <style>\n    .bg{fill:#F4F3F0;}\n    .grid{fill:none;stroke:#7B8EA0;stroke-width:1;opacity:0.2;}\n    .axis{stroke:#7B8EA0;stroke-width:1;opacity:0.4;}\n    .axis-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:8px;text-anchor:middle;dominant-baseline:middle;}\n    .reference-poly{fill:none;stroke:#C49A4A;stroke-width:1.5;stroke-dasharray:3 2;opacity:0.6;}\n    .claim-poly{stroke-width:2;fill-opacity:0.25;}\n    .null-mark{fill:none;stroke:#7B8EA0;stroke-width:1;stroke-dasharray:2 2;}\n    .divider{stroke:#7B8EA0;stroke-width:1;opacity:0.35;}\n    .edge{fill:none;stroke-width:1;opacity:0.5;}\n    .source-node{stroke:#1A1A1A;stroke-width:0.5;}\n    .claim-node{stroke:#1A1A1A;stroke-width:1;}\n    .score-label{fill:#1A1A1A;font-family:ui-sans-serif,system-ui,sans-serif;font-size:9px;text-anchor:middle;}\n  </style>\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"12.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"24.00\" />\n  <circle class=\"grid\" cx=\"160.00\" cy=\"65.00\" r=\"36.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"17.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"26.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"205.65\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"188.21\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"160.00\" y2=\"113.00\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"103.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"79.83\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"114.35\" y2=\"50.17\" />\n  <line class=\"axis\" x1=\"160.00\" y1=\"65.00\" x2=\"131.79\" y2=\"26.17\" />\n  <text class=\"axis-label\" x=\"160.00\" y=\"5.00\">SPEC</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"16.46\">ROOT</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"46.46\">IND</text>\n  <text class=\"axis-label\" x=\"217.06\" y=\"83.54\">EXT</text>\n  <text class=\"axis-label\" x=\"195.27\" y=\"113.54\">TIME</text>\n  <text class=\"axis-label\" x=\"160.00\" y=\"125.00\">CONS</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"113.54\">TIER</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"83.54\">FLAG</text>\n  <text class=\"axis-label\" x=\"102.94\" y=\"46.46\">CHAIN</text>\n  <text class=\"axis-label\" x=\"124.73\" y=\"16.46\">FALSE</text>\n  <polygon class=\"reference-poly\" points=\"160.00,29.00 181.16,35.88 194.24,53.88 194.24,76.12 181.16,94.12 160.00,101.00 138.84,94.12 125.76,76.12 125.76,53.88 138.84,35.88\" />\n  <polygon class=\"claim-poly\" points=\"160.00,49.00 160.00,65.00 175.22,60.06 160.00,65.00 174.11,84.42 160.00,65.00 157.18,68.88 160.00,65.00 160.00,65.00 160.00,65.00\" stroke=\"#C4503C\" fill=\"#C4503C\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"82.42\" x2=\"176.11\" y2=\"86.42\" />\n  <line class=\"null-mark\" x1=\"172.11\" y1=\"86.42\" x2=\"176.11\" y2=\"82.42\" />\n  <line class=\"divider\" x1=\"16.00\" y1=\"135.00\" x2=\"304.00\" y2=\"135.00\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"124.00\" y2=\"162.00\" stroke=\"#C49A4A\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"142.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"160.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"178.00\" y2=\"175.00\" stroke=\"#C4503C\" />\n  <line class=\"edge\" x1=\"160.00\" y1=\"210.00\" x2=\"196.00\" y2=\"168.00\" stroke=\"#7B8EA0\" />\n  <circle class=\"source-node\" cx=\"124.00\" cy=\"162.00\" r=\"4.00\" fill=\"#C49A4A\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"142.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"160.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"178.00\" cy=\"175.00\" r=\"4.00\" fill=\"#C4503C\" fill-opacity=\"1.00\" />\n  <circle class=\"source-node\" cx=\"196.00\" cy=\"168.00\" r=\"4.00\" fill=\"#7B8EA0\" fill-opacity=\"1.00\" />\n  <circle class=\"claim-node\" cx=\"160.00\" cy=\"210.00\" r=\"6.00\" fill=\"#C4503C\" />\n  <text class=\"score-label\" x=\"160.00\" y=\"222.00\">0.000000</text>\n</svg>"
    ],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [
          1,
          0
        ],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 1,
          "emotional_appeal_decoupled": 2,
          "false_precision": 1,
          "identity_based_dismissal": 1,
          "suppressed_truth_narrative": 1,
          "urgency_framing": 2
        }
      },
      "cited_sources": [
        {
          "domain": "disinfo-example-003.com",
          "id": "s0",
          "name": "Example Feed",
          "tier": "self_referential"
        },
        {
          "domain": "unranked-example-010.org",
          "id": "s1",
          "name": "Unknown Mirror",
          "tier": "unknown"
        }
      ],
      "claims": [
        {
          "char_end": 64,
          "char_start": 0,
          "citation_chain_markers": {
            "self_reinforcing_citations": 2,
            "total_citation_chains_described": 3
          },
          "citation_kind": "unanchored",
          "cited_source_refs": [
            "s0",
            "s0",
            "s1"
          ],
          "contradicts_consensus": true,
          "engages_consensus": false,
          "falsifiability": "unfalsifiable",
          "id": "c0",
          "source_tier_refs": [
            "s0",
            "s1"
          ],
          "specificity_anchors": [
            "insiders"
          ],
          "text": "Unnamed insiders claim secret evidence exists."
        }
      ]
    },
    "id": "boundary_below_0_40",
    "tavily_result": {
      "by_claim_id": {
        "c0": []
      }
    }
  },
  {
    "content_confidence": 0.91,
    "content_type": "fiction",
    "description": "Satirical framing treated as fiction by front gate.",
    "expected_score_result": {
      "overall_score": null,
      "verdict": "fiction",
      "content_type": "fiction",
      "weight_profile_used": null,
      "features": null,
      "claims": [],
      "meta": {
        "algorithm_version": "2.1.0",
        "model_version": "unknown",
        "runtime": "python",
        "tavily_calls_made": 0,
        "elapsed_ms": 0,
        "content_classifier_confidence": 0.91
      }
    },
    "expected_svg": [],
    "extraction": {
      "article_level": {
        "checkable_facts_per_paragraph": [],
        "rhetorical_red_flags": {
          "appeal_to_hidden_knowledge": 0,
          "emotional_appeal_decoupled": 0,
          "false_precision": 0,
          "identity_based_dismissal": 0,
          "suppressed_truth_narrative": 0,
          "urgency_framing": 0
        }
      },
      "cited_sources": [],
      "claims": []
    },
    "id": "satire_article",
    "tavily_result": null
  }
];

export default FIXTURES;
