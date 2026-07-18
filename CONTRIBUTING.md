# DiceFrame 插件收录指南

中文 | [English](CONTRIBUTING_EN.md)

## 作者需要准备什么

插件必须放在独立、公开的 GitHub 仓库中，且仓库根目录就是插件目录。根目录至少包含：

- `plugin.json`
- `README_CN.md` 或 `README.md`
- `LICENSE` 或 `LICENSE.md`
- `config.schema.json`（如果 `plugin.json.config_schema` 声明了它）

插件必须先创建至少一个非草稿、非预发布的 GitHub Release。Release 指向的版本中，`plugin.json.version` 必须使用三段式版本号，例如 `1.0.0`。

作者不需要上传插件 ZIP，也不需要计算 SHA-256。DiceFrame 使用 Release 所指向的固定 Git commit 下载仓库源码快照。

## 第一次投稿

1. 打开 [添加插件](https://github.com/diceframe/diceframe-plugins/issues/new/choose)。
2. 填写插件 ID 和公开仓库地址。
3. 等待机器人评论检查结果。
4. 如果失败，按错误修改自己的仓库，然后回复 `/recheck`。
5. 检查通过后等待维护者批准。

作者不应修改本仓库的 `plugins.json` 或 `plugin_details.json`。Pull Request 投稿方式不再使用。

## 后续更新

发布更新时，作者只需：

1. 更新 `plugin.json.version`。
2. 提交代码并创建新的 Git tag。
3. 创建非草稿、非预发布的 GitHub Release。

声明型插件在权限和运行方式不变时可自动更新。进程型插件只通知用户。增加权限、从声明型改为进程型、转移仓库或更换插件 ID 时，必须重新提交审核。

## 自动检查范围

自动检查会验证：

- GitHub 仓库公开、未归档，URL 与插件声明一致。
- 最新 Release、tag、固定 commit 和 `plugin.json` 可读取。
- 插件 ID、版本、类型、权限和必填字段合法。
- README、LICENSE 和配置 Schema 存在。
- 文件数量、总体积不超过安装限制。
- 没有 `.env`、私钥、凭据 JSON 等明显秘密文件。
- ID 和仓库没有重复收录。

自动检查不会执行插件入口代码，也不能证明代码没有恶意行为。

## 风险与更新等级

- `declarative`：无进程入口的内容、主题或地图插件；权限不扩大时允许自动更新。
- `unrestricted-process`：包含进程入口；以用户权限运行，只提示更新。
- `bundled`：由 DiceFrame 组织维护并随主程序发布。
- `approval-required`：新版本扩大权限或改变运行方式，暂停安装与更新。

收录表示插件符合索引规则，不构成安全保证或功能质量保证。
