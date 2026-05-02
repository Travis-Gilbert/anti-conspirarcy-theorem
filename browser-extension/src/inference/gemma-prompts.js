const MAX_PROMPT_CHARS = 12000;
const MAX_CLAIMS = 8;

const CONTENT_TYPES = new Set(["factual", "opinion", "reference", "fiction"]);
const CITATION_KINDS = new Set(["direct_primary", "indirect_primary", "secondary", "unanchored"]);
const SOURCE_TIERS = new Set(["primary", "secondary", "tertiary", "self_referential", "unknown"]);
const FALSIFIABILITY = new Set(["falsifiable", "vague", "unfalsifiable"]);
const RHETORICAL_FLAG_KEYS = [
  "urgency_framing",
  "suppressed_truth_narrative",
  "emotional_appeal_decoupled",
  "identity_based_dismissal",
  "false_precision",
  "appeal_to_hidden_knowledge",
];

export const CLASSIFY_RESPONSE_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  required: ["content_type", "confidence"],
  properties: {
    content_type: { enum: ["factual", "opinion", "reference", "fiction"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    rationale: { type: "string" },
  },
});

export const EXTRACTION_RESPONSE_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  required: ["claims", "article_level", "cited_sources"],
  properties: {
    claims: {
      type: "array",
      maxItems: MAX_CLAIMS,
      items: {
        type: "object",
        required: [
          "text",
          "specificity_anchors",
          "citation_kind",
          "cited_source_refs",
          "source_tier_refs",
          "citation_chain_markers",
          "falsifiability",
        ],
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          char_start: { type: "number" },
          char_end: { type: "number" },
          specificity_anchors: { type: "array", items: { type: "string" } },
          citation_kind: { enum: ["direct_primary", "indirect_primary", "secondary", "unanchored"] },
          cited_source_refs: { type: "array", items: { type: "string" } },
          contradicts_consensus: { type: ["boolean", "null"] },
          engages_consensus: { type: "boolean" },
          source_tier_refs: { type: "array", items: { type: "string" } },
          citation_chain_markers: {
            type: "object",
            properties: {
              self_reinforcing_citations: { type: "number" },
              total_citation_chains_described: { type: "number" },
            },
          },
          falsifiability: { enum: ["falsifiable", "vague", "unfalsifiable"] },
        },
      },
    },
    article_level: {
      type: "object",
      required: ["checkable_facts_per_paragraph", "rhetorical_red_flags"],
      properties: {
        checkable_facts_per_paragraph: { type: "array", items: { type: "number" } },
        rhetorical_red_flags: { type: "object" },
      },
    },
    cited_sources: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "domain", "name", "tier"],
        properties: {
          id: { type: "string" },
          domain: { type: "string" },
          name: { type: "string" },
          tier: { enum: ["primary", "secondary", "tertiary", "self_referential", "unknown"] },
        },
      },
    },
  },
});

export const CLASSIFY_PROMPT_TEMPLATE = `<|classify|>
You classify text into one of four content types for an epistemic integrity engine.

Return exactly one JSON object with these keys and no extras:
- content_type: one of factual, opinion, reference, fiction
- confidence: float in [0, 1]
- rationale: short plain-language reason (<= 200 chars)

Definitions:
- factual: makes checkable claims about the world and can be evaluated against evidence
- opinion: primarily argues a stance, preference, or interpretation
- reference: procedural, documentation, API, glossary, or lookup style material
- fiction: narrative or imaginative writing not asserting real-world empirical truth

Rules:
- Satire is fiction.
- Output JSON only. No markdown. No code fences.
- Use concise rationale.

Examples:
Input: "The trial enrolled 412 participants and measured outcomes at 12 months."
Output: {"content_type":"factual","confidence":0.96,"rationale":"Contains specific empirical claims and measurable outcomes."}

Input: "I think this policy is too rigid and should be revised next quarter."
Output: {"content_type":"opinion","confidence":0.91,"rationale":"Primarily expresses normative judgment and recommendation."}

Input: "Set timeout_ms to 5000 and retry once on parse failure."
Output: {"content_type":"reference","confidence":0.94,"rationale":"Procedural documentation with configuration instructions."}

Input: "At dusk, the iron moon spoke to the river and the city answered in song."
Output: {"content_type":"fiction","confidence":0.97,"rationale":"Imaginative narrative language not asserting empirical fact."}

Now classify this input:
{text}`;

