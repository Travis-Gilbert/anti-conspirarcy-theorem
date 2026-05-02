# Anti-Conspiracy Theorem Extension

The Anti-Conspiracy Theorem extension is a Manifest V3 Chrome extension for local ACC analysis of the active page.

## Current scope

The extension includes:

- Manifest V3 packaging that loads built files from `dist/`
- Popup analysis control for the active tab
- Content script paragraph extraction and claim marker rail
- Deterministic ACC scoring path that works without a model download
- ACC v2 trace output: evidence volume, geometric core, penalties, rules, and actions
- Build pipeline using esbuild
- Deterministic scoring algorithm JavaScript port
- Deterministic mini graph SVG renderer JavaScript port
- Domain list lookup JavaScript port
- WebLLM Gemma 2 classification and extraction path
- Optional Tavily plus Theseus web-search fallback enrichment
- Popup onboarding, model progress, settings persistence, and result summary
- Contract tests against Python generated fixtures

## Install

From the published npm package:

```bash
npx act-theorem install --out ./anti-conspirarcy-theorem-extension
```

Then open `chrome://extensions`, enable Developer mode, and load the unpacked folder.

From a local checkout:

1. `npm ci`
2. `npm run package`
3. Open `chrome://extensions`
4. Enable Developer mode
5. Load unpacked from this repository root, or unzip `release/anti-conspirarcy-theorem-extension.zip`

## Release ZIP

```bash
npm run package
```

The ZIP contains `manifest.json`, `dist/`, and `assets/`, which is the exact shape Chrome expects for the packaged extension.

## Privacy posture

- No telemetry is included.
- The default scorer runs locally in the extension.
- Model inference runs on device after the user starts the WebLLM model load.
- The primary model route is `https://travisgilbert.me/act`, which hosts the Gemma 2 WebLLM artifact set.
- The runner preflights the hosted model route and can fall back to `Llama-3.2-1B-Instruct-q4f16_1-MLC`.
- Model artifact hosts receive artifact download requests, not page text.
- Tavily lookups use user supplied credentials only.
- `wasm-unsafe-eval` is required in extension pages CSP to support WebAssembly runtime for WebLLM.

## Runtime pipeline

`MSG_START_MODEL_LOAD` initializes a singleton WebLLM runner and emits model progress updates. `MSG_ANALYZE_PAGE` collects active-page text, classifies content type with WebLLM, extracts ACC features with WebLLM, optionally enriches top claims through Tavily or Theseus web search, then scores locally with the deterministic ACC v2 scorer.

## Development

```bash
npm run build
npm run lint
npm run test
```
