const UNKNOWN_ENTRY = {
  domain: "unknown",
  tier: 4,
  parent_organization: "unknown",
  category: "unranked",
  known_issues: [],
  source_citations: ["Default policy for unknown domains"],
};

let domainMap = null;
let domainPromise = null;

function coerceHost(value) {
  if (!value) {
    return "";
  }
  const raw = String(value).trim().toLowerCase();
  if (!raw) {
    return "";
  }
  let host = "";
  try {
    const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
    host = (parsed.host || parsed.pathname || "").trim().toLowerCase();
  } catch {
    host = raw;
  }
  if (host.includes(":")) {
    host = host.split(":", 1)[0];
  }
  return host.replace(/^\.+|\.+$/g, "");
}

function candidateDomains(host) {
  const parts = host.split(".");
  if (parts.length < 2) {
    return [host];
  }
  const out = [];
  for (let idx = 0; idx < parts.length - 1; idx += 1) {
    const suffix = parts.slice(idx).join(".");
    if (suffix && !out.includes(suffix)) {
      out.push(suffix);
    }
  }
  return out;
}

async function loadFromChromeFetch() {
  const url = chrome.runtime.getURL("dist/data/domains_v1.json");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load domains_v1.json: ${response.status}`);
  }
  return response.json();
}

async function loadFromLocalFile() {
  const fs = await import("node:fs/promises");
  const path = new URL("./data/domains_v1.json", import.meta.url);
  const text = await fs.readFile(path, "utf-8");
  return JSON.parse(text);
}

function normalizePayload(payload) {
  const rows = Array.isArray(payload?.domains) ? payload.domains : [];
  const out = {};
  for (const row of rows) {
    const domain = String(row?.domain || "").trim().toLowerCase();
    if (!domain) {
      continue;
    }
    out[domain] = {
      domain,
      tier: Number.parseInt(row?.tier ?? 4, 10),
      parent_organization: String(row?.parent_organization || domain).trim().toLowerCase(),
      category: String(row?.category || "unranked"),
      known_issues: Array.isArray(row?.known_issues) ? row.known_issues : [],
      source_citations: Array.isArray(row?.source_citations) ? row.source_citations : [],
    };
  }
  return out;
}

export async function loadDomainList() {
  if (domainMap) {
    return domainMap;
  }
  if (domainPromise) {
    return domainPromise;
  }
  domainPromise = (async () => {
    const payload =
      typeof chrome !== "undefined" && chrome?.runtime?.getURL
        ? await loadFromChromeFetch()
        : await loadFromLocalFile();
    domainMap = normalizePayload(payload);
    return domainMap;
  })();
  return domainPromise;
}

function getEntry(domain) {
  const host = coerceHost(domain);
  if (!host) {
    return UNKNOWN_ENTRY;
  }
  if (!domainMap) {
    return UNKNOWN_ENTRY;
  }
  for (const candidate of candidateDomains(host)) {
    if (domainMap[candidate]) {
      return domainMap[candidate];
    }
  }
  return UNKNOWN_ENTRY;
}

export function getTier(domain) {
  return Number(getEntry(domain).tier || 4);
}

export function getParentOrg(domain) {
  const entry = getEntry(domain);
  return entry.parent_organization || entry.domain || "unknown";
}
