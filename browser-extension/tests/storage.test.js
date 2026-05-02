import test from "node:test";
import assert from "node:assert/strict";

const localStore = {};
const syncStore = {};
globalThis.chrome = {
  storage: {
    local: {
      async get(keys) {
        return Object.fromEntries(keys.map((key) => [key, localStore[key]]));
      },
      async set(patch) {
        Object.assign(localStore, patch);
      },
    },
    sync: {
      async get(keys) {
        return Object.fromEntries(keys.map((key) => [key, syncStore[key]]));
      },
      async set(patch) {
        Object.assign(syncStore, patch);
      },
    },
  },
};

const {
  getSettings,
  getTavilyApiKey,
  normalizeSettings,
  setSettings,
  setTavilyApiKey,
} = await import("../src/shared/storage.js");

test("normalizeSettings clamps unknown values to defaults", () => {
  assert.deepEqual(normalizeSettings({
    onboardingComplete: true,
    tavilyEnabled: true,
    railPosition: "center",
    railVisible: false,
    motionOverride: "wild",
    typography: "serif",
  }), {
    onboardingComplete: true,
    tavilyEnabled: true,
    theseusSearchFallbackEnabled: true,
    railPosition: "right",
    railVisible: false,
    motionOverride: "system",
    typography: "serif",
  });
});

test("settings persist as typed local storage values", async () => {
  await setSettings({ tavilyEnabled: true, railPosition: "left" });
  const settings = await getSettings();
  assert.equal(settings.tavilyEnabled, true);
  assert.equal(settings.theseusSearchFallbackEnabled, true);
  assert.equal(settings.railPosition, "left");
  assert.equal(settings.railVisible, true);
});

test("Theseus search fallback can be disabled", () => {
  const settings = normalizeSettings({ theseusSearchFallbackEnabled: false });
  assert.equal(settings.theseusSearchFallbackEnabled, false);
});

test("Tavily key is trimmed and nullable", async () => {
  await setTavilyApiKey("  tvly-abc  ");
  assert.equal(await getTavilyApiKey(), "tvly-abc");
  await setTavilyApiKey(" ");
  assert.equal(await getTavilyApiKey(), null);
});
