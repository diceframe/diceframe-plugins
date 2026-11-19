"use strict";

const path = require("path");
const { generateDetails, readJson, writeJson } = require("./registry.cjs");
const { buildCatalog } = require("./catalog.cjs");

async function main() {
  const root = path.resolve(__dirname, "..");
  const entries = readJson(path.join(root, "plugins.json"));
  const { details, warnings } = await generateDetails(entries, process.env.GITHUB_TOKEN || "");
  const syncFailures = warnings.filter(item => String(item).includes(": 同步失败："));
  if (syncFailures.length) {
    throw new Error(`同步未完成，保留现有 plugin_details.json：${syncFailures.join(" | ")}`);
  }
  writeJson(path.join(root, "plugin_details.json"), details);
  writeJson(path.join(root, "catalog.json"), buildCatalog(details));
  for (const warning of warnings) console.warn(`::warning::${warning}`);
  console.log(`Generated ${details.length} plugin detail record(s).`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
