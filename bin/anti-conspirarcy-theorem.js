#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yazl from "yazl";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const extensionRoot = path.join(repoRoot, "browser-extension");
const runtimeEntries = ["dist", "manifest.json", "assets"];
const defaultZipName = "anti-conspirarcy-theorem-extension.zip";

async function main() {
  const args = process.argv.slice(2);
  const [area, command] = args;

  if (!area || area === "help" || area === "--help" || area === "-h") {
    printHelp();
    return;
  }

  if (area === "version" || area === "--version" || area === "-v") {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
    console.log(pkg.version);
    return;
  }

  if (area !== "extension") {
    fail(`Unknown command area: ${area}`);
  }

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printExtensionHelp();
    return;
  }

  const options = parseOptions(args.slice(2));
  if (command === "build") {
    await buildExtension();
    console.log(`Built extension runtime in ${path.relative(process.cwd(), path.join(extensionRoot, "dist"))}`);
    return;
  }
  if (command === "package" || command === "zip") {
    await buildExtension();
    const outPath = path.resolve(process.cwd(), options.out || defaultZipName);
    await packageExtension(outPath);
    console.log(`Wrote ${outPath}`);
    return;
  }
  if (command === "unpack") {
    await buildExtension();
    const outDir = path.resolve(process.cwd(), options.out || "anti-conspirarcy-theorem-extension");
    await unpackExtension(outDir);
    console.log(`Wrote load-unpacked extension to ${outDir}`);
    console.log("Open chrome://extensions, enable Developer mode, then Load unpacked from that folder.");
    return;
  }
  if (command === "instructions") {
    printInstallInstructions();
    return;
  }

  fail(`Unknown extension command: ${command}`);
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--out") {
      const value = args[index + 1];
      if (!value) {
        fail("--out requires a path");
      }
      options.out = value;
      index += 1;
    } else if (arg.startsWith("--out=")) {
      options.out = arg.slice("--out=".length);
    } else {
      fail(`Unknown option: ${arg}`);
    }
  }
  return options;
}

async function buildExtension() {
  await run(process.execPath, ["esbuild.config.mjs"], {
    cwd: extensionRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function packageExtension(outPath) {
  ensureRuntimeEntries();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await new Promise((resolve, reject) => {
    const zip = new yazl.ZipFile();
    for (const entry of runtimeEntries) {
      addToZip(zip, path.join(extensionRoot, entry), entry);
    }
    zip.end();
    zip.outputStream
      .pipe(fs.createWriteStream(outPath))
      .on("close", resolve)
      .on("error", reject);
  });
}

async function unpackExtension(outDir) {
  ensureRuntimeEntries();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of runtimeEntries) {
    copyRecursive(path.join(extensionRoot, entry), path.join(outDir, entry));
  }
}

function ensureRuntimeEntries() {
  for (const entry of runtimeEntries) {
    const fullPath = path.join(extensionRoot, entry);
    if (!fs.existsSync(fullPath)) {
      fail(`Missing extension runtime entry after build: ${fullPath}`);
    }
  }
}

function addToZip(zip, fullPath, zipPath) {
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(fullPath)) {
      if (shouldSkip(child)) {
        continue;
      }
      addToZip(zip, path.join(fullPath, child), path.posix.join(zipPath, child));
    }
    return;
  }
  zip.addFile(fullPath, zipPath, {
    mtime: new Date(0),
    mode: stat.mode,
  });
}

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (shouldSkip(child)) {
        continue;
      }
      copyRecursive(path.join(src, child), path.join(dst, child));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function shouldSkip(name) {
  return name === ".DS_Store" || name.endsWith(".map");
}

function printHelp() {
  console.log(`Anti-Conspiracy Theorem

Usage:
  npx anti-conspirarcy-theorem extension package [--out ./extension.zip]
  npx anti-conspirarcy-theorem extension unpack [--out ./extension-folder]
  npx anti-conspirarcy-theorem extension build
  npx anti-conspirarcy-theorem extension instructions

Aliases:
  npx anti-conspiracy-theorem ...
  npx act-theorem ...
`);
}

function printExtensionHelp() {
  console.log(`Browser extension commands:

  extension build
    Build dist/ assets used by Chrome.

  extension package [--out ./extension.zip]
    Build and write a Chrome extension ZIP.

  extension unpack [--out ./extension-folder]
    Build and write a folder for chrome://extensions -> Load unpacked.

  extension instructions
    Print local install steps.
`);
}

function printInstallInstructions() {
  console.log(`Chrome local install:

1. Run:
   npx anti-conspirarcy-theorem extension unpack --out ./anti-conspirarcy-theorem-extension

2. Open:
   chrome://extensions

3. Enable Developer mode.

4. Click "Load unpacked" and choose:
   ./anti-conspirarcy-theorem-extension

Release ZIP:
   npx anti-conspirarcy-theorem extension package --out ./anti-conspirarcy-theorem-extension.zip
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  fail(error?.message || String(error));
});
