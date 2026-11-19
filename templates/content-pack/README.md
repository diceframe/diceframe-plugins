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
   `supported_locales`，以及 `contributes` 里你实际会提供的目录。模板默认是通用内容包；
   如果内容只适用于某个系统，删掉 `system_agnostic`，改用下面的规则声明。
2. 把导出的内容放进 `content/`（世界模板放 `content/worlds/`，资料册放 `content/lorebooks/`）。
3. 提交并推送 → 等 Action 变绿 → 它自动建 Release。之后去索引仓库提「添加插件」Issue，
   填 `plugin.json` 里的 `id` 和本仓库地址。

## 声明适用规则（必须选一种）

DiceFrame 的「在线内容包」按规则筛选，靠的是 manifest 里的声明。**运行时依赖**和
**规则归属标签**是两件事，别写混：

| 你的情况 | 写什么 | 后果 |
|---|---|---|
| 依赖某个**已注册**的规则运行时（D&D 2024 → `core:dnd2024`） | `"requires": { "rulesets": [{ "id": "core:dnd2024" }] }` | 客户端没有该运行时 → **装不上**（这是有意的硬依赖） |
| 内容面向某个**还没有运行时**的系统（如 CoC 7 版） | `"compatible_rulesets": ["coc7"]` | 只作市场归属标签：能装、能按 CoC 筛到，但**不**代表提供 CoC 运行时 |
| 与规则无关（纯世界设定、地图、资料册） | `"system_agnostic": true` | 任何规则筛选下都会出现，标为「通用」 |

规则：

- `compatible_rulesets` 是字符串数组，最多 6 条；`coc` / `core:coc7` 会被归一化到 `coc7`
- 它和 `system_agnostic: true` **互斥**（通用包不该限定具体规则）
- 只有标签、没有运行时的包可以通过校验并发布；等对应运行时落地后，如果你的内容**真的**
  依赖它的能力，再迁到 `requires.rulesets`，不要为了「看起来更正式」平白加硬依赖
- 两个字段都不写，索引会给出 warning，客户端只能把它归入「规则未标注」

## 内容包与冒险模组

普通世界、资料册和资源包保持默认的 `content_profile: "content-pack"`。
如果仓库提供可运行的冒险包，使用：

```json
{
  "content_profile": "adventure-module",
  "content_delivery_mode": "catalog",
  "adventure_packages": ["adventures/my-adventure"]
}
```

冒险模组安装时只注册内容目录，运行冒险时才按需物化；不能通过启用动作把内容静默
灌入普通世界或角色库。冒险包目录必须包含 `manifest.json`，并通过 DiceFrame 主项目
的完整内容校验。

## 内容规范

同人内容、改编内容、图片素材的边界见
[插件索引与审核规则](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/plugin-registry.md)。
没有授权证明的同人包只能保持 `community` 标记，不能打包从原作提取的立绘、规则书正文、音乐或字体。