export const EXTRACT_PROMPT_TEMPLATE = `<|extract|>
You extract deterministic epistemic features from text.

Return exactly one JSON object matching this schema:
{
  "claims": [
    {
      "id": "c0",
      "text": "...",
      "char_start": 0,
      "char_end": 42,
      "specificity_anchors": ["..."],
      "citation_kind": "direct_primary" | "indirect_primary" | "secondary" | "unanchored",
      "cited_source_refs": ["s0"],
      "contradicts_consensus": true | false | null,
      "engages_consensus": true | false,
      "source_tier_refs": ["s0"],
      "citation_chain_markers": {
        "self_reinforcing_citations": 0,
        "total_citation_chains_described": 1
      },
      "falsifiability": "falsifiable" | "vague" | "unfalsifiable"
    }
  ],
  "article_level": {
    "checkable_facts_per_paragraph": [2,1],
    "rhetorical_red_flags": {
      "urgency_framing": 0,
      "suppressed_truth_narrative": 0,
      "emotional_appeal_decoupled": 0,
      "identity_based_dismissal": 0,
      "false_precision": 0,
      "appeal_to_hidden_knowledge": 0
    }
  },
  "cited_sources": [
    {
      "id": "s0",
      "domain": "example.org",
      "name": "Example Source",
      "tier": "primary" | "secondary" | "tertiary" | "self_referential" | "unknown"
    }
  ]
}

Requirements:
- Output JSON only. No prose, markdown, or code fences.
- Use ids c0, c1, ... for claims; s0, s1, ... for cited sources.
- Keep char offsets within input text bounds.
- Use null for contradicts_consensus when judgment is unavailable.
- If content_type is fiction, return minimal extraction:
  {"claims":[],"article_level":{"checkable_facts_per_paragraph":[],"rhetorical_red_flags":{all zeros}},"cited_sources":[]}

Few-shot example 1 (trustworthy style):
Input content_type: factual
Input text:
"Independent labs replicated the assay in 2024 and published error bars in peer-reviewed journals."
Output:
{"claims":[{"id":"c0","text":"Independent labs replicated the assay in 2024.","char_start":0,"char_end":52,"specificity_anchors":["independent labs","replicated","2024"],"citation_kind":"direct_primary","cited_source_refs":["s0","s1"],"contradicts_consensus":false,"engages_consensus":true,"source_tier_refs":["s0","s1"],"citation_chain_markers":{"self_reinforcing_citations":0,"total_citation_chains_described":1},"falsifiability":"falsifiable"}],"article_level":{"checkable_facts_per_paragraph":[2],"rhetorical_red_flags":{"urgency_framing":0,"suppressed_truth_narrative":0,"emotional_appeal_decoupled":0,"identity_based_dismissal":0,"false_precision":0,"appeal_to_hidden_knowledge":0}},"cited_sources":[{"id":"s0","domain":"reuters.com","name":"Reuters","tier":"primary"},{"id":"s1","domain":"nature.com","name":"Nature","tier":"primary"}]}

Few-shot example 2 (unreliable style):
Input content_type: factual
Input text:
"Unnamed insiders say hidden forces control every institution and no records can be shown."
Output:
{"claims":[{"id":"c0","text":"Hidden forces control every institution.","char_start":21,"char_end":62,"specificity_anchors":["hidden forces"],"citation_kind":"unanchored","cited_source_refs":["s0"],"contradicts_consensus":true,"engages_consensus":false,"source_tier_refs":["s0"],"citation_chain_markers":{"self_reinforcing_citations":2,"total_citation_chains_described":2},"falsifiability":"unfalsifiable"}],"article_level":{"checkable_facts_per_paragraph":[1],"rhetorical_red_flags":{"urgency_framing":2,"suppressed_truth_narrative":2,"emotional_appeal_decoupled":1,"identity_based_dismissal":1,"false_precision":1,"appeal_to_hidden_knowledge":2}},"cited_sources":[{"id":"s0","domain":"unknown.example","name":"Unnamed Blog","tier":"self_referential"}]}

Now extract for this input:
content_type: {content_type}
text:
{text}`;

export function clipPromptText(text, maxChars = MAX_PROMPT_CHARS) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return normalized.slice(0, maxChars).trim();
}

export function buildClassifyPrompt(text, options = {}) {
  return CLASSIFY_PROMPT_TEMPLATE.replace("{text}", clipPromptText(text, options.maxChars));
}

