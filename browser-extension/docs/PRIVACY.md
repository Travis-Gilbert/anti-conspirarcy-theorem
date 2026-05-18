# Privacy

This extension is local first by design.

- No telemetry is sent.
- No analytics is included.
- WebLLM model artifacts are downloaded from the hosted `/act` route or public fallback artifact hosts.
- Page text is processed locally by WebLLM and is not sent to model artifact hosts.
- Tavily and Theseus web-search enrichment send selected claim queries only when enabled by settings.
- Tavily is optional and uses user provided API credentials.
- Model runtime requires `wasm-unsafe-eval` for WebAssembly execution.

If federation is enabled, the extension or local peer sends ACC feature bins, score components, content type, cluster metadata, public key, and signature data. It does not send article text, claim text, page URL, or page content.

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
