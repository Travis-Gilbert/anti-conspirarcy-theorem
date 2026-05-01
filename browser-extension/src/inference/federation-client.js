import { FEDERATION_PEER_URL, FEDERATION_PRIMARY_URL } from "../shared/config.js";
import {
  getFederationSettings,
  setFederationBrowserIdentity,
  setFederationStatus,
} from "../shared/storage.js";
import {
  binsFromFeatureBreakdown,
  canonicalStringify,
  computeAccStructuralHashV2,
} from "./structural-hash.js";

const TEST_HASH = "0".repeat(64);

async function fetchWithTimeout(url, options = {}, timeoutMs = 1000, fetchImpl = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function discoverFederationMode(fetchImpl = fetch) {
  try {
    const response = await fetchWithTimeout(`${FEDERATION_PEER_URL}/health`, {}, 200, fetchImpl);
    if (response.ok) {
      await setFederationStatus("peer");
      return "peer";
    }
  } catch {
    // Fall through to primary lookup.
  }
  try {
    const response = await fetchWithTimeout(
      `${FEDERATION_PRIMARY_URL}/api/v2/federation/catalog/lookup/${TEST_HASH}/`,
      {},
      2000,
      fetchImpl,
    );
    if (response.ok) {
      await setFederationStatus("primary-direct");
      return "primary-direct";
    }
  } catch {
    // Fall through to offline.
  }
  await setFederationStatus("offline");
  return "offline";
}

function bytesToBase64(bytes) {
  if (typeof btoa === "function") {
    let text = "";
    for (const byte of bytes) {
      text += String.fromCharCode(byte);
    }
    return btoa(text);
  }
  return globalThis.Buffer.from(bytes).toString("base64");
}

function pemFromSpki(spki) {
  const base64 = bytesToBase64(new Uint8Array(spki));
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----\n`;
}

async function sha256Bytes(bytes) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function getOrCreateBrowserIdentity() {
  const settings = await getFederationSettings();
  if (!globalThis.crypto?.subtle) {
    throw new Error("WebCrypto is unavailable");
  }
  if (settings.federationBrowserIdentity) {
    const saved = settings.federationBrowserIdentity;
    const privateKey = await globalThis.crypto.subtle.importKey(
      "jwk",
      saved.privateJwk,
      { name: "Ed25519" },
      true,
      ["sign"],
    );
    return { ...saved, privateKey };
  }
  const keyPair = await globalThis.crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const privateJwk = await globalThis.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  const spki = await globalThis.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const rawPublic = new Uint8Array(spki).slice(-32);
  const identity = {
    privateJwk,
    publicKeyPem: pemFromSpki(spki),
    peerId: await sha256Bytes(rawPublic),
  };
  await setFederationBrowserIdentity(identity);
  return { ...identity, privateKey: keyPair.privateKey };
}

async function signPayload(payload, privateKey) {
  const bytes = new TextEncoder().encode(canonicalStringify(payload));
  const signature = await globalThis.crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes);
  return bytesToBase64(new Uint8Array(signature));
}

export async function lookupCatalog(structuralHash, mode, fetchImpl = fetch) {
  if (mode === "peer") {
    const response = await fetchWithTimeout(`${FEDERATION_PEER_URL}/lookup/${structuralHash}`, {}, 500, fetchImpl);
    return response.ok ? response.json() : { present: false };
  }
  if (mode === "primary-direct") {
    const response = await fetchWithTimeout(
      `${FEDERATION_PRIMARY_URL}/api/v2/federation/catalog/lookup/${structuralHash}/`,
      {},
      2000,
      fetchImpl,
    );
    return response.ok ? response.json() : { present: false };
  }
  return { present: false };
}

async function submitViaPrimary(signature, fetchImpl) {
  const identity = await getOrCreateBrowserIdentity();
  const signedSignature = { ...signature, peer_id: identity.peerId };
  const payload = {
    round_id: `extension-${Date.now()}`,
    context: "acc_signals",
    plugin_slug: "federation_acc_signals",
    payload: { signatures: [signedSignature] },
  };
  const envelope = {
    peer_id: identity.peerId,
    public_key_pem: identity.publicKeyPem,
    signature: await signPayload(payload, identity.privateKey),
    payload,
  };
  const response = await fetchWithTimeout(
    `${FEDERATION_PRIMARY_URL}/api/v2/federation/peer/contribute/`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(envelope),
    },
    2000,
    fetchImpl,
  );
  return response.ok ? response.json() : { accepted: false };
}

export async function submitFlag(signature, mode, fetchImpl = fetch) {
  if (mode === "peer") {
    const response = await fetchWithTimeout(
      `${FEDERATION_PEER_URL}/flag`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature }),
      },
      1000,
      fetchImpl,
    );
    return response.ok ? response.json() : { accepted: false };
  }
  if (mode === "primary-direct") {
    return submitViaPrimary(signature, fetchImpl);
  }
  return { accepted: false };
}

export async function processFederationForScore(scoreResult, fetchImpl = fetch) {
  const settings = await getFederationSettings();
  if (!settings.federationEnabled || !scoreResult?.claims?.length) {
    return scoreResult;
  }
  const mode = await discoverFederationMode(fetchImpl);
  if (mode === "offline") {
    return scoreResult;
  }
  const claims = [];
  for (const claim of scoreResult.claims) {
    const bins = binsFromFeatureBreakdown(claim.feature_breakdown);
    const structuralHash = await computeAccStructuralHashV2({
      contentType: scoreResult.content_type,
      bins,
    });
    const catalog = await lookupCatalog(structuralHash, mode, fetchImpl);
    const federation = {
      structural_hash: structuralHash,
      catalog_entry: catalog.present ? catalog.entry : null,
      correlation_boosted: Boolean(catalog.entry?.correlation_boosted),
    };
    if (["mixed", "unreliable"].includes(claim.verdict)) {
      await submitFlag(
        {
          version: 2,
          structural_hash: structuralHash,
          bins,
          score_components: claim.feature_breakdown,
          content_type: scoreResult.content_type,
          cluster_size: scoreResult.claims.length,
          cluster_age_days: 0,
          flag_time: new Date().toISOString(),
          peer_id: "",
          confidence: 1,
        },
        mode,
        fetchImpl,
      ).catch(() => ({ accepted: false }));
    }
    claims.push({ ...claim, federation });
  }
  return { ...scoreResult, claims };
}