export function buildExtractPrompt(text, contentType = "factual", options = {}) {
  return EXTRACT_PROMPT_TEMPLATE
    .replace("{content_type}", normalizeContentType(contentType))
    .replace("{text}", clipPromptText(text, options.maxChars));
}

export function parseModelJson(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    throw new Error("Model returned an empty response");
  }

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const firstCandidate = fenced ? fenced[1].trim() : text;
  try {
    return JSON.parse(firstCandidate);
  } catch {
    const extracted = extractBalancedJsonObject(firstCandidate);
    if (!extracted) {
      throw new Error("Model response did not contain a JSON object");
    }
    return JSON.parse(extracted);
  }
}

export function normalizeClassification(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  return {
    content_type: normalizeContentType(source.content_type ?? source.type ?? source.label),
    confidence: toProbability(source.confidence ?? source.probability ?? source.score, 0.5),
    rationale: String(source.rationale || source.reason || "").slice(0, 240),
  };
}

export function normalizeExtraction(payload, sourceText = "", options = {}) {
  const source = payload && typeof payload === "object" ? payload : {};
  const rawClaims = Array.isArray(source.claims) ? source.claims : [];
  const rawSources = Array.isArray(source.cited_sources) ? source.cited_sources : [];
  const citedSources = normalizeSources(rawSources, options);
  const knownSourceIds = new Set(citedSources.map((item) => item.id));
  const claims = rawClaims
    .slice(0, MAX_CLAIMS)
    .map((claim, index) => normalizeClaim(claim, index, sourceText, knownSourceIds))
    .filter(Boolean);

  return {
    claims,
    article_level: normalizeArticleLevel(source.article_level, options),
    cited_sources: citedSources,
  };
}

function extractBalancedJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let idx = start; idx < text.length; idx += 1) {
    const ch = text[idx];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, idx + 1);
      }
    }
  }
  return null;
}

function normalizeContentType(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[^a-z]/g, "_");
  if (CONTENT_TYPES.has(normalized)) {
    return normalized;
  }
  if (["news", "research", "analysis", "report"].includes(normalized)) {
    return "factual";
  }
  if (["editorial", "argument", "commentary"].includes(normalized)) {
    return "opinion";
  }
  if (["guide", "manual", "definition", "overview", "explainer"].includes(normalized)) {
    return "reference";
  }
  return "factual";
}

function toProbability(value, defaultValue) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return defaultValue;
  }
  if (numberValue > 1 && numberValue <= 100) {
    return round6(numberValue / 100);
  }
  return round6(Math.max(0, Math.min(1, numberValue)));
}

function round6(value) {
  return Number(Number(value).toFixed(6));
}

function normalizeSources(rawSources, options) {
  const sources = [];
  for (const [index, source] of rawSources.entries()) {
    if (!source || typeof source !== "object") {
      continue;
    }
    const id = cleanId(source.id || source.ref || `s${index}`);
    const domain = cleanDomain(source.domain || source.url || "");
    sources.push({
      id,
      domain,
      name: String(source.name || domain || id).slice(0, 120),
      tier: normalizeSourceTier(source.tier),
    });
  }

  if (!sources.length) {
    const domain = cleanDomain(options.url || "");
    sources.push({
      id: "page-source",
      domain,
      name: String(options.title || domain || "Current page").slice(0, 120),
      tier: domain === "unknown" ? "unknown" : "secondary",
    });
  }
  return dedupeById(sources);
}

function normalizeClaim(rawClaim, index, sourceText, knownSourceIds) {
  const source = rawClaim && typeof rawClaim === "object" ? rawClaim : {};
  const text = String(source.text || source.claim || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return null;
  }

  const start = normalizeCharStart(source.char_start, text, sourceText);
  const end = normalizeCharEnd(source.char_end, start, text, sourceText);
  const citedRefs = cleanRefList(source.cited_source_refs || source.citations || source.sources)
    .filter((id) => knownSourceIds.has(id));
  const sourceTierRefs = cleanRefList(source.source_tier_refs || source.source_refs)
    .filter((id) => knownSourceIds.has(id));

  return {
    id: cleanId(source.id || `c${index}`),
    text,
    char_start: start,
    char_end: end,
    specificity_anchors: cleanStringList(source.specificity_anchors || source.anchors || inferAnchors(text)).slice(0, 4),
    citation_kind: normalizeCitationKind(source.citation_kind, citedRefs),
    cited_source_refs: citedRefs,
    contradicts_consensus: normalizeNullableBoolean(source.contradicts_consensus),
    engages_consensus: source.engages_consensus === true,
    source_tier_refs: sourceTierRefs.length ? sourceTierRefs : citedRefs,
    citation_chain_markers: normalizeCitationChain(source.citation_chain_markers),
    falsifiability: normalizeFalsifiability(source.falsifiability, text),
  };
}

