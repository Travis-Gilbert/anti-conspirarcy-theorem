from . import diagnostics
from .algorithm import ACCReport, ClaimACC, DEFAULT_WEIGHTS, compute_acc
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
