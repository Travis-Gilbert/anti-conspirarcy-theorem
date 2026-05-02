export const DEFAULT_SETTINGS = Object.freeze({
  onboardingComplete: false,
  tavilyEnabled: false,
  theseusSearchFallbackEnabled: true,
  railPosition: "right",
  railVisible: true,
  motionOverride: "system",
  typography: "system",
});

export async function getTavilyApiKey() {
  const rows = await chrome.storage.sync.get(["tavilyApiKey"]);
  const key = String(rows.tavilyApiKey || "").trim();
  return key || null;
}

export async function setTavilyApiKey(key) {
  const normalized = String(key || "").trim();
  await chrome.storage.sync.set({ tavilyApiKey: normalized || null });
}

export async function getSettings() {
  const rows = await chrome.storage.local.get(["settings"]);
  return normalizeSettings(rows.settings);
}

export async function setSettings(partial) {
  const current = await getSettings();
  const next = normalizeSettings({ ...current, ...partial });
  await chrome.storage.local.set({ settings: next });
  return next;
}

export async function markOnboardingComplete() {
  return setSettings({ onboardingComplete: true });
}

export function normalizeSettings(rawSettings) {
  const source = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
  return {
    onboardingComplete: source.onboardingComplete === true,
    tavilyEnabled: source.tavilyEnabled === true,
    theseusSearchFallbackEnabled: source.theseusSearchFallbackEnabled !== false,
    railPosition: source.railPosition === "left" ? "left" : "right",
    railVisible: source.railVisible !== false,
    motionOverride: ["system", "reduce", "allow"].includes(source.motionOverride)
      ? source.motionOverride
      : DEFAULT_SETTINGS.motionOverride,
    typography: ["system", "serif", "compact"].includes(source.typography)
      ? source.typography
      : DEFAULT_SETTINGS.typography,
  };
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
