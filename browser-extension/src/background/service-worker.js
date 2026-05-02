import { processFederationForScore } from "../inference/federation-client.js";
import { loadDomainList } from "../inference/domain-list.js";
import { scoreText } from "../inference/scoring.js";
import { getTavilyApiKey, getSettings } from "../shared/storage.js";
import { getModelState, getRunner, subscribeToProgress } from "./model-loader.js";
import { tavilyLookup } from "./tavily-client.js";
import {
  MSG_ANALYSIS_RESULT,
  MSG_ANALYZE_PAGE,
  MSG_COLLECT_PAGE,
  MSG_ERROR,
  MSG_GET_MODEL_STATE,
  MSG_MODEL_PROGRESS,
  MSG_MODEL_READY,
  MSG_START_MODEL_LOAD,
} from "../shared/messages.js";
import { MODEL_VERSION } from "../shared/config.js";

const MAX_TEXT_LENGTH = 24000;
const tabQueues = new Map();

console.log("Anti-Conspiracy Theorem service worker loaded");

subscribeToProgress((progress) => {
  chrome.runtime.sendMessage({ type: MSG_MODEL_PROGRESS, progress }).catch(() => null);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message && message.ping === true) {
    sendResponse({ pong: true });
    return true;
  }
  if (message?.type === MSG_START_MODEL_LOAD) {
    getRunner()
      .then((runner) => sendResponse({
        ok: true,
        type: MSG_MODEL_READY,
        mode: "webllm-gemma",
        state: getModelState(),
        model: runner.getModelInfo(),
      }))
      .catch((error) => sendResponse({ ok: false, type: MSG_ERROR, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === MSG_GET_MODEL_STATE) {
    sendResponse({ ok: true, state: getModelState() });
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
  return enqueueTabJob(tab.id, () => analyzeTab(tab));
}

function enqueueTabJob(tabId, task) {
  const previous = tabQueues.get(tabId) || Promise.resolve();
  const next = previous
    .catch(() => null)
    .then(task)
    .finally(() => {
      if (tabQueues.get(tabId) === next) {
        tabQueues.delete(tabId);
      }
    });
  tabQueues.set(tabId, next);
  return next;
}

async function analyzeTab(tab) {
  const startedAt = Date.now();
  const tabId = tab.id;
  const page = await collectPage(tab.id);
  const pageText = String(page.text || "").slice(0, MAX_TEXT_LENGTH);
  const runner = await getRunner();
  if (runner.getState() !== "ready") {
    throw new Error("Model is not ready");
  }
  const pageMeta = {
    url: page.url,
    title: page.title,
    segmentCount: page.segments?.length || 1,
  };
  const classification = await runner.classifyContent(pageText, pageMeta);
  const contentType = classification.content_type;
  const extraction = contentType === "fiction"
    ? emptyExtraction(pageMeta)
    : await runner.extractFeatures(pageText, contentType, pageMeta);
  const settings = await getSettings();
  const tavilyApiKey = await getTavilyApiKey();
  const tavilyResult = settings.tavilyEnabled && contentType !== "fiction"
    ? await tavilyLookup(extraction, {
      apiKey: tavilyApiKey,
      allowTheseusFallback: settings.theseusSearchFallbackEnabled,
    })
    : null;
  const score = scoreText(extraction, tavilyResult, contentType, classification.confidence);
  const scoreResult = await processFederationForScore({
    ...score,
    page_url: page.url,
    page_title: page.title,
    meta: {
      ...score.meta,
      runtime: "browser-extension",
      extraction_mode: "webllm-gemma",
      model_version: MODEL_VERSION,
      model_state: getModelState().state,
      tavily_enabled: Boolean(settings.tavilyEnabled && tavilyApiKey),
      theseus_search_fallback_enabled: Boolean(settings.tavilyEnabled && settings.theseusSearchFallbackEnabled),
      elapsed_ms: Math.max(0, Date.now() - startedAt),
    },
  });
  await chrome.tabs.sendMessage(tabId, { type: MSG_ANALYSIS_RESULT, scoreResult }).catch(() => null);
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

function emptyExtraction(pageMeta = {}) {
  return {
    claims: [],
    article_level: {
      checkable_facts_per_paragraph: [],
      rhetorical_red_flags: {
        urgency_framing: 0,
        suppressed_truth_narrative: 0,
        emotional_appeal_decoupled: 0,
        identity_based_dismissal: 0,
        false_precision: 0,
        appeal_to_hidden_knowledge: 0,
      },
    },
    cited_sources: [{
      id: "page-source",
      domain: hostnameFromUrl(pageMeta.url || ""),
      name: pageMeta.title || "Current page",
      tier: "secondary",
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
