# 投稿模板 / Submission templates

这些目录是**给作者用的骨架**，不是索引内容。把它们复制到作者自己的仓库（或作为 GitHub
template repository 的初始内容）再发布。

## content-pack/

内容包（世界、资料册、角色模板、冒险模组）的最小可发布仓库：

```
plugin.json          插件声明，改 id / name / description / version / contributes
config.schema.json   配置表单
README.md            仓库说明（索引要求存在）
LICENSE              许可证（索引要求存在）
content/             你的数据文件
.github/workflows/publish.yml
                     每次推送校验 + 打 .dfplugin + 版本变化时自动建 Release
```

流程：复制 → 改 `plugin.json` → 放内容 → 推送 → Action 建好 Release → 到索引仓库提
「添加插件」Issue（填 `id` 与仓库地址）。

注意：

- `plugin.json.id` 用短横线小写（如 `my-content-pack`），必须与提交 Issue 时填的 ID 一致
- `version` 必须是三段式（`0.1.0`）；改版本号并推送，Action 才会建新的 Release
- 校验器要求目录名与 `id` 一致，`publish.yml` 已经在临时目录里复制成 `<id>` 再校验
- 不要在本仓库里提 PR 添加自己的包——投稿走 Issue，作者保留源码仓库
