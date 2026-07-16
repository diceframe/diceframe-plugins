# DiceFrame 插件收录指南

欢迎提交 DiceFrame 插件。本仓库用于收录社区插件索引，帮助用户在 DiceFrame 插件商店中发现和安装插件。

## 插件仓库要求

插件建议放在独立公开 GitHub 仓库，仓库根目录至少包含：

- `plugin.json`
- `config.schema.json`
- `README_CN.md`
- `LICENSE`，推荐但暂不强制

`plugin.json` 必须遵守 DiceFrame 插件标准：

```json
{
  "schema_version": 1,
  "id": "example-plugin",
  "name": "示例插件",
  "version": "0.1.0",
  "description": "一句话说明插件用途",
  "entrypoint": ["{python}", "plugins/example-plugin/main.py"],
  "config_schema": "config.schema.json",
  "capabilities": ["bot-adapter"],
  "docs": "README_CN.md"
}
```

## 索引条目

向 `plugins.json` 添加轻量条目：

```json
{
  "id": "example-plugin",
  "repositoryUrl": "https://github.com/username/example-plugin",
  "branch": "main"
}
```

向 `plugin_details.json` 添加商店展示条目：

```json
{
  "id": "example-plugin",
  "repository_url": "https://github.com/username/example-plugin",
  "branch": "main",
  "tags": ["adapter"],
  "manifest": {
    "schema_version": 1,
    "id": "example-plugin",
    "name": "示例插件",
    "version": "0.1.0",
    "description": "一句话说明插件用途",
    "capabilities": ["bot-adapter"],
    "docs": "README_CN.md"
  }
}
```

如果插件仓库不是“根目录即插件目录”的结构，请提供 `package_url`，指向已经按 DiceFrame 标准打好的 zip 包。

## 收录检查

- 插件 ID 与 `plugin.json.id` 一致。
- 插件包内只有一个 `plugin.json`。
- 不包含 token、cookie、私钥、个人路径和运行数据。
- 配置项中的敏感字段使用 `ui.control: "secret"` 或 `ui.sensitive: true`。
- README 写清安装、配置、使用和卸载注意事项。
