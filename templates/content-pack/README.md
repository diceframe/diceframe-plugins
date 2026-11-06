# 我的内容包 / My content pack

> 用这个模板起一个新内容包仓库：把下面的占位内容改成你自己的东西，然后发一个正式 Release。

## 这个仓库最少要有什么

```
plugin.json            ← 插件声明；id 必须用短横线小写 id（如 my-content-pack）
config.schema.json     ← 配置表单；plugin.json 的 config_schema 指向它
README.md 或 README_CN.md
LICENSE 或 LICENSE.md
content/               ← 你的世界 / 资料册 / 角色模板等数据
```

根目录还有一个 `.github/workflows/publish.yml`：每次往 `main` 推送，它会用 DiceFrame 的校验器检查这个包，
打出一个 `.dfplugin`，并在版本号变化时自动创建 `v<version>` 的 Release。

## 三步发布

1. 改 `plugin.json`：`id`、`name`、`description`、`version`（三段式，如 `0.1.0`）、
   `supported_locales`，以及 `contributes` 里你实际会提供的目录。
2. 把导出的内容放进 `content/`（世界模板放 `content/worlds/`，资料册放 `content/lorebooks/`）。
3. 提交并推送 → 等 Action 变绿 → 它自动建 Release。之后去索引仓库提「添加插件」Issue，
   填 `plugin.json` 里的 `id` 和本仓库地址。

## 内容规范

同人内容、改编内容、图片素材的边界见
[插件索引与审核规则](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/plugin-registry.md)。
没有授权证明的同人包只能保持 `community` 标记，不能打包从原作提取的立绘、规则书正文、音乐或字体。
