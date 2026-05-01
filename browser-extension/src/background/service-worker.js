import { processFederationForScore } from "../inference/federation-client.js";
import { loadDomainList } from "../inference/domain-list.js";
import { scoreText } from "../inference/scoring.js";
import {
  MSG_ANALYSIS_RESULT,
  MSG_ANALYZE_PAGE,
  MSG_COLLECT_PAGE,
  MSG_ERROR,
  MSG_MODEL_READY,
  MSG_START_MODEL_LOAD,
} from "../shared/messages.js";

const MAX_TEXT_LENGTH = 24000;
const MAX_CLAIMS = 8;

console.log("Anti-Conspiracy Theorem service worker loaded");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message && message.ping === true) {
    sendResponse({ pong: true });
    return true;
  }
  if (message?.type === MSG_START_MODEL_LOAD) {
    sendResponse({
      ok: true,
      type: MSG_MODEL_READY,
      mode: "deterministic-acc",
    });
    return true;
  }
  if (message?.type === MSG_ANALYZE_PAGE) {
    analyzeActivePage()
      .then((scoreResult) => sendResponse({ ok: true, scoreResult }))
      .catch((error) => sendResponse({ ok: false, type: MSG_ERROR, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === "federation:process-score") {
    processFederationForScore(message.scoreResult)
      .then((scoreResult) => sendResponse({ ok: true, scoreResult }))
      .catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  return false;
});

async function analyzeActivePage() {
  await loadDomainList();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab available");
  }
  const page = await collectPage(tab.id);
  const extraction = buildExtraction(page);
  const contentType = classifyContentType(page.text);
  const score = scoreText(extraction, null, contentType, 0.72);
  const scoreResult = await processFederationForScore({
    ...score,
    page_url: page.url,
    page_title: page.title,
    meta: {
      ...score.meta,
      runtime: "browser-extension",
      extraction_mode: "deterministic-page-heuristic",
    },
  });
  await chrome.tabs.sendMessage(tab.id, { type: MSG_ANALYSIS_RESULT, scoreResult }).catch(() => null);
  return scoreResult;
}

async function collectPage(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: MSG_COLLECT_PAGE });
    if (response?.ok) {
      return response;
    }
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["dist/content.js"] });
  }
  const response = await chrome.tabs.sendMessage(tabId, { type: MSG_COLLECT_PAGE });
  if (!response?.ok) {
    throw new Error("Page text could not be collected");
  }
  return response;
}

function buildExtraction(page) {
  const text = String(page.text || "").slice(0, MAX_TEXT_LENGTH);
  const url = String(page.url || "");
  const domain = hostnameFromUrl(url);
  const sentences = splitSentences(text);
  const claims = selectClaimSentences(sentences).map((sentence, index) => ({
    id: `c${index}`,
    text: sentence.text,
    char_start: sentence.start,
    char_end: sentence.end,
    specificity_anchors: specificityAnchors(sentence.text),
    citation_kind: citationKindForSentence(sentence.text, domain),
    cited_source_refs: ["page-source"],
    contradicts_consensus: null,
    engages_consensus: false,
    source_tier_refs: ["page-source"],
    citation_chain_markers: {
      self_reinforcing_citations: selfReferenceScore(sentence.text, domain),
      total_citation_chains_described: 1,
    },
    falsifiability: falsifiabilityForSentence(sentence.text),
  }));

  return {
    claims,
    article_level: {
      checkable_facts_per_paragraph: checkableFactsPerSegment(page.segments || []),
      rhetorical_red_flags: rhetoricalFlags(text),
    },
    cited_sources: [{
      id: "page-source",
      domain,
      name: page.title || domain || "Current page",
      tier: domain ? "secondary" : "unknown",
    }],
  };
}

function hostnameFromUrl(raw) {
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function splitSentences(text) {
  const rows = [];
  const regex = /[^.!?]+[.!?]+|[^.!?]+$/g;
  let match = regex.exec(text);
  while (match) {
    const sentence = match[0].replace(/\s+/g, " ").trim();
    if (sentence.length >= 50 && sentence.length <= 360) {
      rows.push({
        text: sentence,
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    match = regex.exec(text);
  }
  return rows;
}

function selectClaimSentences(sentences) {
  const ranked = [...sentences].sort((a, b) => claimSignal(b.text) - claimSignal(a.text));
  return ranked.slice(0, MAX_CLAIMS).sort((a, b) => a.start - b.start);
}

function claimSignal(sentence) {
  const anchors = specificityAnchors(sentence).length;
  const numerals = /\d/.test(sentence) ? 1 : 0;
  const assertion = /\b(is|are|was|were|will|causes|caused|shows|proves|found|reported)\b/i.test(sentence) ? 1 : 0;
  return anchors + numerals + assertion;
}

function specificityAnchors(sentence) {
  const tokens = String(sentence || "").match(/[A-Za-z0-9][A-Za-z0-9-]{4,}/g) || [];
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

function citationKindForSentence(sentence, domain) {
  if (/study|dataset|court|filing|report|paper|survey|census|trial/i.test(sentence)) {
    return "direct_primary";
  }
  if (domain && domain !== "unknown") {
    return "secondary";
  }
  return "unanchored";
}

function selfReferenceScore(sentence, domain) {
  if (!domain || domain === "unknown") {
    return 1;
  }
  return sentence.toLowerCase().includes(domain.split(".")[0]) ? 1 : 0;
}

function falsifiabilityForSentence(sentence) {
  if (/\b(always|never|everyone|no one|they|elites|hidden|secret)\b/i.test(sentence)) {
    return "vague";
  }
  if (/\b\d|percent|according to|reported|measured|dated|published\b/i.test(sentence)) {
    return "falsifiable";
  }
  return "vague";
}

function checkableFactsPerSegment(segments) {
  const values = (segments || []).map((segment) => {
    const text = String(segment.text || "");
    const count = (text.match(/\b\d|according to|reported|published|study|data|survey|court|filing/gi) || []).length;
    return Math.min(3, count);
  });
  return values.length ? values : [0];
}

function rhetoricalFlags(text) {
  return {
    urgency_framing: hasAny(text, ["wake up", "before it is too late", "urgent", "now or never"]),
    suppressed_truth_narrative: hasAny(text, ["truth they hide", "cover up", "suppressed", "censored"]),
    emotional_appeal_decoupled: hasAny(text, ["betrayal", "disgusting", "evil", "panic"]),
    identity_based_dismissal: hasAny(text, ["mainstream sheep", "enemy of the people", "traitor"]),
    false_precision: hasAny(text, ["99.999", "exactly 100", "guaranteed"]),
    appeal_to_hidden_knowledge: hasAny(text, ["secret", "hidden knowledge", "what they do not want you to know"]),
  };
}

function hasAny(text, needles) {
  const normalized = String(text || "").toLowerCase();
  return needles.some((needle) => normalized.includes(needle)) ? 1 : 0;
}

function classifyContentType(text) {
  const sample = String(text || "").slice(0, 4000);
  if (/\b(i think|i believe|opinion|editorial|should|ought)\b/i.test(sample)) {
    return "opinion";
  }
  if (/\b(definition|overview|guide|reference|manual)\b/i.test(sample)) {
    return "reference";
  }
  return "factual";
}
