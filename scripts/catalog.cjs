"use strict";

const { rulesetTargets } = require("./registry.cjs");

function stringList(value) {
  return Array.isArray(value) ? [...new Set(value.map(item => String(item || "").trim()).filter(Boolean))] : [];
}

function publicLatest(item, manifest) {
  const latest = item.latest && typeof item.latest === "object" ? item.latest : {};
  return {
    version: String(latest.version || item.version || manifest.version || ""),
    release_tag: String(latest.release_tag || item.release_tag || ""),
    release_url: String(latest.release_url || item.release_url || ""),
    commit_sha: String(latest.commit_sha || item.commit_sha || ""),
    published_at: String(latest.published_at || ""),
    requires_approval: Boolean(latest.requires_approval),
  };
}

function buildCatalog(details) {
  if (!Array.isArray(details)) throw new Error("plugin_details.json 必须是数组");
  return {
    schema_version: 1,
    entries: details.map(item => {
      if (!item || typeof item !== "object" || !item.id) throw new Error("catalog 条目缺少 id");
      const manifest = item.manifest && typeof item.manifest === "object" ? item.manifest : {};
      const id = String(item.id);
      const status = String(item.listing_status || (item.installable === false ? "blocked" : "approved"));
      const targets = rulesetTargets(manifest);
      const entry = {
        id,
        name: String(item.name || manifest.name || id),
        version: String(item.version || item.latest?.version || manifest.version || ""),
        summary: String(item.description || manifest.description || ""),
        plugin_type: String(item.plugin_type || manifest.plugin_type || ""),
        installable: item.listing_status === "paused" || item.listing_status === "withdrawn"
          ? false
          : item.installable !== false,
        status,
        risk_level: String(item.risk_level || "unknown"),
        update_policy: String(item.update_policy || "blocked"),
        repository_url: String(item.repository_url || ""),
        archive_url: String(item.archive_url || ""),
        release_tag: String(item.release_tag || ""),
        release_url: String(item.release_url || ""),
        branch: String(item.branch || "main"),
        author: String(item.author || ""),
        stars: Number(item.stars) || 0,
        trust_level: String(item.trust_level || "community"),
        tags: stringList(item.tags),
        permissions: stringList(item.permissions || manifest.permissions),
        approved_permissions: stringList(item.approved_permissions),
        capabilities: stringList(item.capabilities || manifest.capabilities),
        latest: publicLatest(item, manifest),
        commit_sha: String(item.commit_sha || ""),
        approved_release_tag: String(item.approved_release_tag || ""),
        approved_commit: String(item.approved_commit || ""),
        approved_archive_url: String(item.approved_archive_url || ""),
        approved_artifact_sha256: String(item.approved_artifact_sha256 || "").toLowerCase(),
        docs: String(item.docs || manifest.docs || ""),
        homepage: String(item.homepage || manifest.urls?.homepage || item.repository_url || ""),
        content_profile: String(manifest.content_profile || "content-pack"),
        content_delivery_mode: String(manifest.content_delivery_mode || "legacy_autoimport"),
        ruleset_targets: targets,
        ruleset_declared: targets.length > 0,
        system_agnostic: manifest.system_agnostic === true,
        adventure_count: Array.isArray(manifest.adventure_packages) ? manifest.adventure_packages.length : 0,
        automation_level: String(manifest.automation_level || ""),
        languages: stringList(manifest.supported_locales),
        min_app_version: String(item.min_app_version || manifest.min_app_version || ""),
      };
      if (item.listing_status_reason) entry.status_reason = String(item.listing_status_reason);
      if (item.listing_status_at) entry.status_at = String(item.listing_status_at);
      if (item.verification_error) entry.verification_error = String(item.verification_error);
      if (entry.approved_archive_url && entry.approved_artifact_sha256) {
        entry.artifact = {
          distribution: "approved-archive",
          url: entry.approved_archive_url,
          sha256: entry.approved_artifact_sha256,
        };
      }
      return entry;
    }),
  };
}

function validateCatalog(catalog, details) {
  if (!catalog || catalog.schema_version !== 1 || !Array.isArray(catalog.entries)) {
    throw new Error("catalog.json 必须是 schema_version 1 的对象");
  }
  const expectedIds = new Set((Array.isArray(details) ? details : []).map(item => String(item && item.id || "")));
  const ids = new Set();
  for (const entry of catalog.entries) {
    if (!entry || typeof entry !== "object" || !String(entry.id || "")) throw new Error("catalog 条目缺少 id");
    if (ids.has(entry.id)) throw new Error(`catalog 包含重复 ID：${entry.id}`);
    ids.add(entry.id);
    if (!expectedIds.has(entry.id)) throw new Error(`catalog 包含未知 ID：${entry.id}`);
    if (!Array.isArray(entry.permissions) || !Array.isArray(entry.approved_permissions)) {
      throw new Error(`${entry.id} 的 catalog 权限字段必须是数组`);
    }
    if (!entry.latest || typeof entry.latest !== "object") throw new Error(`${entry.id} 缺少 latest`);
    if (entry.artifact && (!/^https:\/\//.test(entry.artifact.url) || !/^[0-9a-f]{64}$/.test(entry.artifact.sha256))) {
      throw new Error(`${entry.id} 的 catalog 工件身份无效`);
    }
  }
  if (ids.size !== expectedIds.size) throw new Error("catalog 与 plugin_details.json 的 ID 不一致");
  return true;
}

module.exports = { buildCatalog, validateCatalog };
