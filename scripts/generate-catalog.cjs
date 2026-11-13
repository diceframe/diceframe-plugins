"use strict";

const fs = require("fs");
const path = require("path");
const { buildCatalog } = require("./catalog.cjs");

const root = path.resolve(__dirname, "..");
const details = JSON.parse(fs.readFileSync(path.join(root, "plugin_details.json"), "utf8"));
const catalog = buildCatalog(details);
fs.writeFileSync(path.join(root, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Generated ${catalog.entries.length} catalog entr${catalog.entries.length === 1 ? "y" : "ies"}.`);
