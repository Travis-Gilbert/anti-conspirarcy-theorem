# Privacy

This extension is local first by design.

- No telemetry is sent.
- No analytics is included.
- Tavily is optional and uses user provided API credentials.
- Model runtime requires `wasm-unsafe-eval` for WebAssembly execution.

If federation is enabled, the extension or local peer sends ACC feature bins, score components, content type, cluster metadata, public key, and signature data. It does not send article text, claim text, page URL, or page content.
