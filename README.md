# DiceFrame 插件中心

中文 | [English](README_EN.md)

本仓库是 DiceFrame 社区插件的公开索引。插件源码由作者在各自 GitHub 仓库中维护。

## 投稿

插件作者在 [Issues](https://github.com/diceframe/diceframe-plugins/issues/new/choose) 中选择"添加插件"，只需填写插件 ID 和公开仓库地址。

内容包（世界、资料册、冒险模组）与其他插件一样需要自己的公开仓库：可以用 [`templates/content-pack/`](templates/content-pack) 起一个，里面已经带好 `plugin.json`、README、LICENSE 和自动建 Release 的 workflow。提供独立规则运行时的项目使用 [`templates/ruleset-runtime/`](templates/ruleset-runtime)；它是高风险外部进程，不会被当作 DiceFrame 第一方规则。

机器人会读取最新 GitHub Release，验证 `plugin.json`、版本、仓库结构、权限声明、README、LICENSE 和明显的秘密文件。验证通过后，维护者审核并决定是否收录：

```text
/approve
```

通过后，你的插件会出现在商店索引中，用户即可在 DiceFrame 的插件商店搜索到并安装。插件后续发布新版本时，商店会自动同步更新（见下方更新策略）。

拒绝时维护者回复：

```text
/reject 原因
```

未通过会说明原因，按提示调整后可以重新提交。

完整要求见 [贡献指南](CONTRIBUTING.md)。


## 更新策略

- 声明型 `content-pack`、`theme`、`voice-pack`：权限和运行方式不变时，只检测并提示新版本，由用户确认后更新。
- `ruleset-runtime`：通过 RuntimeProbe stdio 进程参与规则权威结算，始终只提醒更新；必须声明 `ruleset_runtime` 和 `ruleset.execute`。
- 包含 Python、Node、EXE 或其他进程入口的插件：只提示新版本，不静默更新。
- 新版本增加权限、改变运行方式、转移仓库或更换插件 ID：暂停更新并要求重新审核。
- 内置插件（如 QQ / NapCat）：随 DiceFrame 主程序发布，不从商店重复安装。

索引仓库每天自动同步一次插件信息（北京时间约 11:17），用于生成静态目录。新目录条目包含维护者批准的 Release/commit/归档 SHA-256；DiceFrame 客户端对带批准身份的条目只下载并校验该确切工件，不会改查作者仓库的 latest。批准记录缺失、hash 不符、索引同步失败或条目已暂停时，安装会停止并保留旧索引/旧安装。

维护者可以在索引中把条目标记为 `paused`（暂停）或 `withdrawn`（撤回），同时记录原因和时间。客户端会继续显示状态与已安装信息，但不会为这类条目提供新的安装或更新入口；该状态不会远程删除用户已经安装的文件。

状态变更可运行 node scripts/set-listing-status.cjs <id> <approved|paused|withdrawn> [reason] [ISO-8601 time]；脚本会同时更新两层索引和 catalog.json，并在写入前运行一致性校验。

## 安全说明

自动检查通过只代表格式和机器可验证条件合格，不代表插件代码绝对安全。包含可执行代码的第三方插件会以明确的高风险等级展示；收录也不等于 DiceFrame 为其安全性背书。

## 开发文档

- [DiceFrame 主项目](https://github.com/diceframe/diceframe)
- [插件开发指南](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/plugin-development.md)
- [插件索引与审核规则](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/plugin-registry.md)
- [Bot Bridge 核心](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/bot-bridge-core.md)
- [发布音色预设](https://github.com/diceframe/diceframe-content/blob/main/docs/zh/voice-pack-publishing.md)

本索引仓库使用 MIT License。各插件使用其自身仓库声明的许可证。
