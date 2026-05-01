import { getParentOrg, getTier } from "./domain-list.js";
import { ALGORITHM_VERSION } from "../shared/config.js";
import { renderClaimMiniGraph } from "./mini-graph-render.js";

export const FACTUAL_WEIGHTS = {
  claim_specificity: 0.1,
  root_depth: 0.11,
  source_independence: 0.12,
  external_support_ratio: 0.08,
  temporal_spread: 0.14,
  consensus_alignment: 0.05,
  source_tier: 0.11,
  rhetorical_red_flags: 0.07,
  citation_chain_closure: 0.08,
  claim_falsifiability: 0.14,
};

export const OPINION_WEIGHTS = {
  claim_specificity: 0.08,
  root_depth: 0.06,
  source_independence: 0.1,
  external_support_ratio: 0.06,
  temporal_spread: 0.12,
  consensus_alignment: 0.04,
  source_tier: 0.08,
  rhetorical_red_flags: 0.14,
  citation_chain_closure: 0.08,
  claim_falsifiability: 0.24,
};

export const REFERENCE_WEIGHTS = {
  claim_specificity: 0.16,
  root_depth: 0.06,
  source_independence: 0.06,
  external_support_ratio: 0.04,
  temporal_spread: 0.08,
  consensus_alignment: 0.1,
  source_tier: 0.06,
  rhetorical_red_flags: 0.12,
  citation_chain_closure: 0.04,
  claim_falsifiability: 0.28,
};

const FEATURE_KEYS = [
  "claim_specificity",
  "root_depth",
  "source_independence",
  "external_support_ratio",
  "temporal_spread",
  "consensus_alignment",
  "source_tier",
  "rhetorical_red_flags",
  "citation_chain_closure",
  "claim_falsifiability",
];

const PER_CLAIM_FEATURE_KEYS = [
  "claim_specificity",
  "root_depth",
  "temporal_spread",
  "consensus_alignment",
  "source_tier",
  "citation_chain_closure",
  "claim_falsifiability",
];

const CITATION_DEPTH_SCORES = {
  direct_primary: 3,
  indirect_primary: 2,
  secondary: 1,
  unanchored: 0,
};

const SOURCE_TIER_WEIGHTS = {
  primary: 1.0,
  secondary: 0.7,
  tertiary: 0.4,
  self_referential: 0.1,
};

const FALSIFIABILITY_WEIGHTS = {
  falsifiable: 1.0,
  vague: 0.6,
  unfalsifiable: 0.0,
};

const TAVILY_TIER_WEIGHTS = {
  1: 1.0,
  2: 0.6,
  3: 0.3,
  4: 0.1,
  5: -0.5,
};

export function round6(n) {
  return Number(Number(n).toFixed(6));
}

function assertWeightProfiles() {
  const profiles = [FACTUAL_WEIGHTS, OPINION_WEIGHTS, REFERENCE_WEIGHTS];
  for (const profile of profiles) {
    const sum = round6(Object.values(profile).reduce((acc, value) => round6(acc + value), 0));
    if (sum !== 1) {
      throw new Error(`Weight profile must sum to 1.0, got ${sum}`);
    }
  }
}

assertWeightProfiles();

function clamp01(n) {
  return round6(Math.max(0, Math.min(1, Number(n))));
}

function mean(values, defaultValue = 0) {
  if (!values.length) {
    return round6(defaultValue);
  }
  return round6(values.reduce((acc, value) => round6(acc + value), 0) / values.length);
}

function toTavilyResult(tavilyResult) {
  if (tavilyResult == null) {
    return null;
  }
  if (typeof tavilyResult !== "object") {
    return null;
  }
  const byClaimId = tavilyResult.by_claim_id ?? tavilyResult;
  if (!byClaimId || typeof byClaimId !== "object" || Array.isArray(byClaimId)) {
    return null;
  }
  return { by_claim_id: byClaimId };
}

