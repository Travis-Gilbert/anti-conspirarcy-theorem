import {
  MSG_ANALYSIS_RESULT,
  MSG_COLLECT_PAGE,
  MSG_SETTINGS_UPDATED,
} from "../shared/messages.js";
import { getSettings } from "../shared/storage.js";
import {
  extractPageText,
  findSegmentForCharRange,
  getSegmentViewportTop,
} from "./paragraph-mapper.js";
import { GutterRail } from "./gutter-rail.js";

let lastSegments = [];
let lastScoreResult = null;
let renderScheduled = false;
const rail = new GutterRail();

async function applySettings() {
  const settings = await getSettings();
  rail.setState({
    side: settings.railPosition,
    visible: settings.railVisible,
    motion: settings.motionOverride,
    typography: settings.typography,
  });
}

function serializableSegments(segments) {
  return segments.map((segment) => ({
    index: segment.index,
    text: segment.text,
    char_start: segment.char_start,
    char_end: segment.char_end,
  }));
}

function paintScore(scoreResult) {
  if (!scoreResult?.claims?.length) {
    rail.setDots([]);
    return;
  }
  rail.attach();
  const dots = scoreResult.claims.map((claim) => {
    const segment = findSegmentForCharRange(lastSegments, claim.char_start, claim.char_end);
    return {
      claim,
      element: segment?.element,
      top: getSegmentViewportTop(segment),
      verdict: claim.verdict,
      label: `${claim.verdict}: ${claim.text || "claim"}`,
    };
  });
  rail.setDots(dots);
}

function renderScore(scoreResult) {
  lastScoreResult = scoreResult;
  paintScore(scoreResult);
}

function scheduleRenderRefresh() {
  if (!lastScoreResult || renderScheduled) {
    return;
  }
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    paintScore(lastScoreResult);
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === MSG_COLLECT_PAGE) {
    const page = extractPageText();
    lastSegments = page.segments;
    sendResponse({
      ok: true,
      url: window.location.href,
      title: document.title,
      text: page.text,
      segments: serializableSegments(page.segments),
    });
    return true;
  }
  if (message?.type === MSG_ANALYSIS_RESULT) {
    renderScore(message.scoreResult);
    sendResponse({ ok: true });
    return true;
  }
  if (message?.type === MSG_SETTINGS_UPDATED) {
    applySettings()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  return false;
});

window.addEventListener("scroll", scheduleRenderRefresh, { passive: true });
window.addEventListener("resize", scheduleRenderRefresh, { passive: true });

applySettings().catch(() => null);
