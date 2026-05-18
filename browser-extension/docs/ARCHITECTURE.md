# Architecture

The extension is a Manifest V3 Chrome extension with three runtime surfaces:

- `src/background/service-worker.js`: coordinates model loading, active-tab analysis, Tavily or Theseus web-search enrichment, deterministic scoring, and federation processing.
- `src/content/content-script.js`: extracts visible page text and renders claim markers and panels in an isolated rail.
- `src/popup/popup.js`: handles onboarding, model progress, analysis controls, settings, and result summary.

## Analysis Pipeline

The active-page pipeline is model-first after onboarding:

1. The popup sends `MSG_START_MODEL_LOAD`.
2. `src/background/model-loader.js` initializes one shared `MLCRunner` and broadcasts `MSG_MODEL_PROGRESS`.
3. `MLCRunner` preflights the hosted model route at `https://travisgilbert.me/act`, falls back to a public WebLLM model when allowed, and creates the WebLLM engine.
4. `MSG_ANALYZE_PAGE` collects page text from the content script.
5. WebLLM classifies content type and extracts ACC feature JSON.
6. `src/background/tavily-client.js` optionally enriches the top claims through Tavily or Theseus web search.
7. `src/inference/scoring.js` computes the ACC v2.1 score locally and emits claim mini graphs.
8. Federation processing adds correlation badge data without sending page text or claim text.
9. The content script maps claim character ranges back to page segments and paints the rail.

## Model Artifacts

The primary model config is in `src/shared/config.js`:

- `MLC_MANIFEST_URL`: `https://travisgilbert.me/act`
- `MODEL_VERSION`: configured WebLLM model id
- `MLC_MODEL_LIB_URL`: hosted WebGPU WASM library under `/act`

The fallback model is `Llama-3.2-1B-Instruct-q4f16_1-MLC` from public WebLLM-compatible artifact URLs.

## Privacy Boundary

Page text is processed locally by the extension and WebLLM runtime. Model artifact hosts receive only artifact download requests. Tavily and Theseus web-search enrichment send selected claim queries only when enabled by settings. Federation submissions omit article text, claim text, page URL, and page content.

## Algorithm Boundary

The JavaScript scorer preserves the extension's legacy extraction feature names
for compatibility, but maps them into the canonical ACC v2.1 trait vocabulary:
`support_ratio`, `falsifiability`, `rhetorical_pressure`, `source_quality`,
`contradiction_load`, and `citation_chain_collapse`. Scored claims expose the
same report-level fields as the Python package: rules, penalties, actions,
diagnostics, `claim_state`, `verification_gap`, `support_strength`, and
`epistemic_risk`.

## Validation Boundary

Automated tests cover the JavaScript scoring contract, prompt parsing and normalization, model-loader initialization, Tavily fallback behavior, rail and panel behavior, settings normalization, and popup message flow. Release validation still needs Chrome with WebGPU enabled for real model download and warm-cache startup checks.
