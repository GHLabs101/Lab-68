// dist/index.js
// Minimal single-file JS Action (no @actions/* deps needed)

"use strict";

const fs = require("fs");
const path = require("path");

// Helpers
function getInput(name, def = "") {
  const key = `INPUT_${name.replace(/ /g, "_").toUpperCase()}`;
  const val = process.env[key];
  return (val == null || val === "") ? def : String(val);
}

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (file) {
    // Single-line safe; if you need multi-line, use the <<EOF syntax
    fs.appendFileSync(file, `${name}=${value}\n`, { encoding: "utf8" });
  } else {
    // Fallback: print to console for visibility (not parsed by Actions)
    console.log(`[output] ${name}=${value}`);
  }
}

function setFailed(message) {
  console.error(`::error ::${message}`);
  process.exitCode = 1;
}

async function run() {
  try {
    const raw = getInput("name", "world");
    const name = raw.trim();

    if (!name) {
      setFailed("Input 'name' cannot be empty.");
      return;
    }
    if (name.length > 50) {
      setFailed("Input 'name' must be ≤ 50 characters.");
      return;
    }

    // Optional grouped debug (expandable in the UI)
    console.log("::group::Debug info");
    console.log(`Node version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`CWD: ${process.cwd()}`);
    console.log("::endgroup::");

    const msg = `👋 Hello, ${name} (from JS Lite)!`;
    console.log(msg);
    setOutput("message", msg);
  } catch (err) {
    setFailed(`Action failed: ${err && err.message ? err.message : String(err)}`);
  }
}

// Safety: surface unhandled rejections as failures
process.on("unhandledRejection", (err) => {
  setFailed(`Unhandled rejection: ${err && err.message ? err.message : String(err)}`);
});

run();
