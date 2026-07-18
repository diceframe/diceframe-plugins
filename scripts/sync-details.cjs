"use strict";

const path = require("path");
const { generateDetails, readJson, writeJson } = require("./registry.cjs");

async function main() {
  const root = path.resolve(__dirname, "..");
  const entries = readJson(path.join(root, "plugins.json"));
  const { details, warnings } = await generateDetails(entries, process.env.GITHUB_TOKEN || "");
  writeJson(path.join(root, "plugin_details.json"), details);
  for (const warning of warnings) console.warn(`::warning::${warning}`);
  console.log(`Generated ${details.length} plugin detail record(s).`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
