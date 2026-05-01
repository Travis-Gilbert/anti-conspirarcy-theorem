export const MSG_ANALYZE_PAGE = "MSG_ANALYZE_PAGE";
export const MSG_COLLECT_PAGE = "MSG_COLLECT_PAGE";
export const MSG_ANALYSIS_RESULT = "MSG_ANALYSIS_RESULT";
export const MSG_MODEL_PROGRESS = "MSG_MODEL_PROGRESS";
export const MSG_MODEL_READY = "MSG_MODEL_READY";
export const MSG_START_MODEL_LOAD = "MSG_START_MODEL_LOAD";
export const MSG_SETTINGS_UPDATED = "MSG_SETTINGS_UPDATED";
export const MSG_ERROR = "MSG_ERROR";

export async function sendMessage(type, payload = {}) {
  return chrome.runtime.sendMessage({ type, ...payload });
}