function getWeightsForContentType(contentType) {
  const normalized = String(contentType || "").trim().toLowerCase();
  if (normalized === "factual") {
    return { ...FACTUAL_WEIGHTS };
  }
  if (normalized === "opinion") {
    return { ...OPINION_WEIGHTS };
  }
  if (normalized === "reference") {
    return { ...REFERENCE_WEIGHTS };
  }
  throw new Error(`Unknown content type: ${contentType}`);
}

function scoreToVerdict(score) {
  if (score >= 0.7) {
    return "trustworthy";
  }
  if (score >= 0.4) {
    return "mixed";
  }
  return "unreliable";
}

function sourceIndex(extraction) {
  const index = {};
  for (const source of extraction.cited_sources || []) {
    index[source.id] = {
      domain: source.domain,
      tier: source.tier,
    };
  }
  return index;
}

function allCitations(extraction) {
  const refs = [];
  for (const claim of extraction.claims || []) {
    refs.push(...(claim.cited_source_refs || []));
  }
  return refs;
}

function claimSpecificity(extraction) {
  const perClaim = [];
  for (const claim of extraction.claims || []) {
    const anchorCount = (claim.specificity_anchors || []).length;
    perClaim.push(round6(Math.min(round6(anchorCount / 3), 1)));
  }
  return mean(perClaim, 0);
}

function rootDepth(extraction) {
  const perClaim = [];
  for (const claim of extraction.claims || []) {
    const score = CITATION_DEPTH_SCORES[claim.citation_kind] ?? 0;
    perClaim.push(round6(score / 3));
  }
  return mean(perClaim, 0);
}

function sourceIndependence(extraction) {
  const sourceMap = sourceIndex(extraction);
  const citations = allCitations(extraction);
  const total = citations.length;
  if (total === 0) {
    return 0.1;
  }

  const parentCounts = new Map();
  for (const ref of citations) {
    const source = sourceMap[ref] || {};
    const parent = getParentOrg(source.domain);
    parentCounts.set(parent, (parentCounts.get(parent) || 0) + 1);
  }
  const maxShare = round6(Math.max(...Array.from(parentCounts.values())) / total);
  return clamp01(round6(1 - maxShare));
}

function externalSupportRatio(articleLevel) {
  const list = articleLevel?.checkable_facts_per_paragraph || [];
  const totalCheckable = round6(list.reduce((acc, value) => round6(acc + value), 0));
  const totalParagraphs = list.length;
  const ratio = round6(totalCheckable / Math.max(totalParagraphs, 1));
  return clamp01(Math.min(ratio, 1));
}

function parseDate(raw) {
  if (!raw) {
    return null;
  }
  const text = String(raw).trim();
  if (!text) {
    return null;
  }
  const d = new Date(text.slice(0, 10));
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return d;
}

