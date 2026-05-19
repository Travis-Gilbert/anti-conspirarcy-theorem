from . import a2ui, diagnostics, outcomes, schemas
from .a2ui import (
    build_evidence_scene,
    build_model_adjusted_evidence_scene,
    validate_evidence_scene,
)
from .algorithm import ACCReport, ClaimACC, DEFAULT_WEIGHTS, compute_acc
from .outcomes import (
    ACCDecisionEvent,
    ACCOutcomeEvent,
    ACCUpdateProposal,
    ACCVersion,
    pair_decisions_with_outcomes,
    propose_threshold_update,
    threshold_metrics,
)
from .rules import ACC_V2_VERSION
from .traits import (
    citation_chain_collapse,
    claim_specificity,
    contradiction_load,
    evidence_volume,
    falsifiability,
    rhetorical_pressure,
    root_depth,
    source_independence,
    source_quality,
    support_ratio,
    temporal_spread,
)

__all__ = [
    'ACC_V2_VERSION',
    'ACCReport',
    'ClaimACC',
    'DEFAULT_WEIGHTS',
    'compute_acc',
    'diagnostics',
    'outcomes',
    'a2ui',
    'schemas',
    'build_evidence_scene',
    'build_model_adjusted_evidence_scene',
    'validate_evidence_scene',
    'ACCDecisionEvent',
    'ACCOutcomeEvent',
    'ACCUpdateProposal',
    'ACCVersion',
    'pair_decisions_with_outcomes',
    'propose_threshold_update',
    'threshold_metrics',
    # Trait functions (public for callers building custom pipelines).
    'citation_chain_collapse',
    'claim_specificity',
    'contradiction_load',
    'evidence_volume',
    'falsifiability',
    'rhetorical_pressure',
    'root_depth',
    'source_independence',
    'source_quality',
    'support_ratio',
    'temporal_spread',
]
