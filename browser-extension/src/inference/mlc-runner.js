export class MLCRunner {
  constructor(manifestUrl, options = {}) {
    this.manifestUrl = manifestUrl;
    this.options = options;
  }

  async initialize() {
    throw new Error("Deferred to Batch 3");
  }

  async classifyContent() {
    throw new Error("Deferred to Batch 3");
  }

  async extractFeatures() {
    throw new Error("Deferred to Batch 3");
  }

  getState() {
    return "uninitialized";
  }

  getLoadProgress() {
    return { percent: 0, mbLoaded: 0, mbTotal: 0, stage: "idle" };
  }
}