function normalizeArticleLevel(articleLevel, options) {
  const source = articleLevel && typeof articleLevel === "object" ? articleLevel : {};
  const facts = Array.isArray(source.checkable_facts_per_paragraph)
    ? source.checkable_facts_per_paragraph.map((value) => Math.max(0, Math.min(3, Number(value) || 0)))
    : new Array(Math.max(1, Number(options.segmentCount || 1))).fill(0);
  return {
    checkable_facts_per_paragraph: facts,
    rhetorical_red_flags: normalizeRhetoricalFlags(source.rhetorical_red_flags),
  };
}

function normalizeRhetoricalFlags(rawFlags) {
  const flags = Object.fromEntries(RHETORICAL_FLAG_KEYS.map((key) => [key, 0]));
  if (Array.isArray(rawFlags)) {
    for (const key of rawFlags.map((item) => String(item).trim())) {
      if (key in flags) {
        flags[key] = 1;
      }
    }
    return flags;
  }
  if (!rawFlags || typeof rawFlags !== "object") {
    return flags;
  }
  for (const key of RHETORICAL_FLAG_KEYS) {
    flags[key] = rawFlags[key] === true || Number(rawFlags[key]) > 0 ? 1 : 0;
  }
  return flags;
}

function normalizeCharStart(value, claimText, sourceText) {
  const textLength = String(sourceText || "").length;
  const numberValue = Number(value);
  if (Number.isInteger(numberValue) && numberValue >= 0) {
    return textLength ? Math.min(numberValue, textLength) : numberValue;
  }
  const found = String(sourceText || "").indexOf(claimText);
  return found >= 0 ? found : 0;
}

function normalizeCharEnd(value, start, claimText, sourceText) {
  const textLength = String(sourceText || "").length;
  const fallback = start + claimText.length;
  const numberValue = Number(value);
  const end = Number.isInteger(numberValue) && numberValue >= start ? numberValue : fallback;
  return textLength ? Math.min(end, textLength) : end;
}

function normalizeCitationKind(value, citedRefs) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!citedRefs.length) {
    return "unanchored";
  }
  if (CITATION_KINDS.has(normalized)) {
    return normalized;
  }
  return "secondary";
}

function normalizeSourceTier(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (SOURCE_TIERS.has(normalized)) {
    return normalized;
  }
  return "unknown";
}

function normalizeFalsifiability(value, claimText) {
  const normalized = String(value || "").trim().toLowerCase();
  if (FALSIFIABILITY.has(normalized)) {
    return normalized;
  }
  if (/\b\d|percent|according to|reported|measured|dated|published\b/i.test(claimText)) {
    return "falsifiable";
  }
  return "vague";
}

function normalizeNullableBoolean(value) {
  if (value === true || value === false || value === null) {
    return value;
  }
  return null;
}

function normalizeCitationChain(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    self_reinforcing_citations: Math.max(0, Number(source.self_reinforcing_citations) || 0),
    total_citation_chains_described: Math.max(0, Number(source.total_citation_chains_described) || 0),
  };
}

function cleanStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const out = [];
  for (const item of value) {
    const text = String(item || "").trim();
    if (text && !out.includes(text)) {
      out.push(text);
    }
  }
  return out;
}

function cleanRefList(value) {
  return cleanStringList(value).map((item) => cleanId(item));
}

function cleanId(value) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]/g, "-")
    .slice(0, 64) || "item";
}

function cleanDomain(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "unknown";
  }
  try {
    return new URL(text).hostname.replace(/^www\./, "") || "unknown";
  } catch {
    return text.replace(/^www\./, "").replace(/\/.*$/, "") || "unknown";
  }
}

function inferAnchors(text) {
  const tokens = String(text || "").match(/[A-Za-z0-9][A-Za-z0-9-]{4,}/g) || [];
  const anchors = [];
  for (const token of tokens) {
    const cleaned = token.toLowerCase();
    if (!anchors.includes(cleaned) && (/\d/.test(cleaned) || cleaned.length >= 8)) {
      anchors.push(cleaned);
    }
    if (anchors.length >= 4) {
      break;
    }
  }
  return anchors;
}

function dedupeById(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
