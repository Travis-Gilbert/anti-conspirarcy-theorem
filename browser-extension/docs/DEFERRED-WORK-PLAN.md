# Deferred Work Plan Status

## Implemented Batches

Batches 3 through 7 are implemented on `main`:

- Batch 3: WebLLM runner, prompt wiring, JSON normalization, model progress, preflight, fallback model, and singleton loader.
- Batch 4: typed settings, Tavily client, Theseus web-search fallback, and queued background analysis pipeline.
- Batch 5: paragraph extraction, character mapping, closed shadow root rail, scroll and resize refresh, and stacked dots.
- Batch 6: claim panel hover, pin, Escape, outside click, and focus return behavior.
- Batch 7: popup onboarding, model loading, settings persistence, analysis controls, and result summary.

## Live Model Route

The shipping config points at a WebLLM-compatible Gemma artifact set:

- route descriptor: `https://huggingface.co/mlc-ai/gemma-2-2b-it-q4f16_1-MLC`
- chat config: `https://travisgilbert.me/act/resolve/main/mlc-chat-config.json`
- WebGPU library: `https://travisgilbert.me/act/gemma-2-2b-it-q4f16_1-ctx4k_cs1k-webgpu.wasm`

If the hosted route is unavailable, the runner can fall back to `Llama-3.2-1B-Instruct-q4f16_1-MLC` from public WebLLM-compatible artifact URLs.

## Remaining Release Validation

Before a release candidate, validate in Chrome with WebGPU enabled:

- Load the unpacked extension and complete first-run model onboarding.
- Confirm cold model download and warm-cache startup.
- Confirm the hosted `/act` route, `mlc-chat-config.json`, and WebGPU WASM library return 200.
- Run one Tavily-enabled analysis with a real user key.
- Run one analysis with Tavily disabled and Theseus fallback enabled.
- Exercise at least three article pages and verify rail alignment, popup state, panel keyboard behavior, and no host style bleed.
- Confirm no page text or claim text is logged during model load, analysis, Tavily fallback errors, or federation processing.

## Readiness Checklist

- `npm run build`
- `npm run lint`
- `npm run test`
- Package ZIP loads cleanly in Chrome without extension warnings.
- Three real article runs pass: trustworthy, mixed, and unreliable.
