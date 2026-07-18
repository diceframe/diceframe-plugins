"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addedPermissions,
  classifyManifest,
  effectivePermissions,
  normalizeRepositoryUrl,
  parseSubmission,
  validateRegistry,
  validateManifest,
} = require("../scripts/registry.cjs");

const baseManifest = {
  schema_version: 1,
  id: "demo-pack",
  name: "Demo",
  version: "1.2.3",
  description: "Demo pack",
  plugin_type: "content-pack",
  permissions: ["content.read"],
};

test("parses the GitHub issue form", () => {
  const result = parseSubmission("### 插件 ID / Plugin ID\n\ndemo-pack\n\n### 仓库地址 / Repository URL\n\nhttps://github.com/example/demo-pack\n");
  assert.equal(result.id, "demo-pack");
  assert.equal(result.repositoryUrl, "https://github.com/example/demo-pack");
});

test("normalizes a public GitHub repository URL", () => {
  assert.deepEqual(normalizeRepositoryUrl("https://github.com/example/demo.git"), {
    url: "https://github.com/example/demo", owner: "example", repo: "demo",
  });
  assert.throws(() => normalizeRepositoryUrl("https://example.com/repo"));
});

test("declarative plugins can auto-update", () => {
  assert.equal(classifyManifest(baseManifest).updatePolicy, "automatic");
});

test("process plugins only notify about updates", () => {
  const policy = classifyManifest({ ...baseManifest, plugin_type: "channel-adapter", entrypoint: ["{python}", "main.py"] });
  assert.equal(policy.riskLevel, "unrestricted-process");
  assert.equal(policy.updatePolicy, "notify");
});

test("manifest validation rejects unknown permissions", () => {
  assert.throws(
    () => validateManifest({ ...baseManifest, permissions: ["system.everything"] }, "demo-pack", "https://github.com/example/demo"),
    /未知权限/,
  );
});

test("permission expansion is detected", () => {
  assert.deepEqual(addedPermissions(["content.read"], ["content.read", "network.client"]), ["network.client"]);
});

test("permissions are inferred exactly like the host when omitted", () => {
  assert.deepEqual(
    effectivePermissions({ ...baseManifest, permissions: undefined }),
    ["content.import", "content.read", "plugin.config"],
  );
});

test("registry validation rejects duplicate IDs and mismatched details", () => {
  const entry = {
    id: "demo-pack",
    repository_url: "https://github.com/example/demo-pack",
    update_policy: "automatic",
    approved_permissions: ["content.read"],
  };
  assert.equal(validateRegistry([entry], [{ id: "demo-pack" }]), true);
  assert.throws(() => validateRegistry([entry, entry], [{ id: "demo-pack" }]), /重复插件 ID/);
  assert.throws(() => validateRegistry([entry], [{ id: "other-pack" }]), /ID 不一致/);
});
