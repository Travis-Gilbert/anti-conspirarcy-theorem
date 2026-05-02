import test from "node:test";
import assert from "node:assert/strict";

import {
  getModelState,
  getRunner,
  isReady,
  resetModelLoaderForTests,
  subscribeToProgress,
} from "../src/background/model-loader.js";

class FakeRunner {
  constructor(options) {
    this.options = options;
    this.state = "uninitialized";
    this.progress = {
      percent: 0,
      mbLoaded: 0,
      mbTotal: 0,
      stage: "idle",
    };
  }

  async initialize() {
    this.state = "loading";
    this.progress = {
      percent: 25,
      mbLoaded: 5,
      mbTotal: 20,
      stage: "downloading",
    };
    this.options.onProgress(this.progress);
    this.state = "ready";
    this.progress = {
      percent: 100,
      mbLoaded: 20,
      mbTotal: 20,
      stage: "ready",
    };
    this.options.onProgress(this.progress);
    return this;
  }

  getState() {
    return this.state;
  }

  getLoadProgress() {
    return { ...this.progress };
  }

  getModelInfo() {
    return { model_id: "fake-model" };
  }
}

test("model loader deduplicates concurrent initialization", async () => {
  resetModelLoaderForTests();
  const progressEvents = [];
  const unsubscribe = subscribeToProgress((progress) => progressEvents.push(progress));
  let created = 0;
  const runnerFactory = (options) => {
    created += 1;
    return new FakeRunner(options);
  };

  const [first, second] = await Promise.all([
    getRunner({ runnerFactory }),
    getRunner({ runnerFactory }),
  ]);

  assert.equal(created, 1);
  assert.equal(first, second);
  assert.equal(isReady(), true);
  assert.equal(getModelState().state, "ready");
  assert.equal(getModelState().model.model_id, "fake-model");
  assert.deepEqual(progressEvents.map((event) => event.stage), ["idle", "downloading", "ready", "ready"]);
  unsubscribe();
});

test("model loader clears failed initialization so a later call can retry", async () => {
  resetModelLoaderForTests();
  let created = 0;
  const failingFactory = () => ({
    async initialize() {
      created += 1;
      throw new Error("boom");
    },
    getState() {
      return "error";
    },
  });

  await assert.rejects(() => getRunner({ runnerFactory: failingFactory }), /boom/);
  await assert.rejects(() => getRunner({ runnerFactory: failingFactory }), /boom/);
  assert.equal(created, 2);
  assert.equal(isReady(), false);
});
