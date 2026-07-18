"use strict";

const fs = require("fs");
const path = require("path");
const {
  generateDetails,
  githubApi,
  loadReleaseSnapshot,
  normalizeRepositoryUrl,
  parseSubmission,
  readJson,
  writeJson,
} = require("./registry.cjs");

const ROOT = path.resolve(__dirname, "..");
const EVENT = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const REPOSITORY = process.env.GITHUB_REPOSITORY;
const [OWNER, REPO] = REPOSITORY.split("/");
const TOKEN = process.env.GITHUB_TOKEN || "";
const ISSUE = EVENT.issue;
const ISSUE_NUMBER = ISSUE.number;
const LABELS = {
  "plugin-submission": ["8250df", "Plugin submission"],
  "pending-validation": ["d4c5f9", "Waiting for automated validation"],
  "validated": ["0e8a16", "Automated validation passed"],
  "validation-failed": ["d73a4a", "Automated validation failed"],
  "approved": ["1d76db", "Approved and added to the registry"],
  "rejected": ["b60205", "Rejected by a maintainer"],
};

async function comment(body) {
  await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/comments`, { token: TOKEN, method: "POST", body: { body } });
}

async function ensureLabel(name) {
  const existing = await githubApi(`/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(name)}`, { token: TOKEN, allow404: true });
  if (!existing) {
    const [color, description] = LABELS[name];
    await githubApi(`/repos/${OWNER}/${REPO}/labels`, { token: TOKEN, method: "POST", body: { name, color, description } });
  }
}

async function setStatusLabel(name) {
  for (const label of Object.keys(LABELS)) await ensureLabel(label);
  const liveIssue = await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`, { token: TOKEN });
  const current = new Set((liveIssue.labels || []).map(label => label.name));
  for (const label of ["pending-validation", "validated", "validation-failed", "approved", "rejected"]) {
    if (label !== name && current.has(label)) {
      await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/labels/${encodeURIComponent(label)}`, { token: TOKEN, method: "DELETE", allow404: true });
    }
  }
  await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/labels`, { token: TOKEN, method: "POST", body: { labels: ["plugin-submission", name] } });
}

async function permission(login) {
  const result = await githubApi(`/repos/${OWNER}/${REPO}/collaborators/${encodeURIComponent(login)}/permission`, { token: TOKEN, allow404: true });
  return result ? result.permission : "none";
}

async function requireMaintainer() {
  const login = EVENT.comment.user.login;
  if (!["admin", "maintain", "write"].includes(await permission(login))) throw new Error("只有仓库维护者可以执行此命令");
  return login;
}

async function validate() {
  if (!/^\[Plugin Submission\]/i.test(ISSUE.title)) return;
  if (EVENT.comment && !/^\/recheck\s*$/i.test(EVENT.comment.body.trim())) return;
  if (EVENT.comment) {
    const login = EVENT.comment.user.login;
    if (login !== ISSUE.user.login && !["admin", "maintain", "write"].includes(await permission(login))) {
      throw new Error("只有投稿者或维护者可以重新检查");
    }
  }
  await setStatusLabel("pending-validation");
  try {
    const submission = parseSubmission(ISSUE.body);
    if (!submission.id || !submission.repositoryUrl) throw new Error("请使用添加插件模板并填写插件 ID 与仓库地址");
    const parsed = normalizeRepositoryUrl(submission.repositoryUrl);
    const entries = readJson(path.join(ROOT, "plugins.json"));
    if (entries.some(item => item.id === submission.id)) throw new Error(`插件 ID 已存在：${submission.id}`);
    if (entries.some(item => String(item.repository_url || "").toLowerCase() === parsed.url.toLowerCase())) throw new Error("该仓库已经收录");
    const snapshot = await loadReleaseSnapshot(parsed.url, submission.id, TOKEN);
    const marker = Buffer.from(JSON.stringify({
      id: submission.id,
      repository_url: snapshot.repositoryUrl,
      branch: snapshot.branch,
      release_tag: snapshot.releaseTag,
      commit_sha: snapshot.commitSha,
      version: snapshot.manifest.version,
      risk_level: snapshot.riskLevel,
      update_policy: snapshot.updatePolicy,
      permissions: snapshot.permissions,
      capabilities: snapshot.capabilities,
      manifest: snapshot.manifest,
    })).toString("base64url");
    await setStatusLabel("validated");
    await comment(`## ✅ 自动检查通过 / Validation passed\n\n| 项目 | 结果 |\n|---|---|\n| 插件 | \`${submission.id}\` ${snapshot.manifest.name} |\n| 版本 | \`${snapshot.manifest.version}\` / \`${snapshot.releaseTag}\` |\n| 固定提交 | \`${snapshot.commitSha}\` |\n| 风险等级 | \`${snapshot.riskLevel}\` |\n| 更新策略 | \`${snapshot.updatePolicy}\` |\n| 权限 | ${snapshot.permissions.length ? snapshot.permissions.map(item => `\`${item}\``).join(", ") : "无"} |\n\n${snapshot.summary}\n\n自动检查只证明格式和机器可验证条件合格，不代表代码绝对安全。维护者确认后回复 \`/approve\`；拒绝请回复 \`/reject 原因\`。\n\n<!-- diceframe-validation:${marker} -->`);
  } catch (error) {
    await setStatusLabel("validation-failed");
    await comment(`## ❌ 自动检查失败 / Validation failed\n\n${error.message}\n\n修复插件仓库后回复 \`/recheck\`。`);
    process.exitCode = 1;
  }
}

