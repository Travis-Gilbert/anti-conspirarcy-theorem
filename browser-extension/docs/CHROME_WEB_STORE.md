# Chrome Web Store Checklist

This document captures the current Chrome Web Store submission path for the Anti-Conspiracy Theorem extension.

## Current package

- Extension name: Anti-Conspiracy Theorem
- Manifest version: 3
- Extension version: 0.2.0
- Algorithm version: ACC 2.1.0
- Package command: `npm run extension:package`
- Upload ZIP: `browser-extension/release/anti-conspirarcy-theorem-extension.zip`
- Homepage URL: `https://travisgilbert.me/act`
- Privacy policy URL candidate: public URL for `browser-extension/docs/PRIVACY.md`

## Pre-submit checks

```bash
PATH=/Library/Frameworks/Python.framework/Versions/3.13/bin:$PATH TMPDIR=/var/tmp npm run test
npm run extension:build
npm run extension:package
npm pack --dry-run
```

## Store listing draft

Single purpose:

> Analyze the active web page for claim structure, evidence strength, source diversity, falsifiability, and rhetorical pressure using the Anti-Conspiracy Constraint scorer.

Short description:

> Structural ACC analysis of web articles with local claim scoring.

Detailed description:

> Anti-Conspiracy Theorem helps readers inspect how a page makes factual claims. It collects text from the active tab after the user starts an analysis, extracts candidate claims, scores each claim with the open ACC 2.1 algorithm, and renders a claim rail plus score summary. The default scoring path is local to the extension. Optional enrichment can query Tavily or a Theseus web-search endpoint when enabled in settings.

Category suggestion: Productivity.

## Permission justifications

- `activeTab`: lets the extension inspect the current tab only when the user invokes analysis.
- `scripting`: injects or repairs the content script used to collect readable page text and render claim markers.
- `storage`: stores local settings, optional Tavily credentials, and optional federation identity data.
- `host_permissions: <all_urls>`: lets the content script run on arbitrary article pages that the user chooses to inspect.

## Data use disclosure

The extension processes active-page text to provide claim analysis. It does not include analytics or telemetry. Page text is not sent to model artifact hosts. Optional Tavily or Theseus enrichment sends selected claim queries only when enabled by the user. Optional federation does not send article text, claim text, page URL, or page content.

The privacy policy should include the Chrome Web Store Limited Use statement before submission:

> The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Review blocker before public submission

Chrome Web Store Manifest V3 policy disallows remotely hosted executable logic. The current WebLLM runtime is packaged with the extension, but the configured model library is a remote `.wasm` URL. Treat that `.wasm` as policy-sensitive executable code until proven otherwise.

Before pressing "Submit for Review", choose one path:

1. Package the required WebLLM `.wasm` model library inside the extension ZIP and reference it with an extension-local URL.
2. Create a Chrome Web Store build that disables WebLLM loading and ships only the deterministic local scorer plus optional user-enabled search enrichment.

Do not mark "No remote code" in the dashboard until the selected store build no longer executes remote `.wasm`.

## Dashboard steps

1. Open the Chrome Developer Dashboard.
2. Add new item.
3. Upload `browser-extension/release/anti-conspirarcy-theorem-extension.zip`.
4. Fill Store Listing with the draft text above and add required images.
5. Fill Privacy with single purpose, permission justifications, user data disclosures, and privacy policy URL.
6. Fill Distribution and visibility.
7. Add test instructions for loading a model, analyzing an active tab, and using deterministic scoring.
8. Submit for review only after the remote `.wasm` issue is resolved.
