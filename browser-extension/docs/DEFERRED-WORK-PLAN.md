# Deferred Work Plan (SPEC-EPI-2 B3-B7)

## Scope of deferral

The following batches are intentionally deferred after completing B1 and B2:

- Batch 3: MLC WebLLM integration and prompt wiring
- Batch 4: Tavily client and end to end background scoring pipeline
- Batch 5: Content script paragraph mapping and gutter rail rendering
- Batch 6: Claim panel hover expansion and pin behavior
- Batch 7: Popup onboarding, settings, and analysis control flow

## Why deferred

- Batch 3 depends on a real MLC manifest URL and verified artifact availability.
- Batch 3 and 4 require runtime validation in Chrome with WebGPU and service worker lifecycle behavior.
- Batch 5 to 7 require browser-level interaction QA and accessibility validation on real pages.

## Implementation status

Implemented in `codex/act-deferred-work`:

- Batch 3 WebLLM runner, prompt wiring, model progress, and singleton loader.
- Batch 4 typed settings, Tavily client, and queued background analysis pipeline.
- Batch 5 in-page rail, paragraph mapping refresh, closed shadow root, and stacked dots.
- Batch 6 claim panel hover, pin, Escape, outside click, and focus return behavior.
- Batch 7 popup onboarding, model loading, settings persistence, and analysis controls.

Live validation still required before release:

- The shipping config points at `https://travisgilbert.me/act`, which proxies the public WebLLM Gemma2 artifact set through the website deployment.
- The website `/act` route must continue to return 200 for the route descriptor, `/act/resolve/main/mlc-chat-config.json`, and `/act/gemma-2-2b-it-q4f16_1-ctx4k_cs1k-webgpu.wasm`.
- The runner preflights model URLs and falls back to a second public WebLLM-compatible model so onboarding fails soft instead of hard.
- Load the unpacked extension in Chrome with WebGPU enabled and confirm warm cache startup.
- Run one Tavily-enabled analysis with a real user key.
- Exercise three real article pages and verify rail alignment, popup flow, and keyboard behavior.

## Execution order

### Phase A: Batch 3 readiness (blocking)

1. Confirm MLC artifact compatibility
   - Verify `@mlc-ai/web-llm` supports `gemma-4-e4b-epistemic-dpo-v1` with `q4f16_1`.
   - Confirm exact manifest URL and SHA list from exported R2 artifact manifest.
2. Replace placeholders
   - `src/shared/config.js`: set real `MLC_MANIFEST_URL`.
   - `src/inference/gemma-prompts.js`: copy `classify_v1.txt` and `extract_v1.txt` verbatim.
3. Implement and test MLCRunner
   - Add initialize, classifyContent, extractFeatures, state, progress behavior.
   - Add parse retry and timeout errors.
4. Implement singleton model loader
   - Handle service worker restart and OPFS cache rehydrate.

Acceptance checks:
- Warm cache init under 10 seconds.
- JSON parse retry path validated.
- No content text logging.

### Phase B: Batch 4 background orchestration

1. Implement typed storage defaults in `src/shared/storage.js`.
2. Implement `src/background/tavily-client.js`:
   - Top 3 claim selection by specificity anchors.
   - Sequential rate limited calls.
   - Per claim error isolation and null fallback.
   - Theseus `/api/v2/theseus/web/search/` fallback when Tavily is unavailable, empty, or fails.
3. Replace placeholder service worker with full pipeline:
   - model ready checks
   - classify, extract, optional tavily, deterministic score
   - per claim mini graph generation
   - one concurrent job per tab with queueing

Acceptance checks:
- `MSG_ANALYZE_PAGE` returns full ScoreResult.
- Tavily disabled still returns valid score with null temporal redistribution.
- One claim failure in Tavily does not abort result.
- Theseus browser search can recover temporal evidence when Tavily is unavailable.

### Phase C: Batch 5 in-page rail system

1. Implement paragraph extraction and char mapping.
2. Implement closed shadow root rail and dot rendering with stacking.
3. Add scroll and resize raf-throttled position recompute.
4. Add font-face declarations and style tokens in shadow CSS.

Acceptance checks:
- Dot alignment remains stable while scrolling and resizing.
- Host page CSS does not bleed into rail.
- No host DOM mutation beyond root mount point.

### Phase D: Batch 6 claim panel interaction

1. Implement panel layout and anchoring logic.
2. Implement hover delay, leave delay, pin and unpin state.
3. Add keyboard and accessibility behavior.

Acceptance checks:
- One panel open at a time.
- Escape and outside click close behavior.
- Focus returns to originating dot.

### Phase E: Batch 7 popup and onboarding

1. Implement popup states:
   - first run flow
   - model download progress
   - analysis trigger and result summary
2. Implement settings panel and persistence:
   - Tavily key, rail position, rail visibility, motion override, typography.
3. Wire popup to background messages.

Acceptance checks:
- Fresh install onboarding complete.
- Settings persist across browser restarts.
- Keyboard navigation and visible focus indicators verified.

## Risk register

1. MLC model compatibility risk
   - Mitigation: gate Batch 3 behind explicit WebLLM support verification.
2. Manifest and CSP packaging mismatch risk
   - Mitigation: align manifest paths with packaged bundle strategy before release candidate.
3. Service worker eviction and state loss risk
   - Mitigation: model loader singleton plus explicit state recovery tests.
4. UI integration fragility on arbitrary sites
   - Mitigation: closed shadow root isolation and strict no host style leakage.

## Suggested milestone cadence

- Milestone 1 (1 day): Batch 3 complete and manually validated
- Milestone 2 (1 day): Batch 4 complete with mocked and real Tavily checks
- Milestone 3 (1 to 2 days): Batch 5 and Batch 6 complete with interaction QA
- Milestone 4 (1 day): Batch 7 complete, package and release candidate QA

## Release readiness checklist

Before contest submission, confirm:

- `npm run build && npm run lint && npm run test` all pass.
- ZIP package loads cleanly in Chrome without warnings.
- Three real article runs pass (trustworthy, mixed, unreliable).
- No em dash or en dash characters in repo source or docs.
