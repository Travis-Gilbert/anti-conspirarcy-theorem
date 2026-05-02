import {
  MLC_FALLBACK_MANIFEST_URL,
  MLC_FALLBACK_MODEL_LIB_URL,
  MLC_FALLBACK_MODEL_VERSION,
  MLC_MODEL_CONTEXT_WINDOW,
  MLC_MODEL_LIB_URL,
  MLC_MODEL_VRAM_MB,
  MODEL_VERSION,
} from "../shared/config.js";
import {
  CLASSIFY_RESPONSE_SCHEMA,
  EXTRACTION_RESPONSE_SCHEMA,
  buildClassifyPrompt,
  buildExtractPrompt,
  normalizeClassification,
  normalizeExtraction,
  parseModelJson,
} from "./gemma-prompts.js";

const DEFAULT_TIMEOUT_MS = 45000;
const DEFAULT_PARSE_RETRIES = 1;
const DEFAULT_CLASSIFY_TOKENS = 160;
const DEFAULT_EXTRACT_TOKENS = 1800;

const INITIAL_PROGRESS = Object.freeze({
  percent: 0,
  mbLoaded: 0,
  mbTotal: 0,
  stage: "idle",
});

export class MLCRunner {
  constructor(manifestUrl, options = {}) {
    this.manifestUrl = manifestUrl;
    this.options = options;
    this.modelId = options.modelId || MODEL_VERSION;
    this.modelLibUrl = options.modelLibUrl || MLC_MODEL_LIB_URL;
    this.fallbackModelId = options.fallbackModelId || MLC_FALLBACK_MODEL_VERSION;
    this.fallbackManifestUrl = options.fallbackManifestUrl || MLC_FALLBACK_MANIFEST_URL;
    this.fallbackModelLibUrl = options.fallbackModelLibUrl || MLC_FALLBACK_MODEL_LIB_URL;
    this.preflightFetch = options.preflightFetch || (options.createEngine ? null : globalThis.fetch?.bind(globalThis));
    this.createEngine = options.createEngine || defaultCreateEngine;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.parseRetries = options.parseRetries ?? DEFAULT_PARSE_RETRIES;
    this.engine = null;
    this.state = "uninitialized";
    this.loadProgress = { ...INITIAL_PROGRESS };
    this.initPromise = null;
    this.lastError = null;
    this.modelFallbackReason = null;
  }

