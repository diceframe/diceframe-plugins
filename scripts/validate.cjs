"use strict";

const path = require("path");
const { readJson, validateRegistry } = require("./registry.cjs");
const { buildCatalog, validateCatalog } = require("./catalog.cjs");

const root = path.resolve(__dirname, "..");
validateRegistry(
  readJson(path.join(root, "plugins.json")),
  readJson(path.join(root, "plugin_details.json")),
);
const catalog = readJson(path.join(root, "catalog.json"));
const details = readJson(path.join(root, "plugin_details.json"));
validateCatalog(catalog, details);
const expected = buildCatalog(details);
if (JSON.stringify(catalog) !== JSON.stringify(expected)) {
  throw new Error("catalog.json 与 plugin_details.json 不一致，请运行 scripts/generate-catalog.cjs");
}
console.log("Registry structure is valid.");
