# DiceFrame 插件仓库

这里是 DiceFrame 社区插件索引仓库。DiceFrame 主程序的插件商店会读取本仓库的 `plugin_details.json`，并通过镜像源在国内网络环境下提高访问成功率。

## 文件说明

- `plugins.json`：轻量插件列表，便于人工审查和脚本处理。
- `plugin_details.json`：插件商店读取的完整索引。
- `schemas/plugin_details.schema.json`：`plugin_details.json` 的结构说明。
- `CONTRIBUTING.md`：插件提交和收录规则。

## 当前状态

插件商店索引刚建立，默认列表为空。后续每个插件建议使用独立公开 GitHub 仓库，并在仓库根目录放置 DiceFrame 标准 `plugin.json`、`config.schema.json` 和 `README_CN.md`。

## 镜像源

DiceFrame 主程序会按镜像源优先级尝试读取本仓库的 raw 文件。镜像源只用于提高可用性，不改变插件来源展示；安装前仍会校验插件包内的 `plugin.json`。