  async initialize() {
    if (this.state === "ready") {
      return this;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.setState("loading");
    this.setProgress({ percent: 0, stage: "loading" });
    this.initPromise = this.prepareModelAssets()
      .then(() => this.createEngine(this.modelId, {
        appConfig: this.buildAppConfig(),
        initProgressCallback: (progress) => this.handleInitProgress(progress),
        logLevel: this.options.logLevel || "INFO",
      }, this.options.chatOpts))
      .then((engine) => {
        this.engine = engine;
        this.setProgress({ percent: 100, stage: "ready" });
        this.setState("ready");
        return this;
      })
      .catch((error) => {
        this.lastError = error;
        this.setState("error");
        this.setProgress({ stage: "error" });
        this.initPromise = null;
        throw error;
      });
    return this.initPromise;
  }

  async classifyContent(text, pageMeta = {}) {
    await this.initialize();
    const prompt = buildClassifyPrompt(text, pageMeta);
    const payload = await this.runJsonCompletion({
      prompt,
      schema: CLASSIFY_RESPONSE_SCHEMA,
      maxTokens: this.options.classifyMaxTokens || DEFAULT_CLASSIFY_TOKENS,
      task: "classify content",
    });
    return normalizeClassification(payload);
  }

  async extractFeatures(text, contentType = "factual", pageMeta = {}) {
    await this.initialize();
    const prompt = buildExtractPrompt(text, contentType, pageMeta);
    const payload = await this.runJsonCompletion({
      prompt,
      schema: EXTRACTION_RESPONSE_SCHEMA,
      maxTokens: this.options.extractMaxTokens || DEFAULT_EXTRACT_TOKENS,
      task: "extract ACC features",
    });
    return normalizeExtraction(payload, text, pageMeta);
  }

  getState() {
    return this.state;
  }

  getLoadProgress() {
    return { ...this.loadProgress };
  }

  getModelInfo() {
    return {
      model_id: this.modelId,
      model_url: this.manifestUrl,
      model_lib_url: this.modelLibUrl,
      fallback_active: Boolean(this.modelFallbackReason),
      fallback_reason: this.modelFallbackReason,
    };
  }

  async prepareModelAssets() {
    if (!this.preflightFetch) {
      return;
    }
    try {
      await assertModelAssetsReachable(this.preflightFetch, this.manifestUrl, this.modelLibUrl);
    } catch (error) {
      if (this.options.allowHostedModelFallback === false) {
        throw error;
      }
      this.modelFallbackReason = String(error?.message || error);
      this.modelId = this.fallbackModelId;
      this.manifestUrl = this.fallbackManifestUrl;
      this.modelLibUrl = this.fallbackModelLibUrl;
      this.setProgress({ stage: "loading fallback model" });
    }
  }

  buildAppConfig() {
    return {
      useIndexedDBCache: this.options.useIndexedDBCache !== false,
      model_list: [
        {
          model: this.manifestUrl,
          model_id: this.modelId,
          model_lib: this.modelLibUrl,
          vram_required_MB: this.options.vramRequiredMb || MLC_MODEL_VRAM_MB,
          low_resource_required: false,
          required_features: ["shader-f16"],
          overrides: {
            context_window_size: this.options.contextWindowSize || MLC_MODEL_CONTEXT_WINDOW,
          },
        },
      ],
    };
  }

  async runJsonCompletion({ prompt, schema, maxTokens, task }) {
    const messages = [
      {
        role: "system",
        content: "You are an ACC extraction engine. Return only valid JSON. Do not include prose.",
      },
      { role: "user", content: prompt },
    ];
    let lastError = null;

    for (let attempt = 0; attempt <= this.parseRetries; attempt += 1) {
      const response = await withTimeout(
        this.engine.chat.completions.create({
          messages,
          temperature: 0,
          top_p: 1,
          max_tokens: maxTokens,
          stream: false,
          response_format: {
            type: "json_object",
            schema: JSON.stringify(schema),
          },
        }),
        this.timeoutMs,
        `Timed out while trying to ${task}`,
      );
      const raw = responseToText(response);
      try {
        return parseModelJson(raw);
      } catch (error) {
        lastError = error;
        if (attempt >= this.parseRetries) {
          break;
        }
        messages.push(
          { role: "assistant", content: raw.slice(0, 4000) },
          {
            role: "user",
            content: "Repair the previous answer. Return only a single valid JSON object that follows the requested schema.",
          },
        );
      }
    }

    throw new Error(`Could not parse model JSON for ${task}: ${lastError?.message || "unknown parse error"}`);
  }

  handleInitProgress(progress) {
    this.setProgress(normalizeProgress(progress));
  }

  setState(state) {
    this.state = state;
  }

  setProgress(progress) {
    this.loadProgress = {
      ...this.loadProgress,
      ...progress,
    };
    if (typeof this.options.onProgress === "function") {
      this.options.onProgress(this.getLoadProgress());
    }
  }
}

async function defaultCreateEngine(modelId, engineConfig, chatOpts) {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  return CreateMLCEngine(modelId, engineConfig, chatOpts);
}

async function assertModelAssetsReachable(fetchImpl, manifestUrl, modelLibUrl) {
  await assertReachable(fetchImpl, manifestUrl, "MLC model manifest");
  await assertReachable(fetchImpl, modelLibUrl, "MLC model library");
}

async function assertReachable(fetchImpl, url, label) {
  const response = await fetchImpl(url, { method: "HEAD", cache: "no-store" });
  if (response?.ok) {
    return;
  }
  if (response?.status === 405 || response?.status === 403) {
    const fallback = await fetchImpl(url, {
      method: "GET",
      cache: "no-store",
      headers: { range: "bytes=0-0" },
    });
    if (fallback?.ok || fallback?.status === 206) {
      return;
    }
    throw new Error(`${label} unavailable at ${url} (${fallback?.status || "fetch failed"})`);
  }
  throw new Error(`${label} unavailable at ${url} (${response?.status || "fetch failed"})`);
}

function normalizeProgress(progress) {
  if (!progress || typeof progress !== "object") {
    return {};
  }
  const percent = progress.percent ?? progress.progress;
  const normalized = {};
  if (Number.isFinite(Number(percent))) {
    normalized.percent = Math.max(0, Math.min(100, Number(percent) <= 1 ? Number(percent) * 100 : Number(percent)));
  }
  if (Number.isFinite(Number(progress.mbLoaded))) {
    normalized.mbLoaded = Number(progress.mbLoaded);
  }
  if (Number.isFinite(Number(progress.mbTotal))) {
    normalized.mbTotal = Number(progress.mbTotal);
  }
  if (progress.text) {
    normalized.stage = String(progress.text).slice(0, 120);
  } else if (progress.stage) {
    normalized.stage = String(progress.stage).slice(0, 120);
  }
  return normalized;
}

function responseToText(response) {
  const message = response?.choices?.[0]?.message?.content;
  if (Array.isArray(message)) {
    return message
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        return part?.text || "";
      })
      .join("");
  }
  return String(message || "");
}

function withTimeout(promise, timeoutMs, message) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
