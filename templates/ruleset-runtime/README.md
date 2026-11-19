# 我的规则运行时 / My ruleset runtime

> 用这个模板起一个外部规则运行时仓库。它以独立进程运行，通过 DiceFrame 的
> RuntimeProbe JSON-lines 协议提供规则能力；它不是在 DiceFrame 进程内 import
> 任意 Python 模块。

## 必须修改的地方

1. 修改 `plugin.json` 的 `id`、名称、版本、描述和 `ruleset_runtime.runtime_id`。
2. 在 `ruleset_runtime.capabilities` 中只声明实际实现的能力。
3. 实现 `runtime.py` 中的操作处理器，并保持每个响应的 `request_id` 不变。
4. 更新 README、LICENSE 和发布说明，然后创建一个非草稿、非预发布 Release。

运行时声明中的 `runtime_id` 和 `runtime_version` 必须与内容包的
`requires.rulesets` 绑定一致。`ruleset.execute` 是必需权限；它代表运行时参与
角色、检定、战斗或版本化状态的权威结算。

## 协议边界

宿主使用不经过 shell 的 stdio JSON-lines 进程，单次请求和响应都必须是 JSON 对象。
响应至少包含：

```json
{"request_id":"与请求相同","ok":true,"result":{}}
```

超时、非法 JSON、请求 ID 不一致、未知能力或不完整状态桥都会让运行时保持不可用。
不要在运行时里读取宿主凭据，也不要依赖调用方当前工作目录。

## 发布

复制这个目录到自己的公开仓库根目录，提交并推送到 `main`。Action 会复用 DiceFrame
主项目的插件校验器，生成 `.dfplugin` 并在版本变化时创建 `v<version>` Release。
通过校验后，再到插件中心提交「添加插件」Issue。外部规则运行时属于高风险进程插件，
更新只提醒，不会静默安装。
