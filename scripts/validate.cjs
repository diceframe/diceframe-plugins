"use strict";

const path = require("path");
const { readJson, validateRegistry } = require("./registry.cjs");

const root = path.resolve(__dirname, "..");
validateRegistry(
  readJson(path.join(root, "plugins.json")),
  readJson(path.join(root, "plugin_details.json")),
);
console.log("Registry structure is valid.");
