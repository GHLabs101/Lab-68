const core = require("@actions/core");

async function run() {
  try {
    const name = (core.getInput("name") || "world").trim();
    if (!name) {
      core.setFailed("Input 'name' cannot be empty.");
      return;
    }
    const msg = `👋 Hello, ${name} (from JS Lite)!`;
    console.log(msg);
    core.setOutput("message", msg);
  } catch (err) {
    core.setFailed(`Action failed: ${err?.message || err}`);
  }
}

run();
