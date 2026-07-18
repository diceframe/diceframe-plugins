# DiceFrame 插件中心

中文 | [English](README_EN.md)

本仓库是 DiceFrame 社区插件的公开索引。插件源码由作者在各自 GitHub 仓库中维护；这里不复制插件源码，也不保存作者制作的 ZIP 包。

## 投稿

插件作者在 [Issues](https://github.com/diceframe/diceframe-plugins/issues/new/choose) 中选择“添加插件”，只需填写插件 ID 和公开仓库地址。无需 Fork、无需修改 JSON、无需计算 SHA-256。

机器人会读取最新 GitHub Release，验证 `plugin.json`、版本、仓库结构、权限声明、README、LICENSE 和明显的秘密文件。验证通过后，维护者只需回复：

```text
/approve
```

拒绝时回复：

```text
/reject 原因
```

完整要求见 [贡献指南](CONTRIBUTING.md)。

## 更新策略

- 声明型 `content-pack`、`theme`、`map-pack`：权限和运行方式不变时可自动更新。
- 包含 Python、Node、EXE 或其他进程入口的插件：只提示新版本，不静默更新。
- 新版本增加权限、改变运行方式、转移仓库或更换插件 ID：暂停更新并要求重新审核。
- 内置插件（如 QQ / NapCat）：随 DiceFrame 主程序发布，不从商店重复安装。

索引仓库的每日同步只是展示缓存。DiceFrame 客户端安装或检查更新时会直接解析作者仓库最新 Release，因此定时任务停止不会阻断插件更新。

## 安全说明

自动检查通过只代表格式和机器可验证条件合格，不代表插件代码绝对安全。包含可执行代码的第三方插件会以明确的高风险等级展示；收录也不等于 DiceFrame 为其安全性背书。

## 开发文档

- [DiceFrame 主项目](https://github.com/diceframe/diceframe)
- [插件开发指南](https://github.com/diceframe/diceframe/blob/main/docs/PLUGIN_DEVELOPMENT_CN.md)
- [插件索引与审核规则](https://github.com/diceframe/diceframe/blob/main/docs/PLUGIN_REGISTRY_CN.md)

本索引仓库使用 MIT License。各插件使用其自身仓库声明的许可证。
