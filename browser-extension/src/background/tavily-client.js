import {
  TAVILY_ENDPOINT,
  TAVILY_RATE_LIMIT_MS,
  TAVILY_TIMEOUT_MS,
  THESEUS_WEB_SEARCH_ENDPOINT,
  THESEUS_WEB_SEARCH_TIMEOUT_MS,
  TOP_CLAIMS_FOR_TEMPORAL_SPREAD,
} from "../shared/config.js";

const DEFAULT_MAX_RESULTS = 5;
const THESEUS_PROVIDER = "theseus_web_search";
const TAVILY_PROVIDER = "tavily";

export function selectClaimsForTavily(claims, limit = TOP_CLAIMS_FOR_TEMPORAL_SPREAD) {
  return [...(claims || [])]
    .filter((claim) => claim?.id && claim?.text)
    .sort((a, b) => {
      const byAnchors = (b.specificity_anchors || []).length - (a.specificity_anchors || []).length;
      if (byAnchors !== 0) {
        return byAnchors;
      }
      return String(a.id).localeCompare(String(b.id));
    })
    .slice(0, limit);
}

export function buildClaimQuery(claim) {
  const anchors = (claim.specificity_anchors || [])
    .slice(0, 4)
    .map((anchor) => sanitizeAnchor(anchor))
    .filter(Boolean)
    .map((anchor) => `"${anchor.slice(0, 80)}"`)
    .join(" ");
  return [String(claim.text || "").slice(0, 280), anchors].filter(Boolean).join(" ");
}

export function buildTheseusSearchUrl(query, options = {}) {
  const endpoint = String(options.endpoint || THESEUS_WEB_SEARCH_ENDPOINT);
  const url = new URL(endpoint);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(options.maxResults || DEFAULT_MAX_RESULTS));
  return url.toString();
}

export async function tavilyLookup(extraction, options = {}) {
  const apiKey = String(options.apiKey || "").trim();
  const allowTheseusFallback = options.allowTheseusFallback === true;
  if (!apiKey && !allowTheseusFallback) {
    return null;
  }

  const fetchImpl = options.fetchImpl || fetch;
  const sleep = options.sleep || delay;
  const selectedClaims = selectClaimsForTavily(extraction?.claims || options.claims || [], options.limit);
  const byClaimId = {};
  const perClaim = [];
  const providersUsed = new Set();
  let tavilyCallsMade = 0;
  let theseusCallsMade = 0;
  let lastStartedAt = 0;

  for (const claim of selectedClaims) {
    const query = buildClaimQuery(claim);
    let rows = [];
    let provider = null;
    let tavilyError = null;
    let theseusError = null;

    if (apiKey) {
      const elapsed = Date.now() - lastStartedAt;
      if (lastStartedAt && elapsed < TAVILY_RATE_LIMIT_MS) {
        await sleep(TAVILY_RATE_LIMIT_MS - elapsed);
      }
      lastStartedAt = Date.now();
      try {
        tavilyCallsMade += 1;
        rows = await tavilySearch(query, { ...options, apiKey, fetchImpl });
        provider = TAVILY_PROVIDER;
      } catch (error) {
        tavilyError = error;
      }
    }

    if (allowTheseusFallback && (!provider || rows.length === 0)) {
      try {
        theseusCallsMade += 1;
        const fallbackRows = await theseusSearch(query, { ...options, fetchImpl });
        if (fallbackRows.length > 0 || !provider) {
          rows = fallbackRows;
          provider = THESEUS_PROVIDER;
        }
      } catch (error) {
        theseusError = error;
      }
    }

    byClaimId[claim.id] = rows;
    if (provider) {
      providersUsed.add(provider);
    }
    perClaim.push(buildClaimResult(claim.id, rows, {
      provider,
      tavilyError,
      theseusError,
      fallbackUsed: provider === THESEUS_PROVIDER,
    }));
  }

  return {
    calls_made: tavilyCallsMade + theseusCallsMade,
    tavily_calls_made: tavilyCallsMade,
    theseus_calls_made: theseusCallsMade,
    providers_used: [...providersUsed],
    per_claim: perClaim,
    by_claim_id: byClaimId,
  };
}

async function tavilySearch(query, options) {
  const response = await fetchWithTimeout(TAVILY_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${options.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      include_answer: false,
      include_raw_content: false,
      max_results: options.maxResults || DEFAULT_MAX_RESULTS,
    }),
  }, options.timeoutMs || TAVILY_TIMEOUT_MS, options.fetchImpl);
  if (!response.ok) {
    throw new Error(`Tavily search failed with ${response.status}`);
  }
  const payload = await response.json();
  return normalizeTavilyResults(payload?.results || []);
}

async function theseusSearch(query, options) {
  const response = await fetchWithTimeout(
    buildTheseusSearchUrl(query, {
      endpoint: options.theseusEndpoint,
      maxResults: options.maxResults || DEFAULT_MAX_RESULTS,
    }),
    { method: "GET" },
    options.theseusTimeoutMs || THESEUS_WEB_SEARCH_TIMEOUT_MS,
    options.fetchImpl,
  );
  if (!response.ok) {
    throw new Error(`Theseus search failed with ${response.status}`);
  }
  const payload = await response.json();
  const results = Array.isArray(payload) ? payload : payload?.results || payload?.hits || [];
  return normalizeTheseusResults(results);
}

function buildClaimResult(claimId, rows, details) {
  const error = details.tavilyError && details.theseusError
    ? `${errorMessage(details.tavilyError)}; ${errorMessage(details.theseusError)}`
    : errorMessage(details.tavilyError || details.theseusError);
  const ok = Boolean(details.provider);
  return {
    claim_id: claimId,
    ok,
    result_count: rows.length,
    provider: details.provider || null,
    fallback_used: details.fallbackUsed === true,
    ...(ok && details.tavilyError ? { tavily_error: errorMessage(details.tavilyError) } : {}),
    ...(!ok && error ? { error } : {}),
  };
}

function normalizeTavilyResults(results) {
  return results
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const url = String(row.url || "");
      return {
        title: String(row.title || "").slice(0, 180),
        url,
        domain: domainFromUrl(url),
        published_date: row.published_date || row.publishedDate || row.date || null,
        score: Number.isFinite(Number(row.score)) ? Number(row.score) : null,
        content: String(row.content || "").slice(0, 500),
        provider: TAVILY_PROVIDER,
      };
    });
}

function normalizeTheseusResults(results) {
  return results
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const url = String(row.url || row.canonical_url || "");
      return {
        title: String(row.title || "").slice(0, 180),
        url,
        domain: domainFromUrl(url),
        published_date: row.fetched_at || row.published_date || null,
        score: Number.isFinite(Number(row.score)) ? Number(row.score) : null,
        content: String(row.snippet || row.content || "").slice(0, 500),
        provider: THESEUS_PROVIDER,
      };
    });
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "") || "unknown";
  } catch {
    return "unknown";
  }
}

async function fetchWithTimeout(url, options, timeoutMs, fetchImpl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeAnchor(anchor) {
  return String(anchor || "")
    .replace(/["'`\u2018\u2019\u201c\u201d]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function errorMessage(error) {
  return error ? String(error?.message || error) : "";
}
