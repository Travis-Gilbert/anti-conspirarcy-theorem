import {
  getFederationSettings,
  setFederationEnabled,
} from "../shared/storage.js";
import { MSG_ANALYZE_PAGE, sendMessage } from "../shared/messages.js";

const analyzeButton = document.getElementById("analyze-page");
const analysisStatus = document.getElementById("analysis-status");
const federationEnabled = document.getElementById("federation-enabled");
const federationStatus = document.getElementById("federation-status");
const resultCard = document.getElementById("result-card");
const resultVerdict = document.getElementById("result-verdict");
const resultScore = document.getElementById("result-score");
const resultClaims = document.getElementById("result-claims");

function setStatus(text) {
  if (analysisStatus) {
    analysisStatus.textContent = text;
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
