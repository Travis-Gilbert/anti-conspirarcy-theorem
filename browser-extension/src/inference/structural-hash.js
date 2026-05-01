export const ACC_V2_HASH_BIN_KEYS = Object.freeze([
  "root_depth",
  "source_independence",
  "rhetorical_red_flags",
  "citation_chain_closure",
  "claim_falsifiability",
]);

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value ?? 0)));
}

export function binFeature(value) {
  return Math.min(4, Math.floor(clamp01(value) * 5));
}

export function binsFromFeatureBreakdown(features) {
  return {
    root_depth: binFeature(features?.root_depth),
    source_independence: binFeature(features?.source_independence),
    rhetorical_red_flags: binFeature(features?.rhetorical_red_flags),
    citation_chain_closure: binFeature(features?.citation_chain_closure),
    claim_falsifiability: binFeature(features?.claim_falsifiability),
  };
}

export function canonicalStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalStringify(item)).join(",")}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringify(value[key])}`)
    .join(",")}}`;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
    return bytesToHex(new Uint8Array(digest));
  }
  throw new Error("WebCrypto is unavailable");
}

export async function computeAccStructuralHashV2({ contentType, bins }) {
  const payload = {
    bins: Object.fromEntries(ACC_V2_HASH_BIN_KEYS.map((key) => [key, Number(bins[key])])),
    content_type: contentType,
    version: 2,
  };
  return sha256Hex(canonicalStringify(payload));
}