async function latestMarker() {
  const comments = await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/comments?per_page=100`, { token: TOKEN });
  for (const item of comments.slice().reverse()) {
    if (item.user && item.user.login === "github-actions[bot]") {
      const match = String(item.body || "").match(/<!-- diceframe-validation:([A-Za-z0-9_-]+) -->/);
      if (match) return JSON.parse(Buffer.from(match[1], "base64url").toString("utf8"));
    }
  }
  throw new Error("找不到有效的自动检查记录，请先回复 /recheck");
}

async function approve() {
  if (!EVENT.comment || !/^\/approve\s*$/i.test(EVENT.comment.body.trim())) return;
  const approvedBy = await requireMaintainer();
  const marker = await latestMarker();
  const submission = parseSubmission(ISSUE.body);
  const normalized = normalizeRepositoryUrl(submission.repositoryUrl);
  if (marker.id !== submission.id || marker.repository_url.toLowerCase() !== normalized.url.toLowerCase()) {
    throw new Error("投稿内容在检查后发生变化，请先回复 /recheck");
  }
  const current = await loadReleaseSnapshot(marker.repository_url, marker.id, TOKEN);
  if (current.commitSha !== marker.commit_sha || current.releaseTag !== marker.release_tag) {
    throw new Error("插件最新 Release 在检查后发生变化，请先回复 /recheck");
  }
  const entriesPath = path.join(ROOT, "plugins.json");
  const entries = readJson(entriesPath);
  if (entries.some(item => item.id === marker.id)) throw new Error(`插件 ID 已存在：${marker.id}`);
  entries.push({
    id: marker.id,
    repository_url: marker.repository_url,
    branch: marker.branch,
    approved_release_tag: marker.release_tag,
    approved_commit: marker.commit_sha,
    risk_level: marker.risk_level,
    update_policy: marker.update_policy,
    approved_permissions: marker.permissions,
    trust_level: "community",
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  });
  entries.sort((a, b) => a.id.localeCompare(b.id));
  writeJson(entriesPath, entries);
  const generated = await generateDetails(entries, TOKEN);
  writeJson(path.join(ROOT, "plugin_details.json"), generated.details);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `plugin_id=${marker.id}\napproved_by=${approvedBy}\n`, "utf8");
}

async function finish() {
  const pluginId = process.env.PLUGIN_ID;
  const approvedBy = process.env.APPROVED_BY;
  await setStatusLabel("approved");
  await comment(`## ✅ 已收录 / Approved\n\n插件 \`${pluginId}\` 已由 @${approvedBy} 批准并加入 DiceFrame 插件中心。后续 Release 会按风险等级自动同步或只提醒更新。`);
  await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`, { token: TOKEN, method: "PATCH", body: { state: "closed" } });
}

async function reject() {
  if (!EVENT.comment || !/^\/reject(?:\s+[\s\S]+)?$/i.test(EVENT.comment.body.trim())) return;
  const rejectedBy = await requireMaintainer();
  const reason = EVENT.comment.body.trim().replace(/^\/reject\s*/i, "").trim() || "未提供原因";
  await setStatusLabel("rejected");
  await comment(`## ❌ 未收录 / Rejected\n\n维护者：@${rejectedBy}\n\n原因：${reason}`);
  await githubApi(`/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`, { token: TOKEN, method: "PATCH", body: { state: "closed" } });
}

const command = process.argv[2];
({ validate, approve, finish, reject }[command] || (() => { throw new Error(`Unknown command: ${command}`); }))()
  .catch(async error => {
    console.error(error.stack || error.message);
    if (command === "approve") await comment(`## ❌ 批准失败\n\n${error.message}`).catch(() => {});
    process.exitCode = 1;
  });
