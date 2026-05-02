import { MLCRunner } from "../inference/mlc-runner.js";
import { MLC_MANIFEST_URL } from "../shared/config.js";

const listeners = new Set();

let runner = null;
let runnerPromise = null;
let lastProgress = {
  percent: 0,
  mbLoaded: 0,
  mbTotal: 0,
  stage: "idle",
};

export async function getRunner(options = {}) {
  if (runner?.getState() === "ready") {
    return runner;
  }
  if (runnerPromise) {
    return runnerPromise;
  }

  const runnerFactory = options.runnerFactory || defaultRunnerFactory;
  runner = runnerFactory({
    ...options.runnerOptions,
    onProgress: emitProgress,
  });
  runnerPromise = runner.initialize()
    .then((readyRunner) => {
      emitProgress(readyRunner.getLoadProgress());
      return readyRunner;
    })
    .catch((error) => {
      emitProgress({ ...lastProgress, stage: "error" });
      runner = null;
      throw error;
    })
    .finally(() => {
      runnerPromise = null;
    });
  return runnerPromise;
}

export function isReady() {
  return runner?.getState() === "ready";
}

export function getModelState() {
  return {
    ready: isReady(),
    state: runner?.getState() || "uninitialized",
    progress: { ...lastProgress },
    model: runner?.getModelInfo?.() || null,
  };
}

export function subscribeToProgress(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }
  listeners.add(listener);
  listener({ ...lastProgress });
  return () => listeners.delete(listener);
}

export function resetModelLoaderForTests() {
  runner = null;
  runnerPromise = null;
  lastProgress = {
    percent: 0,
    mbLoaded: 0,
    mbTotal: 0,
    stage: "idle",
  };
  listeners.clear();
}

function defaultRunnerFactory(options) {
  return new MLCRunner(MLC_MANIFEST_URL, options);
}

function emitProgress(progress) {
  lastProgress = {
    ...lastProgress,
    ...progress,
  };
  for (const listener of listeners) {
    listener({ ...lastProgress });
  }
}
