export async function getTavilyApiKey() {
  const rows = await chrome.storage.sync.get(["tavilyApiKey"]);
  return rows.tavilyApiKey || null;
}

export async function setTavilyApiKey(key) {
  await chrome.storage.sync.set({ tavilyApiKey: key || null });
}

export async function getSettings() {
  const rows = await chrome.storage.local.get(["settings"]);
  return rows.settings || null;
}

export async function setSettings(partial) {
  const current = (await getSettings()) || {};
  await chrome.storage.local.set({ settings: { ...current, ...partial } });
}

export async function getFederationSettings() {
  const rows = await chrome.storage.sync.get([
    "federationEnabled",
    "federationConsentTimestamp",
    "federationMode",
    "federationStatusLastCheckedAt",
    "federationBrowserIdentity",
  ]);
  return {
    federationEnabled: rows.federationEnabled === true,
    federationConsentTimestamp: rows.federationConsentTimestamp || null,
    federationMode: rows.federationMode || "offline",
    federationStatusLastCheckedAt: rows.federationStatusLastCheckedAt || null,
    federationBrowserIdentity: rows.federationBrowserIdentity || null,
  };
}

export async function setFederationEnabled(enabled) {
  const patch = { federationEnabled: enabled === true };
  if (enabled) {
    patch.federationConsentTimestamp = new Date().toISOString();
  }
  await chrome.storage.sync.set(patch);
}

export async function setFederationStatus(mode) {
  await chrome.storage.sync.set({
    federationMode: mode,
    federationStatusLastCheckedAt: new Date().toISOString(),
  });
}

export async function setFederationBrowserIdentity(identity) {
  await chrome.storage.sync.set({ federationBrowserIdentity: identity });
}
