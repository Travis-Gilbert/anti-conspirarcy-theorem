import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const isWatch = process.argv.includes("--watch");
const isProd = process.env.NODE_ENV === "production";
const root = process.cwd();

function copyDirIfExists(src, dst) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dst, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const dstPath = path.join(dst, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirIfExists(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function copyFileIfExists(src, dst) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

const copyStaticPlugin = {
  name: "copy-static",
  setup() {
    copyDirIfExists(path.join(root, "assets", "fonts"), path.join(root, "dist", "assets", "fonts"));
    copyFileIfExists(
      path.join(root, "src", "inference", "data", "domains_v1.json"),
      path.join(root, "dist", "data", "domains_v1.json"),
    );
    copyFileIfExists(path.join(root, "src", "popup", "popup.html"), path.join(root, "dist", "popup.html"));
    copyFileIfExists(path.join(root, "src", "popup", "popup.css"), path.join(root, "dist", "popup.css"));
  },
};

const shared = {
  bundle: true,
  sourcemap: isProd ? false : true,
  minify: isProd,
  loader: {
    ".css": "css",
    ".woff2": "file",
  },
  external: ["node:fs/promises"],
  plugins: [copyStaticPlugin],
};

const jobs = [
  {
    entryPoints: ["src/background/service-worker.js"],
    outfile: "dist/background.js",
    format: "esm",
    target: "chrome120",
  },
  {
    entryPoints: ["src/content/content-script.js"],
    outfile: "dist/content.js",
    format: "iife",
    target: "chrome120",
  },
  {
    entryPoints: ["src/popup/popup.js"],
    outfile: "dist/popup.js",
    format: "iife",
    target: "chrome120",
  },
];

const run = async () => {
  if (isWatch) {
    const contexts = await Promise.all(jobs.map((cfg) => build({ ...shared, ...cfg, write: false })));
    for (const result of contexts) {
      for (const output of result.outputFiles || []) {
        const outPath = output.path;
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, output.contents);
      }
    }
    await Promise.all(
      jobs.map(async (cfg) => {
        const ctx = await (await import("esbuild")).context({ ...shared, ...cfg });
        await ctx.watch();
      }),
    );
    return;
  }

  fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
  await Promise.all(jobs.map((cfg) => build({ ...shared, ...cfg })));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
