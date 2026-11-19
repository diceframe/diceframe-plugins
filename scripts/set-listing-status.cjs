"use strict";

const fs = require("fs");
const path = require("path");
const { buildCatalog } = require("./catalog.cjs");
const { readJson, validateRegistry, writeJson, LISTING_STATUSES } = require("./registry.cjs");

function setListingStatus(entries, details, id, status, reason, at) {
  if (!LISTING_STATUSES.has(status)) {
    throw new Error("listing status must be one of: " + [...LISTING_STATUSES].join(", "));
  }
  const entry = entries.find(item => String(item && item.id || "") === id);
  const detail = details.find(item => String(item && item.id || "") === id);
  if (!entry || !detail) throw new Error("unknown plugin id: " + id);
  const nextReason = String(reason || "").trim();
  if (status !== "approved" && !nextReason) {
    throw new Error("paused and withdrawn listings require a reason");
  }
  for (const item of [entry, detail]) {
    item.listing_status = status;
    if (status === "approved") {
      delete item.listing_status_reason;
      delete item.listing_status_at;
    } else {
      item.listing_status_reason = nextReason;
      item.listing_status_at = at;
    }
  }
  return { id, listing_status: status, ...(nextReason ? { listing_status_reason: nextReason } : {}) };
}

function updateFiles(root, id, status, reason, at) {
  const entries = readJson(path.join(root, "plugins.json"));
  const details = readJson(path.join(root, "plugin_details.json"));
  const result = setListingStatus(entries, details, id, status, reason, at);
  validateRegistry(entries, details);
  const writes = [
    [path.join(root, "plugins.json"), entries],
    [path.join(root, "plugin_details.json"), details],
    [path.join(root, "catalog.json"), buildCatalog(details)],
  ];
  const token = process.pid + "-" + Date.now();
  const staged = [];
  const backups = [];
  try {
    for (const [target, value] of writes) {
      const temp = target + ".tmp-" + token;
      writeJson(temp, value);
      staged.push([temp, target]);
    }
    for (const [, target] of staged) {
      if (fs.existsSync(target)) {
        const backup = target + ".bak-" + token;
        fs.renameSync(target, backup);
        backups.push([backup, target]);
      }
    }
    for (const [temp, target] of staged) fs.renameSync(temp, target);
    for (const [backup] of backups) fs.rmSync(backup, { force: true });
  } catch (error) {
    for (const [temp] of staged) fs.rmSync(temp, { force: true });
    for (const [, target] of staged) {
      if (fs.existsSync(target)) fs.rmSync(target, { force: true });
    }
    for (const [backup, target] of backups) {
      if (fs.existsSync(backup)) fs.renameSync(backup, target);
    }
    throw error;
  }
  return result;
}

if (require.main === module) {
  const [, , id, status, reason, atArg] = process.argv;
  if (!id || !status || (status !== "approved" && !reason)) {
    console.error("usage: node scripts/set-listing-status.cjs <id> <approved|paused|withdrawn> [reason] [ISO-8601 time]");
    process.exitCode = 2;
  } else {
    try {
      const result = updateFiles(path.resolve(__dirname, ".."), id, status, reason, atArg || new Date().toISOString());
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = { setListingStatus, updateFiles };
