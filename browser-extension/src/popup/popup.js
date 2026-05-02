import {
  getFederationSettings,
  getSettings,
  getTavilyApiKey,
  markOnboardingComplete,
  setFederationEnabled,
  setSettings,
  setTavilyApiKey,
} from "../shared/storage.js";
import {
  MSG_ANALYZE_PAGE,
  MSG_GET_MODEL_STATE,
  MSG_MODEL_PROGRESS,
  MSG_SETTINGS_UPDATED,
  MSG_START_MODEL_LOAD,
  sendMessage,
} from "../shared/messages.js";

const analyzeButton = document.getElementById("analyze-page");
const analysisStatus = document.getElementById("analysis-status");
const onboardingCard = document.getElementById("onboarding-card");
const startModelLoad = document.getElementById("start-model-load");
const modelProgress = document.getElementById("model-progress");
const modelState = document.getElementById("model-state");
const federationEnabled = document.getElementById("federation-enabled");
const federationStatus = document.getElementById("federation-status");
const resultCard = document.getElementById("result-card");
const resultVerdict = document.getElementById("result-verdict");
const resultScore = document.getElementById("result-score");
const resultClaims = document.getElementById("result-claims");
const tavilyKey = document.getElementById("tavily-key");
const tavilyEnabled = document.getElementById("tavily-enabled");
const theseusFallbackEnabled = document.getElementById("theseus-fallback-enabled");
const railPosition = document.getElementById("rail-position");
const railVisible = document.getElementById("rail-visible");
const motionOverride = document.getElementById("motion-override");
const typography = document.getElementById("typography");

function setStatus(text) {
  if (analysisStatus) {
    analysisStatus.textContent = text;
  }
}

function renderModelProgress(progress = {}) {
  const percent = Math.max(0, Math.min(100, Number(progress.percent || 0)));
  if (modelProgress) {
    modelProgress.value = percent;
  }
  if (modelState) {
    modelState.textContent = progress.stage || `${Math.round(percent)}%`;
  }
}

function renderResult(scoreResult) {
  if (!scoreResult) {
    return;
  }
  if (resultCard) {
    resultCard.hidden = false;
  }
  if (resultVerdict) {
    resultVerdict.textContent = scoreResult.verdict || "-";
  }
  if (resultScore) {
    resultScore.textContent = scoreResult.overall_score == null
      ? "-"
      : `${Math.round(Number(scoreResult.overall_score) * 100)}%`;
  }
  if (resultClaims) {
    resultClaims.textContent = String(scoreResult.claims?.length || 0);
  }
}

if (analyzeButton) {
  analyzeButton.addEventListener("click", async () => {
    analyzeButton.disabled = true;
    setStatus("Analyzing...");
    try {
      const response = await sendMessage(MSG_ANALYZE_PAGE);
      if (!response?.ok) {
        throw new Error(response?.error || "Analysis failed");
      }
      renderResult(response.scoreResult);
      setStatus("Done");
    } catch (error) {
      setStatus(String(error?.message || error));
    } finally {
      analyzeButton.disabled = false;
    }
  });
}

if (startModelLoad) {
  startModelLoad.addEventListener("click", async () => {
    startModelLoad.disabled = true;
    setStatus("Preparing model");
    try {
      const response = await sendMessage(MSG_START_MODEL_LOAD);
      if (!response?.ok) {
        throw new Error(response?.error || "Model load failed");
      }
      await markOnboardingComplete();
      renderModelProgress(response.state?.progress || { percent: 100, stage: "ready" });
      setStatus("Model ready");
      if (onboardingCard) {
        onboardingCard.hidden = true;
      }
    } catch (error) {
      setStatus(String(error?.message || error));
    } finally {
      startModelLoad.disabled = false;
    }
  });
}

async function renderFederationState() {
  const settings = await getFederationSettings();
  if (federationEnabled) {
    federationEnabled.checked = settings.federationEnabled;
  }
  if (federationStatus) {
    federationStatus.textContent = `Federation: ${settings.federationMode}`;
  }
}

if (federationEnabled) {
  federationEnabled.addEventListener("change", async () => {
    await setFederationEnabled(federationEnabled.checked);
    await renderFederationState();
  });
}

renderFederationState();

async function renderSettingsState() {
  const settings = await getSettings();
  if (onboardingCard) {
    onboardingCard.hidden = settings.onboardingComplete;
  }
  if (tavilyEnabled) {
    tavilyEnabled.checked = settings.tavilyEnabled;
  }
  if (theseusFallbackEnabled) {
    theseusFallbackEnabled.checked = settings.theseusSearchFallbackEnabled;
  }
  if (railPosition) {
    railPosition.value = settings.railPosition;
  }
  if (railVisible) {
    railVisible.checked = settings.railVisible;
  }
  if (motionOverride) {
    motionOverride.value = settings.motionOverride;
  }
  if (typography) {
    typography.value = settings.typography;
  }
  if (tavilyKey) {
    tavilyKey.value = await getTavilyApiKey() || "";
  }
}

async function notifySettingsUpdated() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.tabs.sendMessage(tab.id, { type: MSG_SETTINGS_UPDATED }).catch(() => null);
  }
}

async function updateSetting(patch) {
  await setSettings(patch);
  await notifySettingsUpdated();
}

tavilyEnabled?.addEventListener("change", () => updateSetting({ tavilyEnabled: tavilyEnabled.checked }));
theseusFallbackEnabled?.addEventListener("change", () => updateSetting({
  theseusSearchFallbackEnabled: theseusFallbackEnabled.checked,
}));
railPosition?.addEventListener("change", () => updateSetting({ railPosition: railPosition.value }));
railVisible?.addEventListener("change", () => updateSetting({ railVisible: railVisible.checked }));
motionOverride?.addEventListener("change", () => updateSetting({ motionOverride: motionOverride.value }));
typography?.addEventListener("change", () => updateSetting({ typography: typography.value }));
tavilyKey?.addEventListener("change", async () => {
  await setTavilyApiKey(tavilyKey.value);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MSG_MODEL_PROGRESS) {
    renderModelProgress(message.progress);
  }
});

sendMessage(MSG_GET_MODEL_STATE)
  .then((response) => renderModelProgress(response?.state?.progress))
  .catch(() => null);

renderSettingsState().catch((error) => setStatus(String(error?.message || error)));