function temporalForClaim(claim, tavilyResult) {
  if (!tavilyResult) {
    return null;
  }
  const rows = tavilyResult.by_claim_id?.[claim.id] || [];
  if (!rows.length) {
    return null;
  }
  let dates = rows.map((row) => parseDate(row.published_date)).filter(Boolean);
  if (!dates.length) {
    return null;
  }
  dates = dates.sort((a, b) => a.getTime() - b.getTime());
  const oldest = dates[0];
  const newest = dates[dates.length - 1];
  const years = round6((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  const longevity = round6(Math.min(round6(years / 3), 1));

  let diversityRaw = 0;
  for (const row of rows) {
    diversityRaw = round6(diversityRaw + (TAVILY_TIER_WEIGHTS[getTier(row.domain)] ?? 0.1));
  }
  const diversity = clamp01(round6(diversityRaw / 5));
  return clamp01(round6(longevity * diversity));
}

function temporalSpread(extraction, tavilyResult) {
  const ordered = [...(extraction.claims || [])].sort((a, b) => {
    const byAnchors = (b.specificity_anchors || []).length - (a.specificity_anchors || []).length;
    if (byAnchors !== 0) {
      return byAnchors;
    }
    return String(a.id).localeCompare(String(b.id));
  });

  const topClaims = ordered.slice(0, 3);
  const spreads = [];
  for (const claim of topClaims) {
    const score = temporalForClaim(claim, tavilyResult);
    if (score != null) {
      spreads.push(score);
    }
  }
  if (!spreads.length) {
    return null;
  }
  return mean(spreads);
}

function consensusAlignment(extraction) {
  let total = 0;
  let unengaged = 0;
  for (const claim of extraction.claims || []) {
    if (claim.contradicts_consensus == null) {
      continue;
    }
    total += 1;
    if (claim.contradicts_consensus && !claim.engages_consensus) {
      unengaged += 1;
    }
  }
  if (total === 0) {
    return null;
  }
  const score = round6(1 - round6(unengaged / total));
  return clamp01(score);
}

function sourceTier(extraction) {
  const known = (extraction.cited_sources || []).filter((source) => source.tier !== "unknown");
  if (!known.length) {
    return 0.3;
  }
  const weights = known.map((source) => SOURCE_TIER_WEIGHTS[source.tier] ?? 0.3);
  return mean(weights);
}

function rhetoricalRedFlags(articleLevel) {
  const flags = articleLevel.rhetorical_red_flags;
  const weighted = round6(
    round6(2 * flags.urgency_framing) +
      round6(2 * flags.suppressed_truth_narrative) +
      round6(1.5 * flags.appeal_to_hidden_knowledge) +
      round6(1 * flags.emotional_appeal_decoupled) +
      round6(1 * flags.identity_based_dismissal) +
      round6(1 * flags.false_precision),
  );
  const penalty = round6(Math.min(round6(weighted / 6), 1));
  return clamp01(round6(1 - penalty));
}

function topSourceShare(claim, extraction) {
  if (!(claim.cited_source_refs || []).length) {
    return 0;
  }
  const map = sourceIndex(extraction);
  const parentCounts = new Map();
  for (const ref of claim.cited_source_refs || []) {
    const source = map[ref] || {};
    const parent = getParentOrg(source.domain);
    parentCounts.set(parent, (parentCounts.get(parent) || 0) + 1);
  }
  return round6(Math.max(...Array.from(parentCounts.values())) / claim.cited_source_refs.length);
}

function citationChainClosure(extraction) {
  const citations = allCitations(extraction);
  if (!(extraction.claims || []).length) {
    return 1;
  }

  const map = sourceIndex(extraction);
  const parentCounts = new Map();
  for (const ref of citations) {
    const source = map[ref] || {};
    const parent = getParentOrg(source.domain);
    parentCounts.set(parent, (parentCounts.get(parent) || 0) + 1);
  }
  let topShare = 0;
  if (citations.length && parentCounts.size) {
    topShare = round6(Math.max(...Array.from(parentCounts.values())) / citations.length);
  }

  let selfReinforcing = 0;
  for (const claim of extraction.claims || []) {
    selfReinforcing += claim.citation_chain_markers.self_reinforcing_citations;
  }

  const closureScore = round6(selfReinforcing + (topShare > 0.5 ? 1 : 0));
  const penalty = round6(Math.min(round6(closureScore / 3), 1));
  return clamp01(round6(1 - penalty));
}

function claimFalsifiability(extraction) {
  const weights = (extraction.claims || []).map((claim) => FALSIFIABILITY_WEIGHTS[claim.falsifiability] ?? 0);
  return mean(weights, 0);
}

function claimLevelFeatures(claim, extraction, tavilyResult) {
  const index = sourceIndex(extraction);

  const f1 = round6(Math.min(round6((claim.specificity_anchors || []).length / 3), 1));
  const f2 = round6((CITATION_DEPTH_SCORES[claim.citation_kind] ?? 0) / 3);
  const f5 = temporalForClaim(claim, tavilyResult);

  let f6;
  if (claim.contradicts_consensus == null) {
    f6 = null;
  } else {
    f6 = claim.contradicts_consensus && !claim.engages_consensus ? 0 : 1;
  }

  const sourceWeights = [];
  for (const ref of claim.source_tier_refs || []) {
    const source = index[ref];
    if (!source) {
      continue;
    }
    const tier = source.tier || "unknown";
    if (tier === "unknown") {
      continue;
    }
    sourceWeights.push(SOURCE_TIER_WEIGHTS[tier] ?? 0.3);
  }
  const f7 = mean(sourceWeights, 0.3);

  const closureScore = round6(
    claim.citation_chain_markers.self_reinforcing_citations + (topSourceShare(claim, extraction) > 0.5 ? 1 : 0),
  );
  const f9 = clamp01(round6(1 - Math.min(round6(closureScore / 3), 1)));

  const f10 = FALSIFIABILITY_WEIGHTS[claim.falsifiability] ?? 0;

  return {
    claim_specificity: f1,
    root_depth: f2,
    temporal_spread: f5,
    consensus_alignment: f6,
    source_tier: f7,
    citation_chain_closure: f9,
    claim_falsifiability: round6(f10),
  };
}

export function computeFeatureScores(extraction, tavilyResult) {
  const tavily = toTavilyResult(tavilyResult);
  const features = {
    claim_specificity: claimSpecificity(extraction),
    root_depth: rootDepth(extraction),
    source_independence: sourceIndependence(extraction),
    external_support_ratio: externalSupportRatio(extraction.article_level),
    temporal_spread: temporalSpread(extraction, tavily),
    consensus_alignment: consensusAlignment(extraction),
    source_tier: sourceTier(extraction),
    rhetorical_red_flags: rhetoricalRedFlags(extraction.article_level),
    citation_chain_closure: citationChainClosure(extraction),
    claim_falsifiability: claimFalsifiability(extraction),
  };

  for (const key of FEATURE_KEYS) {
    if (features[key] != null) {
      features[key] = round6(features[key]);
    }
  }
  return features;
}

export function computeOverallScore(features, profileWeights) {
  const available = {};
  const missing = [];
  for (const key of Object.keys(profileWeights)) {
    if (features[key] == null) {
      missing.push(key);
    } else {
      available[key] = features[key];
    }
  }

  let effectiveWeights;
  if (missing.length) {
    const missingWeight = round6(missing.reduce((acc, key) => round6(acc + profileWeights[key]), 0));
    const availableWeight = round6(Object.keys(available).reduce((acc, key) => round6(acc + profileWeights[key]), 0));
    const scale = round6(1 + round6(missingWeight / availableWeight));
    effectiveWeights = {};
    for (const key of Object.keys(available)) {
      effectiveWeights[key] = round6(profileWeights[key] * scale);
    }
  } else {
    effectiveWeights = {};
    for (const key of Object.keys(available)) {
      effectiveWeights[key] = round6(profileWeights[key]);
    }
  }

  let raw = 0;
  for (const [key, value] of Object.entries(available)) {
    raw = round6(raw + round6(value * effectiveWeights[key]));
  }

  const score = clamp01(raw);
  return { score, verdict: scoreToVerdict(score) };
}

export function computePerClaimScore(claimFeatures, profileWeights) {
  const eligible = {};
  for (const key of PER_CLAIM_FEATURE_KEYS) {
    if (claimFeatures[key] != null) {
      eligible[key] = claimFeatures[key];
    }
  }
  if (!Object.keys(eligible).length) {
    return { score: 0, verdict: "unreliable" };
  }

  const baseTotal = round6(PER_CLAIM_FEATURE_KEYS.reduce((acc, key) => round6(acc + profileWeights[key]), 0));
  const renormalized = {};
  for (const key of PER_CLAIM_FEATURE_KEYS) {
    renormalized[key] = round6(profileWeights[key] / baseTotal);
  }

  const missing = PER_CLAIM_FEATURE_KEYS.filter((key) => !(key in eligible));
  let weights;
  if (missing.length) {
    const missingWeight = round6(missing.reduce((acc, key) => round6(acc + renormalized[key]), 0));
    const availableWeight = round6(Object.keys(eligible).reduce((acc, key) => round6(acc + renormalized[key]), 0));
    const scale = round6(1 + round6(missingWeight / availableWeight));
    weights = {};
    for (const key of Object.keys(eligible)) {
      weights[key] = round6(renormalized[key] * scale);
    }
  } else {
    weights = { ...renormalized };
  }

  let raw = 0;
  for (const [key, value] of Object.entries(eligible)) {
    raw = round6(raw + round6(value * weights[key]));
  }

  const score = clamp01(raw);
  return { score, verdict: scoreToVerdict(score) };
}

function buildClaimFeatureSet(claimOnlyFeatures, articleFeatures) {
  const merged = { ...articleFeatures };
  for (const [key, value] of Object.entries(claimOnlyFeatures)) {
    merged[key] = value;
  }
  return merged;
}

function claimRationale(claimFeatures, verdict) {
  const ranked = FEATURE_KEYS.map((key) => [key, claimFeatures[key] == null ? 0.5 : Number(claimFeatures[key])]).sort(
    (a, b) => a[1] - b[1],
  );
  const lowest = ranked.slice(0, 2).map((item) => item[0]).join(", ");
  const highest = ranked.slice(-2).map((item) => item[0]).join(", ");
  if (verdict === "trustworthy") {
    return `Trustworthy signal: strong ${highest}. Minor weakness: ${lowest}.`.slice(0, 240);
  }
  if (verdict === "mixed") {
    return `Mixed signal: strengths in ${highest}, weaknesses in ${lowest}.`.slice(0, 240);
  }
  return `Unreliable signal: weak ${lowest}; limited support from ${highest}.`.slice(0, 240);
}

function tavilyCallsMade(extraction, tavilyResult) {
  if (!tavilyResult) {
    return 0;
  }
  const ordered = [...(extraction.claims || [])].sort((a, b) => {
    const byAnchors = (b.specificity_anchors || []).length - (a.specificity_anchors || []).length;
    if (byAnchors !== 0) {
      return byAnchors;
    }
    return String(a.id).localeCompare(String(b.id));
  });
  const topIds = new Set(ordered.slice(0, 3).map((claim) => claim.id));
  let count = 0;
  for (const claimId of topIds) {
    if (claimId in tavilyResult.by_claim_id) {
      count += 1;
    }
  }
  return count;
}

export function scoreText(extraction, tavilyResult, contentType, contentConfidence) {
  let normalizedType = String(contentType || "factual").trim().toLowerCase();
  const confidence = clamp01(contentConfidence);
  const tavily = toTavilyResult(tavilyResult);

  if (normalizedType === "fiction" && confidence > 0.7) {
    return {
      overall_score: null,
      verdict: "fiction",
      content_type: "fiction",
      weight_profile_used: null,
      features: null,
      claims: [],
      meta: {
        algorithm_version: ALGORITHM_VERSION,
        model_version: "unknown",
        runtime: "python",
        tavily_calls_made: 0,
        elapsed_ms: 0,
        content_classifier_confidence: confidence,
      },
    };
  }

  if (!["factual", "opinion", "reference"].includes(normalizedType)) {
    normalizedType = "factual";
  }

  const profileWeights = getWeightsForContentType(normalizedType);
  const articleFeatures = computeFeatureScores(extraction, tavily);
  const overall = computeOverallScore(articleFeatures, profileWeights);

  const claims = [];
  for (const claim of extraction.claims || []) {
    const claimOnly = claimLevelFeatures(claim, extraction, tavily);
    const claimBreakdown = buildClaimFeatureSet(claimOnly, articleFeatures);
    const claimScore = computePerClaimScore(claimOnly, profileWeights);

    const result = {
      id: claim.id,
      text: claim.text,
      char_start: claim.char_start,
      char_end: claim.char_end,
      score: claimScore.score,
      verdict: claimScore.verdict,
      feature_breakdown: claimBreakdown,
      rationale: claimRationale(claimBreakdown, claimScore.verdict),
      mini_graph_svg: "",
    };

    result.mini_graph_svg = renderClaimMiniGraph(result);
    claims.push(result);
  }

  return {
    overall_score: overall.score,
    verdict: overall.verdict,
    content_type: normalizedType,
    weight_profile_used: normalizedType,
    features: articleFeatures,
    claims,
    meta: {
      algorithm_version: ALGORITHM_VERSION,
      model_version: "unknown",
      runtime: "python",
      tavily_calls_made: tavilyCallsMade(extraction, tavily),
      elapsed_ms: 0,
      content_classifier_confidence: confidence,
    },
  };
}
